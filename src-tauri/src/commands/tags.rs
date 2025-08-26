use crate::database::{
    connection::create_connection,
    models::{CreateTagRequest, Tag},
    repository::tag,
};

/// 创建标签
#[tauri::command]
pub fn create_tag(
    app_handle: tauri::AppHandle,
    request: CreateTagRequest,
) -> Result<Tag, String> {
    let conn = create_connection(&app_handle).map_err(|e| e.to_string())?;
    tag::create(&conn, request).map_err(|e| e.to_string())
}

/// 根据ID获取标签
#[tauri::command]
pub fn get_tag_by_id(
    app_handle: tauri::AppHandle,
    id: String,
) -> Result<Option<Tag>, String> {
    let conn = create_connection(&app_handle).map_err(|e| e.to_string())?;
    tag::get_by_id(&conn, &id).map_err(|e| e.to_string())
}

/// 获取所有标签
#[tauri::command]
pub fn get_all_tags(app_handle: tauri::AppHandle) -> Result<Vec<Tag>, String> {
    let conn = create_connection(&app_handle).map_err(|e| e.to_string())?;
    tag::get_all(&conn).map_err(|e| e.to_string())
}

/// 更新标签
#[tauri::command]
pub fn update_tag(
    app_handle: tauri::AppHandle,
    id: String,
    request: CreateTagRequest,
) -> Result<Tag, String> {
    let conn = create_connection(&app_handle).map_err(|e| e.to_string())?;
    tag::update(&conn, &id, request).map_err(|e| e.to_string())
}

/// 删除标签
#[tauri::command]
pub fn delete_tag(app_handle: tauri::AppHandle, id: String) -> Result<(), String> {
    let conn = create_connection(&app_handle).map_err(|e| e.to_string())?;
    tag::delete(&conn, &id).map_err(|e| e.to_string())
}