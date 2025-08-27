// 基于后端 Rust 数据模型的 TypeScript 类型定义

export interface Food {
  id: string;
  icon?: string;
  name: string;
  tags: string; // JSON 数组字符串
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  icon?: string;
  name: string;
  score: number; // 权重分数 -100 ~ 100
  created_at: string;
  updated_at: string;
}

// 创建食物请求 DTO
export interface CreateFoodRequest {
  name: string;
  icon?: string;
  tag_uuids: string[]; // 标签ID数组
}

// 创建标签请求 DTO
export interface CreateTagRequest {
  name: string;
  icon?: string;
  score: number;
}

// 食物和标签组合（用于推荐功能）
export interface FoodTagCombination {
  food: Food;
  tags: Tag[];
}

// 应用信息
export interface AppInfo {
  name: string;
  version: string;
  description?: string;
}

// 前端状态管理相关类型
export interface AppState {
  foods: FoodTagCombination[];
  tags: Tag[];
  currentRecommendation: FoodTagCombination | null;
  loading: boolean;
  error: string | null;
}

// 页面路由类型
export type PageType = 'recommend' | 'list' | 'tags' | 'about' | 'add-food' | 'edit-food';

// 表单状态类型
export interface FoodFormData {
  name: string;
  icon?: string;
  selectedTags: string[];
}

export interface TagFormData {
  name: string;
  icon?: string;
  score: number;
}

// API 错误类型
export interface ApiError {
  message: string;
  code?: string;
}

// 搜索和过滤选项
export interface SearchOptions {
  query: string;
  enabledOnly: boolean;
  sortBy: 'name' | 'created_at' | 'updated_at';
  sortOrder: 'asc' | 'desc';
}

// 统计数据类型（基础版本）
export interface BasicStats {
  totalFoods: number;
  enabledFoods: number;
  totalTags: number;
  averageWeight: number;
}