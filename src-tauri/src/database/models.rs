use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Food {
    pub id: String,
    pub icon: Option<String>,
    pub name: String,
    pub tags: String, // JSON 数组字符串
    pub enabled: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Tag {
    pub id: String,
    pub icon: Option<String>,
    pub name: String,
    // 分数 -100 ~ 100
    pub score: i32,
    pub created_at: String, // Sqlite DATA 类型
    pub updated_at: String,
}

// DTO 主要是为了 tags
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateFoodRequest {
    pub name: String,
    pub icon: Option<String>,
    pub tag_uuids: Vec<String>, // 接收数组，内部转换为 JSON
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateTagRequest {
    pub name: String,
    pub icon: Option<String>,
    pub score: i32,
}
