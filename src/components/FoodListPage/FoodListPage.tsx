import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Tag } from '../ui/Tag';
import { Button } from '../ui/Button';
import type { FoodTagCombination, Tag as TagType } from '../../types';
import { api } from '../../api';
import './FoodListPage.css';

interface FoodListPageProps {
  foods: FoodTagCombination[];
  onFoodUpdate?: () => void;
  onEditFood?: (foodId: string) => void;
}

export const FoodListPage: React.FC<FoodListPageProps> = ({
  foods,
  onFoodUpdate,
  onEditFood,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 过滤后的食物列表
  const filteredFoods = useMemo(() => {
    if (!searchQuery.trim()) return foods;
    
    const query = searchQuery.toLowerCase().trim();
    return foods.filter(foodItem =>
      foodItem.food.name.toLowerCase().includes(query) ||
      foodItem.tags.some(tag => tag.name.toLowerCase().includes(query))
    );
  }, [foods, searchQuery]);

  // 切换食物启用状态
  const handleToggleFoodStatus = async (foodId: string, currentEnabled: boolean) => {
    try {
      setIsLoading(true);
      if (currentEnabled) {
        await api.food.disableFood(foodId);
      } else {
        // 重新启用食物需要调用更新接口
        const foodItem = foods.find(f => f.food.id === foodId);
        if (foodItem) {
          await api.food.updateFood(foodId, {
            name: foodItem.food.name,
            icon: foodItem.food.icon,
            tag_uuids: foodItem.tags.map(tag => tag.id),
          });
        }
      }
      onFoodUpdate?.();
    } catch (error) {
      console.error('切换食物状态失败:', error);
      alert('操作失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 删除食物
  const handleDeleteFood = async (foodId: string, foodName: string) => {
    if (!confirm(`确定要删除"${foodName}"吗？此操作不可恢复。`)) {
      return;
    }

    try {
      setIsLoading(true);
      await api.food.deleteFood(foodId);
      onFoodUpdate?.();
    } catch (error) {
      console.error('删除食物失败:', error);
      alert('删除失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 编辑食物
  const handleEditFood = (foodId: string) => {
    onEditFood?.(foodId);
  };

  return (
    <div className="food-list-page">
      {/* 搜索栏 */}
      <Card className="search-bar">
        <Input
          type="text"
          placeholder="🔍 搜索食物..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </Card>

      {/* 食物列表 */}
      <Card className="food-list-card">
        <div className="food-list-header">
          <div className="food-list-title">🏷️ 我的美食清单</div>
          <div className="food-count">
            共 {filteredFoods.length} 项
            {searchQuery && foods.length !== filteredFoods.length && 
              ` / ${foods.length} 总计`
            }
          </div>
        </div>

        {filteredFoods.length === 0 ? (
          <div className="empty-food-list">
            {searchQuery ? (
              <>
                <div className="empty-icon">🔍</div>
                <div className="empty-title">没有找到匹配的食物</div>
                <div className="empty-desc">尝试更改搜索关键词</div>
              </>
            ) : (
              <>
                <div className="empty-icon">🍽️</div>
                <div className="empty-title">还没有添加食物</div>
                <div className="empty-desc">点击右下角的 ➕ 按钮添加第一个食物吧！</div>
              </>
            )}
          </div>
        ) : (
          <div className="food-list">
            {filteredFoods.map((foodItem) => (
              <div key={foodItem.food.id} className="food-item">
                <div className="food-info">
                  <div className="food-name">
                    {foodItem.food.icon && (
                      <span className="food-icon">{foodItem.food.icon}</span>
                    )}
                    {foodItem.food.name}
                  </div>
                  <div className="food-tags">
                    {foodItem.tags.map((tag: TagType) => (
                      <Tag
                        key={tag.id}
                        weight={tag.score}
                        size="small"
                      >
                        {tag.name}
                      </Tag>
                    ))}
                  </div>
                </div>
                <div className="food-actions">
                  <button
                    className="status-toggle"
                    onClick={() => handleToggleFoodStatus(foodItem.food.id, foodItem.food.enabled)}
                    disabled={isLoading}
                  >
                    <span className={`status-indicator ${foodItem.food.enabled ? 'enabled' : 'disabled'}`}></span>
                    <span>{foodItem.food.enabled ? '已启用' : '已禁用'}</span>
                  </button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleEditFood(foodItem.food.id)}
                    className="action-btn edit-btn"
                    disabled={isLoading}
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleDeleteFood(foodItem.food.id, foodItem.food.name)}
                    className="action-btn delete-btn"
                    disabled={isLoading}
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};