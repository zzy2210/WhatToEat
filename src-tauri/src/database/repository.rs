use crate::database::models::*;
use rusqlite::{Connection, OptionalExtension};
use serde_json;
use uuid::Uuid;

pub mod food {
    use super::*;
    pub fn create(
        conn: &Connection,
        food: CreateFoodRequest,
    ) -> Result<Food, Box<dyn std::error::Error>> {
        let food_id = Uuid::new_v4().to_string();
        let tags_json = serde_json::to_string(&food.tag_uuids)?;

        // 先插入
        conn.execute(
            "INSERT INTO foods (id, name, icon, tags, enabled) VALUES (?, ?, ?, ?, ?)",
            rusqlite::params![
                food_id,
                food.name,
                food.icon.as_deref().unwrap_or(""),
                tags_json,
                true,
            ],
        )?;

        // 后读取
        let food = get_by_id(conn, &food_id)?.ok_or("Failed to retrieve food")?;
        Ok(food)
    }

    pub fn get_by_id(
        conn: &Connection,
        id: &str,
    ) -> Result<Option<Food>, Box<dyn std::error::Error>> {
        let mut stmt = conn.prepare(
            "SELECT id, name, icon, tags, enabled, created_at, updated_at FROM foods WHERE id = ?",
        )?;

        let food_result = stmt
            .query_row([id], |row| {
                Ok(Food {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    icon: row.get(2)?,
                    tags: row.get(3)?,
                    enabled: row.get(4)?,
                    created_at: row.get(5)?,
                    updated_at: row.get(6)?,
                })
            })
            .optional()?;

        Ok(food_result)
    }

    pub fn get_all(
        conn: &Connection,
        enabled_only: bool,
    ) -> Result<Vec<Food>, Box<dyn std::error::Error>> {
        let sql = if enabled_only {
            "SELECT id, name, icon, tags, enabled, created_at, updated_at FROM foods WHERE enabled = 1"
        } else {
            "SELECT id, name, icon, tags, enabled, created_at, updated_at FROM foods"
        };

        let mut stmt = conn.prepare(sql)?;
        let food_iter = stmt.query_map([], |row| {
            Ok(Food {
                id: row.get(0)?,
                name: row.get(1)?,
                icon: row.get(2)?,
                tags: row.get(3)?,
                enabled: row.get(4)?,
                created_at: row.get(5)?,
                updated_at: row.get(6)?,
            })
        })?;

        let mut foods = Vec::new();
        for food in food_iter {
            foods.push(food?);
        }
        Ok(foods)
    }

    pub fn update(
        conn: &Connection,
        id: &str,
        food: CreateFoodRequest,
    ) -> Result<Food, Box<dyn std::error::Error>> {
        let tags_json = serde_json::to_string(&food.tag_uuids)?;

        conn.execute(
            "UPDATE foods SET name = ?, icon = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            rusqlite::params![
                food.name,
                food.icon.as_deref().unwrap_or(""),
                tags_json,
                id,
            ],
        )?;

        let updated_food = get_by_id(conn, id)?.ok_or("Failed to retrieve updated food")?;
        Ok(updated_food)
    }

    pub fn delete(conn: &Connection, id: &str) -> Result<(), Box<dyn std::error::Error>> {
        conn.execute("DELETE FROM foods WHERE id = ?", rusqlite::params![id])?;
        Ok(())
    }

    pub fn disable(conn: &Connection, id: &str) -> Result<(), Box<dyn std::error::Error>> {
        conn.execute(
            "UPDATE foods SET enabled = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            rusqlite::params![id],
        )?;
        Ok(())
    }
}

pub mod tag {
    use super::*;

    pub fn create(
        conn: &Connection,
        tag: CreateTagRequest,
    ) -> Result<Tag, Box<dyn std::error::Error>> {
        let tag_id = Uuid::new_v4().to_string();

        conn.execute(
            "INSERT INTO tags (id, name, icon, score) VALUES (?, ?, ?, ?)",
            rusqlite::params![
                tag_id,
                tag.name,
                tag.icon.as_deref().unwrap_or(""),
                tag.score,
            ],
        )?;

        let created_tag = get_by_id(conn, &tag_id)?.ok_or("Failed to retrieve created tag")?;
        Ok(created_tag)
    }

    pub fn get_by_id(
        conn: &Connection,
        id: &str,
    ) -> Result<Option<Tag>, Box<dyn std::error::Error>> {
        let mut stmt = conn.prepare(
            "SELECT id, name, icon, score, created_at, updated_at FROM tags WHERE id = ?",
        )?;

        let tag_result = stmt
            .query_row([id], |row| {
                Ok(Tag {
                    id: row.get(0)?,
                    name: row.get(1)?,
                    icon: row.get(2)?,
                    score: row.get(3)?,
                    created_at: row.get(4)?,
                    updated_at: row.get(5)?,
                })
            })
            .optional()?;

        Ok(tag_result)
    }

    pub fn get_all(conn: &Connection) -> Result<Vec<Tag>, Box<dyn std::error::Error>> {
        let mut stmt = conn.prepare(
            "SELECT id, name, icon, score, created_at, updated_at FROM tags ORDER BY score DESC",
        )?;
        let tag_iter = stmt.query_map([], |row| {
            Ok(Tag {
                id: row.get(0)?,
                name: row.get(1)?,
                icon: row.get(2)?,
                score: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        })?;

        let mut tags = Vec::new();
        for tag in tag_iter {
            tags.push(tag?);
        }
        Ok(tags)
    }

    pub fn update(
        conn: &Connection,
        id: &str,
        tag: CreateTagRequest,
    ) -> Result<Tag, Box<dyn std::error::Error>> {
        conn.execute(
            "UPDATE tags SET name = ?, icon = ?, score = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            rusqlite::params![
                tag.name,
                tag.icon.as_deref().unwrap_or(""),
                tag.score,
                id,
            ],
        )?;

        let updated_tag = get_by_id(conn, id)?.ok_or("Failed to retrieve updated tag")?;
        Ok(updated_tag)
    }

    pub fn delete(conn: &Connection, id: &str) -> Result<(), Box<dyn std::error::Error>> {
        conn.execute("DELETE FROM tags WHERE id = ?", rusqlite::params![id])?;
        Ok(())
    }

    pub fn list_by_ids(
        conn: &Connection,
        ids: Vec<String>,
    ) -> Result<Vec<Tag>, Box<dyn std::error::Error>> {
        if ids.is_empty() {
            return Ok(Vec::new());
        }

        let placeholders = ids
            .iter()
            .enumerate()
            .map(|(i, _)| format!("?{}", i + 1))
            .collect::<Vec<_>>()
            .join(", ");

        let sql = format!(
            "SELECT id, name, icon, score, created_at, updated_at FROM tags WHERE id IN ({})",
            placeholders
        );

        let mut stmt = conn.prepare(&sql)?;
        let tag_iter = stmt.query_map(rusqlite::params_from_iter(&ids), |row| {
            Ok(Tag {
                id: row.get(0)?,
                name: row.get(1)?,
                icon: row.get(2)?,
                score: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        })?;

        let mut tags = Vec::new();
        for tag in tag_iter {
            tags.push(tag?);
        }
        Ok(tags)
    }
}
