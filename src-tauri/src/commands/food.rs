use crate::commands::recommendation::FoodTagCombination;
use crate::database::{
    connection::create_connection,
    models::CreateFoodRequest,
    repository::{food, tag},
};

/// 创建食物
#[tauri::command]
pub fn create_food(
    app_handle: tauri::AppHandle,
    request: CreateFoodRequest,
) -> Result<FoodTagCombination, String> {
    let conn = create_connection(&app_handle).map_err(|e| e.to_string())?;

    let food = food::create(&conn, request.clone()).map_err(|e| e.to_string())?;

    // 获取标签详情
    let tag_ids: Vec<String> =
        serde_json::from_str(&food.tags).map_err(|e| format!("Failed to parse tags: {}", e))?;

    let tags = if !tag_ids.is_empty() {
        tag::list_by_ids(&conn, tag_ids).map_err(|e| e.to_string())?
    } else {
        Vec::new()
    };

    Ok(FoodTagCombination { food, tags })
}

/// 根据ID获取食物
#[tauri::command]
pub fn get_food_by_id(
    app_handle: tauri::AppHandle,
    id: String,
) -> Result<Option<FoodTagCombination>, String> {
    let conn = create_connection(&app_handle).map_err(|e| e.to_string())?;

    match food::get_by_id(&conn, &id).map_err(|e| e.to_string())? {
        Some(food) => {
            let tag_ids: Vec<String> = serde_json::from_str(&food.tags)
                .map_err(|e| format!("Failed to parse tags: {}", e))?;

            let tags = if !tag_ids.is_empty() {
                tag::list_by_ids(&conn, tag_ids).map_err(|e| e.to_string())?
            } else {
                Vec::new()
            };

            Ok(Some(FoodTagCombination { food, tags }))
        }
        None => Ok(None),
    }
}

/// 获取所有食物
#[tauri::command]
pub fn get_all_foods(
    app_handle: tauri::AppHandle,
    enabled_only: bool,
) -> Result<Vec<FoodTagCombination>, String> {
    let conn = create_connection(&app_handle).map_err(|e| e.to_string())?;

    let foods = food::get_all(&conn, enabled_only).map_err(|e| e.to_string())?;

    let mut result = Vec::new();
    for food in foods {
        let tag_ids: Vec<String> = serde_json::from_str(&food.tags).unwrap_or_else(|_| Vec::new());

        let tags = if !tag_ids.is_empty() {
            tag::list_by_ids(&conn, tag_ids.clone()).unwrap_or_else(|_| Vec::new())
        } else {
            Vec::new()
        };

        result.push(FoodTagCombination { food, tags });
    }

    Ok(result)
}

/// 更新食物
#[tauri::command]
pub fn update_food(
    app_handle: tauri::AppHandle,
    id: String,
    request: CreateFoodRequest,
) -> Result<FoodTagCombination, String> {
    let conn = create_connection(&app_handle).map_err(|e| e.to_string())?;

    let food = food::update(&conn, &id, request).map_err(|e| e.to_string())?;

    let tag_ids: Vec<String> =
        serde_json::from_str(&food.tags).map_err(|e| format!("Failed to parse tags: {}", e))?;

    let tags = if !tag_ids.is_empty() {
        tag::list_by_ids(&conn, tag_ids).map_err(|e| e.to_string())?
    } else {
        Vec::new()
    };

    Ok(FoodTagCombination { food, tags })
}

/// 删除食物
#[tauri::command]
pub fn delete_food(app_handle: tauri::AppHandle, id: String) -> Result<(), String> {
    let conn = create_connection(&app_handle).map_err(|e| e.to_string())?;
    food::delete(&conn, &id).map_err(|e| e.to_string())
}

/// 禁用食物
#[tauri::command]
pub fn disable_food(app_handle: tauri::AppHandle, id: String) -> Result<(), String> {
    let conn = create_connection(&app_handle).map_err(|e| e.to_string())?;
    food::disable(&conn, &id).map_err(|e| e.to_string())
}

/// 启用食物
#[tauri::command]
pub fn enable_food(app_handle: tauri::AppHandle, id: String) -> Result<(), String> {
    let conn = create_connection(&app_handle).map_err(|e| e.to_string())?;
    food::enable(&conn, &id).map_err(|e| e.to_string())
}
