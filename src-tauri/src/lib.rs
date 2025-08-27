// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
pub mod commands;
pub mod database;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            // Recommendation
            commands::recommendation::get_recommendations,
            // System
            commands::system::get_app_info,
            // Food CRUD
            commands::food::create_food,
            commands::food::get_food_by_id,
            commands::food::get_all_foods,
            commands::food::update_food,
            commands::food::delete_food,
            commands::food::disable_food,
            commands::food::enable_food,
            // Tags CRUD
            commands::tags::create_tag,
            commands::tags::get_tag_by_id,
            commands::tags::get_all_tags,
            commands::tags::update_tag,
            commands::tags::delete_tag,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
