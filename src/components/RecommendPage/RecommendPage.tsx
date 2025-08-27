import React, { useState, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';
import type { FoodTagCombination, Tag as TagType, BasicStats } from '../../types';
import { api } from '../../api';
import './RecommendPage.css';

interface RecommendPageProps {
  foods: FoodTagCombination[];
  onRecommendationChange?: (recommendation: FoodTagCombination | null) => void;
}

export const RecommendPage: React.FC<RecommendPageProps> = ({
  foods,
  onRecommendationChange,
}) => {
  const [currentRecommendation, setCurrentRecommendation] = useState<FoodTagCombination | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 计算基础统计信息
  const getBasicStats = useCallback((): BasicStats => {
    const enabledFoods = foods.filter(food => food.food.enabled);
    const allTags = foods.flatMap(food => food.tags);
    const averageWeight = allTags.length > 0 
      ? allTags.reduce((sum, tag) => sum + tag.score, 0) / allTags.length 
      : 0;

    return {
      totalFoods: foods.length,
      enabledFoods: enabledFoods.length,
      totalTags: allTags.length,
      averageWeight: Math.round(averageWeight * 10) / 10,
    };
  }, [foods]);

  // 获取推荐
  const handleGetRecommendation = async () => {
    if (foods.filter(food => food.food.enabled).length === 0) {
      alert('没有可用的食物，请先添加并启用一些食物！');
      return;
    }

    setIsLoading(true);
    try {
      const recommendation = await api.recommendation.getRecommendation();
      setCurrentRecommendation(recommendation);
      onRecommendationChange?.(recommendation);
    } catch (error) {
      console.error('获取推荐失败:', error);
      alert('获取推荐失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const stats = getBasicStats();

  return (
    <div className="recommend-page">
      {/* 推荐结果卡片 */}
      <Card className="recommendation-card">
        <div className="recommendation-title">🎲 为你推荐</div>
        
        {currentRecommendation ? (
          <div className="recommendation-result">
            <div className="recommendation-name">
              {currentRecommendation.food.name}
            </div>
            <div className="recommendation-tags">
              {currentRecommendation.tags.map((tag: TagType) => (
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
        ) : (
          <div className="no-recommendation">
            <div className="no-recommendation-icon">🤔</div>
            <div className="no-recommendation-text">点击下方按钮开始推荐</div>
          </div>
        )}
        
        <Button
          onClick={handleGetRecommendation}
          disabled={isLoading}
          className="recommend-btn"
        >
          {isLoading ? '🎲 推荐中...' : '🎯 再来一个'}
        </Button>
      </Card>

      {/* 统计概览 */}
      <Card className="stats-overview">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{stats.totalFoods}</div>
            <div className="stat-label">总食物数</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.enabledFoods}</div>
            <div className="stat-label">已启用</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.totalTags}</div>
            <div className="stat-label">标签总数</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.averageWeight}</div>
            <div className="stat-label">平均权重</div>
          </div>
        </div>
      </Card>

      {/* 空状态提示 */}
      {foods.length === 0 && (
        <Card className="empty-state">
          <div className="empty-icon">🍽️</div>
          <div className="empty-title">还没有食物</div>
          <div className="empty-desc">
            点击右下角的 ➕ 按钮添加第一个食物吧！
          </div>
        </Card>
      )}
    </div>
  );
};