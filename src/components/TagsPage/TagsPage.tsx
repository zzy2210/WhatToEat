import React, { useState, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Tag } from '../ui/Tag';
import type { Tag as TagType, CreateTagRequest } from '../../types';
import { api } from '../../api';
import './TagsPage.css';

interface TagsPageProps {
    tags: TagType[];
    onTagUpdate?: () => void;
}

export const TagsPage: React.FC<TagsPageProps> = ({
    tags,
    onTagUpdate,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingTag, setEditingTag] = useState<TagType | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        score: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // 过滤标签列表
    const filteredTags = React.useMemo(() => {
        if (!searchQuery.trim()) return tags;

        const query = searchQuery.toLowerCase().trim();
        return tags.filter(tag =>
            tag.name.toLowerCase().includes(query)
        );
    }, [tags, searchQuery]);

    // 表单验证
    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = '请输入标签名称';
        } else if (formData.name.trim().length > 20) {
            newErrors.name = '标签名称不能超过20个字符';
        } else {
            // 检查重复标签名称（编辑时排除自己）
            const exists = tags.some(tag =>
                tag.name === formData.name.trim() &&
                (!editingTag || tag.id !== editingTag.id)
            );
            if (exists) {
                newErrors.name = '标签名称已存在';
            }
        }

        if (formData.score < -99 || formData.score > 99) {
            newErrors.score = '权重范围：-99 到 +99';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, tags, editingTag]);

    // 重置表单
    const resetForm = () => {
        setFormData({ name: '', score: 0 });
        setEditingTag(null);
        setShowAddForm(false);
        setErrors({});
    };

    // 开始添加标签
    const handleStartAdd = () => {
        resetForm();
        setShowAddForm(true);
    };

    // 开始编辑标签
    const handleStartEdit = (tag: TagType) => {
        setFormData({
            name: tag.name,
            score: tag.score,
        });
        setEditingTag(tag);
        setShowAddForm(true);
    };

    // 保存标签
    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);

            if (editingTag) {
                // 编辑模式
                await api.tag.updateTag(editingTag.id, {
                    name: formData.name.trim(),
                    score: formData.score,
                });
            } else {
                // 添加模式
                const createRequest: CreateTagRequest = {
                    name: formData.name.trim(),
                    score: formData.score,
                };
                await api.tag.createTag(createRequest);
            }

            resetForm();
            onTagUpdate?.();
        } catch (error) {
            console.error('保存标签失败:', error);
            alert('保存失败，请稍后重试');
        } finally {
            setIsLoading(false);
        }
    };

    // 删除标签
    const handleDelete = async (tag: TagType) => {
        if (!confirm(`确定要删除标签"${tag.name}"吗？\n删除后所有使用该标签的食物将受到影响。`)) {
            return;
        }

        try {
            setIsLoading(true);
            await api.tag.deleteTag(tag.id);
            onTagUpdate?.();
        } catch (error) {
            console.error('删除标签失败:', error);
            alert('删除失败，请稍后重试');
        } finally {
            setIsLoading(false);
        }
    };

    // 统计信息
    const stats = React.useMemo(() => {
        const positiveCount = tags.filter(tag => tag.score > 0).length;
        const negativeCount = tags.filter(tag => tag.score < 0).length;
        const neutralCount = tags.filter(tag => tag.score === 0).length;
        const avgScore = tags.length > 0
            ? Math.round((tags.reduce((sum, tag) => sum + tag.score, 0) / tags.length) * 10) / 10
            : 0;

        return {
            total: tags.length,
            positive: positiveCount,
            negative: negativeCount,
            neutral: neutralCount,
            average: avgScore,
        };
    }, [tags]);

    return (
        <div className="tags-page">
            {/* 搜索栏 */}
            <Card className="search-bar">
                <Input
                    type="text"
                    placeholder="🔍 搜索标签..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </Card>

            {/* 统计信息 */}
            <Card className="stats-card">
                <div className="stats-header">
                    <h3 className="stats-title">📊 标签统计</h3>
                </div>
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-value">{stats.total}</div>
                        <div className="stat-label">总标签</div>
                    </div>
                    <div className="stat-item positive">
                        <div className="stat-value">{stats.positive}</div>
                        <div className="stat-label">正向标签</div>
                    </div>
                    <div className="stat-item negative">
                        <div className="stat-value">{stats.negative}</div>
                        <div className="stat-label">负向标签</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">{stats.average}</div>
                        <div className="stat-label">平均权重</div>
                    </div>
                </div>
            </Card>

            {/* 添加/编辑表单 */}
            {showAddForm && (
                <Card className="form-card">
                    <div className="form-header">
                        <h3 className="form-title">
                            {editingTag ? '编辑标签' : '添加标签'}
                        </h3>
                        <Button
                            variant="ghost"
                            size="small"
                            onClick={resetForm}
                            className="close-btn"
                        >
                            ✕
                        </Button>
                    </div>

                    <div className="form-content">
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">标签名称</label>
                                <Input
                                    type="text"
                                    placeholder="例如：味道不错"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    error={errors.name}
                                />
                                {errors.name && (
                                    <div className="error-message">{errors.name}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label">权重</label>
                                <Input
                                    type="number"
                                    placeholder="±10"
                                    min={-99}
                                    max={99}
                                    value={formData.score || ''}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        score: parseInt(e.target.value) || 0
                                    }))}
                                    error={errors.score}
                                />
                                {errors.score && (
                                    <div className="error-message">{errors.score}</div>
                                )}
                            </div>

                            <div className="form-actions">
                                <Button
                                    variant="primary"
                                    onClick={handleSave}
                                    disabled={isLoading || !formData.name.trim()}
                                    className="save-btn"
                                >
                                    {isLoading ? '保存中...' : '保存'}
                                </Button>
                            </div>
                        </div>

                        <div className="form-tips">
                            权重范围：-99 到 +99，正数增加选中概率，负数降低选中概率
                        </div>
                    </div>
                </Card>
            )}

            {/* 标签列表 */}
            <Card className="tags-list-card">
                <div className="tags-list-header">
                    <div className="tags-list-title">🏷️ 权重标签</div>
                    <div className="tags-count">
                        共 {filteredTags.length} 项
                        {searchQuery && tags.length !== filteredTags.length &&
                            ` / ${tags.length} 总计`
                        }
                    </div>
                </div>

                {filteredTags.length === 0 ? (
                    <div className="empty-tags-list">
                        {searchQuery ? (
                            <>
                                <div className="empty-icon">🔍</div>
                                <div className="empty-title">没有找到匹配的标签</div>
                                <div className="empty-desc">尝试更改搜索关键词</div>
                            </>
                        ) : (
                            <>
                                <div className="empty-icon">🏷️</div>
                                <div className="empty-title">还没有创建标签</div>
                                <div className="empty-desc">点击右下角的 ➕ 按钮创建第一个标签吧！</div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="tags-list">
                        {filteredTags.map((tag) => (
                            <div key={tag.id} className="tag-item">
                                <div className="tag-info">
                                    <Tag weight={tag.score} size="medium">
                                        {tag.name}
                                    </Tag>
                                    <div className="tag-details">
                                        <span className="tag-weight-text">
                                            权重: {tag.score >= 0 ? '+' : ''}{tag.score}
                                        </span>
                                    </div>
                                </div>
                                <div className="tag-actions">
                                    <Button
                                        variant="ghost"
                                        size="small"
                                        onClick={() => handleStartEdit(tag)}
                                        className="action-btn edit-btn"
                                        disabled={isLoading}
                                    >
                                        ✏️
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="small"
                                        onClick={() => handleDelete(tag)}
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

            {/* 浮动添加按钮 */}
            {!showAddForm && (
                <button
                    className="fab add-tag-fab"
                    onClick={handleStartAdd}
                    disabled={isLoading}
                >
                    ➕
                </button>
            )}
        </div>
    );
};
