use crate::database::{
    self,
    models::{Food, Tag},
    repository::{food, tag},
};
use rand::Rng;
use rusqlite::Connection;
use serde::{Deserialize, Serialize};

// 1. 获取随机数，需要获取全部已经启用的方法，与他们的权重
// 权重： 初始为101.各个 tag 对应的权重由分数决定。 food的101 累加自己包含的 tag 的权重
// 最终产物，输出食物与他的tag的组合

#[derive(Debug, Serialize, Deserialize)]
pub struct FoodTagCombination {
    food: Food,
    tags: Vec<Tag>,
}

// 通过 食物与它的tag计算的权重中间产物
#[derive(Clone)]
pub struct WeightedFood {
    food: Food,
    weight: i32,
}

// 获取带权重的全部食物
fn list_foods(conn: &Connection) -> Result<Vec<WeightedFood>, Box<dyn std::error::Error>> {
    let foods = food::get_all(conn, true)?;

    let mut weighted_foods = Vec::new();

    for food in foods {
        // 食物的标签ID需要解析一下 json -> 数组
        let tag_ids: Vec<String> = serde_json::from_str(&food.tags)?;
        let tags = tag::list_by_ids(conn, tag_ids)?;
        let mut weight_food: WeightedFood = WeightedFood {
            food: food,
            weight: 101,
        };

        for tag in &tags {
            weight_food.weight += tag.score;
        }
        weight_food.weight = weight_food.weight.max(1); // 最小权重为1
        weighted_foods.push(weight_food);
    }

    Ok(weighted_foods)
}

// 进行加权随机运算

fn weight_random_selection(weighted_foods: &[WeightedFood]) -> Option<WeightedFood> {
    let total_weight: i32 = weighted_foods.iter().map(|wf| wf.weight).sum();
    if total_weight == 0 {
        return None;
    }

    let mut rng = rand::rng();
    let random_weight = rng.random_range(0..total_weight);

    let mut cumulative_weight = 0;
    for food in weighted_foods {
        cumulative_weight += food.weight;
        if cumulative_weight > random_weight {
            return Some(food.clone());
        }
    }

    None
}

#[tauri::command]
pub fn get_recommendations(app_handle: tauri::AppHandle) -> Result<FoodTagCombination, String> {
    let connection = database::connection::create_connection(&app_handle)
        .map_err(|e| format!("Failed to create connection: {}", e))?;

    let weighted_foods =
        list_foods(&connection).map_err(|e| format!("Failed to list foods: {}", e))?;

    let selected_food = weight_random_selection(&weighted_foods).ok_or("Failed to select food")?;

    let tags = &selected_food.food.tags;

    let tag_ids: Vec<String> =
        serde_json::from_str(&tags).map_err(|e| format!("Failed to parse tags JSON: {}", e))?;

    let tags = tag::list_by_ids(&connection, tag_ids)
        .map_err(|e| format!("Failed to list tags by IDs: {}", e))?;

    Ok(FoodTagCombination {
        food: selected_food.food,
        tags: tags,
    })
}
