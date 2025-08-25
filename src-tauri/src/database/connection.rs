use rusqlite::{Connection, Result};
use std::fs;
use std::path::PathBuf;
use tauri::AppHandle;
use tauri::Manager;

fn get_database_path(app_handle: &tauri::AppHandle) -> Result<PathBuf, Box<dyn std::error::Error>> {
    let app_data_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;

    fs::create_dir_all(&app_data_dir)
        .map_err(|e| format!("Failed to create app data dir: {}", e))?;

    Ok(app_data_dir.join("whattoeat.db"))
}

pub fn create_connection(app_handle: &AppHandle) -> Result<Connection, Box<dyn std::error::Error>> {
    let db_path = get_database_path(app_handle)?;
    let conn = Connection::open(db_path)
        .map_err(|e| format!("Failed to open database connection: {}", e))?;

    initializes_table(&conn)?;
    Ok(conn)
}

fn initializes_table(conn: &Connection) -> Result<(), Box<dyn std::error::Error>> {
    // 创建食物表
    conn.execute(
        "CREATE TABLE IF NOT EXISTS foods (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              icon TEXT,
              tags TEXT,
              enabled BOOLEAN DEFAULT true,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )",
        [],
    )?;

    // 创建标签表
    conn.execute(
        "CREATE TABLE IF NOT EXISTS tags (
              id TEXT PRIMARY KEY,
              name TEXT NOT NULL,
              icon TEXT,
              score INTEGER NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )",
        [],
    )?;

    // 创建索引
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_foods_enabled ON foods(is_enabled)",
        [],
    )?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_tags_score ON tags(score)",
        [],
    )?;
    Ok(())
}
