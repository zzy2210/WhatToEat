import { invoke } from '@tauri-apps/api/core';
import type {
  Food,
  Tag,
  CreateFoodRequest,
  CreateTagRequest,
  FoodTagCombination,
  AppInfo,
} from '../types';

// API 错误处理工具
class ApiError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

// 通用API调用封装
async function apiCall<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  try {
    return await invoke<T>(command, args);
  } catch (error) {
    console.error(`API call failed: ${command}`, error);
    throw new ApiError(`调用 ${command} 失败: ${error}`);
  }
}

// 推荐功能 API
export const recommendationApi = {
  /**
   * 获取推荐结果
   */
  async getRecommendation(): Promise<FoodTagCombination> {
    return apiCall<FoodTagCombination>('get_recommendations');
  },
};

// 食物管理 API
export const foodApi = {
  /**
   * 创建食物
   */
  async createFood(request: CreateFoodRequest): Promise<FoodTagCombination> {
    return apiCall<FoodTagCombination>('create_food', { request });
  },

  /**
   * 根据ID获取食物
   */
  async getFoodById(id: string): Promise<FoodTagCombination | null> {
    return apiCall<FoodTagCombination | null>('get_food_by_id', { id });
  },

  /**
   * 获取所有食物
   */
  async getAllFoods(enabledOnly: boolean = false): Promise<FoodTagCombination[]> {
    return apiCall<FoodTagCombination[]>('get_all_foods', { enabledOnly });
  },

  /**
   * 更新食物
   */
  async updateFood(id: string, request: CreateFoodRequest): Promise<FoodTagCombination> {
    return apiCall<FoodTagCombination>('update_food', { id, request });
  },

  /**
   * 删除食物
   */
  async deleteFood(id: string): Promise<void> {
    return apiCall<void>('delete_food', { id });
  },

  /**
   * 禁用食物
   */
  async disableFood(id: string): Promise<void> {
    return apiCall<void>('disable_food', { id });
  },
};

// 标签管理 API
export const tagApi = {
  /**
   * 创建标签
   */
  async createTag(request: CreateTagRequest): Promise<Tag> {
    return apiCall<Tag>('create_tag', { request });
  },

  /**
   * 根据ID获取标签
   */
  async getTagById(id: string): Promise<Tag | null> {
    return apiCall<Tag | null>('get_tag_by_id', { id });
  },

  /**
   * 获取所有标签
   */
  async getAllTags(): Promise<Tag[]> {
    return apiCall<Tag[]>('get_all_tags');
  },

  /**
   * 更新标签
   */
  async updateTag(id: string, request: CreateTagRequest): Promise<Tag> {
    return apiCall<Tag>('update_tag', { id, request });
  },

  /**
   * 删除标签
   */
  async deleteTag(id: string): Promise<void> {
    return apiCall<void>('delete_tag', { id });
  },
};

// 系统信息 API
export const systemApi = {
  /**
   * 获取应用信息
   */
  async getAppInfo(): Promise<AppInfo> {
    return apiCall<AppInfo>('get_app_info');
  },
};

// 统一导出的 API 对象
export const api = {
  recommendation: recommendationApi,
  food: foodApi,
  tag: tagApi,
  system: systemApi,
};

// 默认导出
export default api;