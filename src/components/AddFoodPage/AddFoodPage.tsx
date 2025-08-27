import React, { useState, useCallback, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';
import type { CreateFoodRequest, Tag as TagType, CreateTagRequest, FoodTagCombination } from '../../types';
import { api } from '../../api';
import './AddFoodPage.css';

interface AddFoodPageProps {
  availableTags: TagType[];
  editingFood?: FoodTagCombination | null;
  onFoodAdded?: () => void;
  onBack?: () => void;
}

interface FormTag {
  id?: string;
  name: string;
  score: number;
}

const PRESET_TAGS: Omit<FormTag, 'id'>[] = [
  { name: '味道不错', score: 10 },
  { name: '价格合理', score: 8 },
  { name: '分量足', score: 6 },
  { name: '方便快捷', score: 5 },
  { name: '营养健康', score: 12 },
  { name: '环境不错', score: 7 },
  { name: '有点贵', score: -5 },
  { name: '太油腻', score: -8 },
  { name: '经常吃', score: -3 },
  { name: '排队久', score: -4 },
  { name: '不够健康', score: -6 },
  { name: '距离远', score: -2 },
];

export const AddFoodPage: React.FC<AddFoodPageProps> = ({
  editingFood,
  onFoodAdded,
  onBack,
}) => {
  const isEditMode = !!editingFood;
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [selectedTags, setSelectedTags] = useState<FormTag[]>([]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState({ name: '', score: 0 });
  const [editingIndex, setEditingIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 初始化编辑模式数据
  useEffect(() => {
    if (editingFood) {
      setFormData({
        name: editingFood.food.name,
        description: '',
      });
      setSelectedTags(
        editingFood.tags.map(tag => ({
          id: tag.id,
          name: tag.name,
          score: tag.score,
        }))
      );
    }
  }, [editingFood]);

  // 表单验证
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入食物名称';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.name]);

  // 添加或更新标签
  const handleAddOrUpdateTag = () => {
    const name = newTag.name.trim();
    const score = newTag.score;

    if (!name) {
      alert('请输入标签名称');
      return;
    }

    // 检查重复标签名称（编辑时排除自己）
    const existingIndex = selectedTags.findIndex((tag, index) =>
      tag.name === name && index !== editingIndex
    );

    if (existingIndex >= 0) {
      alert('标签名称已存在');
      return;
    }

    const tagData: FormTag = { name, score };

    if (editingIndex >= 0) {
      // 更新现有标签
      const updatedTags = [...selectedTags];
      updatedTags[editingIndex] = tagData;
      setSelectedTags(updatedTags);
    } else {
      // 添加新标签
      setSelectedTags(prev => [...prev, tagData]);
    }

    // 重置表单
    setNewTag({ name: '', score: 0 });
    setShowTagInput(false);
    setEditingIndex(-1);
  };

  // 编辑标签
  const handleEditTag = (index: number) => {
    const tag = selectedTags[index];
    setNewTag({ name: tag.name, score: tag.score });
    setEditingIndex(index);
    setShowTagInput(true);
  };

  // 删除标签
  const handleDeleteTag = (index: number) => {
    if (confirm('确定要删除这个标签吗？')) {
      setSelectedTags(prev => prev.filter((_, i) => i !== index));
    }
  };

  // 添加预设标签
  const handleAddPresetTag = (presetTag: Omit<FormTag, 'id'>) => {
    // 检查是否已存在相同标签
    const exists = selectedTags.some(tag => tag.name === presetTag.name);
    if (exists) {
      alert('该标签已添加');
      return;
    }

    setSelectedTags(prev => [...prev, presetTag]);
  };

  // 取消标签输入
  const handleCancelTagInput = () => {
    setNewTag({ name: '', score: 0 });
    setShowTagInput(false);
    setEditingIndex(-1);
  };

  // 保存食物
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      if (isEditMode && editingFood) {
        // 编辑模式：更新食物
        const tagUuids: string[] = [];

        for (const tag of selectedTags) {
          if (tag.id) {
            tagUuids.push(tag.id);
          } else {
            // 新标签，需要先创建
            const createTagRequest: CreateTagRequest = {
              name: tag.name,
              score: tag.score,
            };
            const createdTag = await api.tag.createTag(createTagRequest);
            tagUuids.push(createdTag.id);
          }
        }

        await api.food.updateFood(editingFood.food.id, {
          name: formData.name.trim(),
          icon: editingFood.food.icon,
          tag_uuids: tagUuids,
        });

        alert(`已更新食物：${formData.name}`);
      } else {
        // 添加模式：创建新食物
        const tagUuids: string[] = [];

        for (const tag of selectedTags) {
          if (tag.id) {
            // 现有标签，直接使用ID
            tagUuids.push(tag.id);
          } else {
            // 新标签，需要先创建
            const createTagRequest: CreateTagRequest = {
              name: tag.name,
              score: tag.score,
            };
            const createdTag = await api.tag.createTag(createTagRequest);
            tagUuids.push(createdTag.id);
          }
        }

        // 创建食物
        const createFoodRequest: CreateFoodRequest = {
          name: formData.name.trim(),
          tag_uuids: tagUuids,
        };

        await api.food.createFood(createFoodRequest);

        alert(`已添加食物：${formData.name}\n标签数量：${selectedTags.length}\n总权重：${selectedTags.reduce((sum, tag) => sum + tag.score, 0)}`);
      }

      // 重置表单
      setFormData({ name: '', description: '' });
      setSelectedTags([]);
      setErrors({});

      // 通知父组件
      onFoodAdded?.();
      onBack?.();

    } catch (error) {
      console.error('保存食物失败:', error);
      alert('保存失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-food-page">
      {/* 头部 */}
      <div className="page-header">
        <Button
          variant="primary"
          onClick={onBack}
          className="back-btn"
        >
          ← 返回
        </Button>
        <h1 className="page-title">{isEditMode ? '编辑食物' : '添加食物'}</h1>
        <Button
          onClick={handleSave}
          disabled={isLoading || !formData.name.trim()}
          className="save-btn"
        >
          {isLoading ? '保存中...' : '保存'}
        </Button>
      </div>

      {/* 基本信息表单 */}
      <Card className="form-section">
        <div className="form-group">
          <label className="form-label" htmlFor="food-name">
            食物名称 *
          </label>
          <Input
            id="food-name"
            type="text"
            placeholder="请输入食物或餐厅名称"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            className="form-input"
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="food-desc">
            描述信息
          </label>
          <Input
            id="food-desc"
            type="text"
            placeholder="简单描述一下这个食物..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="form-input"
          />
          <div className="form-tips">可选项，帮助你更好地记住这个食物</div>
        </div>
      </Card>

      {/* 标签管理 */}
      <Card className="form-section">
        <div className="section-header">
          <h3 className="section-title">🏷️ 权重标签</h3>
          <Button
            variant="primary"
            size="small"
            onClick={() => setShowTagInput(true)}
            className="add-tag-btn"
          >
            ➕ 添加标签
          </Button>
        </div>

        {/* 标签输入区域 */}
        {showTagInput && (
          <div className="tag-input-area">
            <div className="tag-input-row">
              <div className="tag-input-group">
                <label className="input-label">标签名称</label>
                <Input
                  type="text"
                  placeholder="例如：味道不错"
                  value={newTag.name}
                  onChange={(e) => setNewTag(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="weight-input-group">
                <label className="input-label">权重</label>
                <Input
                  type="number"
                  placeholder="±10"
                  min={-99}
                  max={99}
                  value={newTag.score || ''}
                  onChange={(e) => setNewTag(prev => ({ ...prev, score: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="tag-actions">
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleAddOrUpdateTag}
                >
                  ✓
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={handleCancelTagInput}
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="form-tips">权重范围：-99 到 +99，正数增加选中概率，负数降低选中概率</div>
          </div>
        )}

        {/* 已选择的标签列表 */}
        {selectedTags.length === 0 ? (
          <div className="empty-tags">
            <div className="empty-icon">🏷️</div>
            <div className="empty-title">暂无标签</div>
            <div className="empty-desc">添加标签来影响推荐权重</div>
          </div>
        ) : (
          <div className="tags-list">
            {selectedTags.map((tag, index) => (
              <div key={`${tag.name}-${index}`} className="tag-item">
                <div className="tag-display">
                  <Tag weight={tag.score} size="small">
                    {tag.name}
                  </Tag>
                  <span className="tag-weight">权重: {tag.score}</span>
                </div>
                <div className="tag-actions">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleEditTag(index)}
                    className="edit-tag-btn"
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleDeleteTag(index)}
                    className="delete-tag-btn"
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 预设标签 */}
      <Card className="preset-tags">
        <h3 className="section-title">💡 常用标签</h3>
        <div className="preset-tags-grid">
          {PRESET_TAGS.map((tag, index) => (
            <button
              key={index}
              className={`preset-tag ${tag.score >= 0 ? 'positive' : 'negative'}`}
              onClick={() => handleAddPresetTag(tag)}
              disabled={selectedTags.some(selected => selected.name === tag.name)}
            >
              {tag.name} {tag.score >= 0 ? '+' : ''}{tag.score}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};