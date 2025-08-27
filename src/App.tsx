import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { RecommendPage } from './components/RecommendPage';
import { FoodListPage } from './components/FoodListPage';
import { AboutPage } from './components/AboutPage';
import { AddFoodPage } from './components/AddFoodPage';
import { TagsPage } from './components/TagsPage';
import type { PageType, AppState, FoodTagCombination } from './types';
import { api } from './api';
import './styles/globals.css';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('recommend');
  const [editingFoodId, setEditingFoodId] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>({
    foods: [],
    tags: [],
    currentRecommendation: null,
    loading: false,
    error: null,
  });

  // 初始化应用数据
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setAppState(prev => ({ ...prev, loading: true, error: null }));

      // 并行获取初始数据
      const [foods, tags] = await Promise.all([
        api.food.getAllFoods(),
        api.tag.getAllTags(),
      ]);

      setAppState(prev => ({
        ...prev,
        foods,
        tags,
        loading: false,
      }));
    } catch (error) {
      console.error('初始化应用失败:', error);
      setAppState(prev => ({
        ...prev,
        loading: false,
        error: '加载数据失败，请稍后重试',
      }));
    }
  };

  // 处理页面切换
  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
  };

  // 处理推荐结果变化
  const handleRecommendationChange = (recommendation: FoodTagCombination | null) => {
    setAppState(prev => ({
      ...prev,
      currentRecommendation: recommendation,
    }));
  };

  // 处理食物更新
  const handleFoodUpdate = async () => {
    try {
      const [foods, tags] = await Promise.all([
        api.food.getAllFoods(),
        api.tag.getAllTags(),
      ]);
      setAppState(prev => ({ ...prev, foods, tags }));
    } catch (error) {
      console.error('更新食物数据失败:', error);
    }
  };

  // 处理标签更新
  const handleTagUpdate = async () => {
    try {
      const [foods, tags] = await Promise.all([
        api.food.getAllFoods(),
        api.tag.getAllTags(),
      ]);
      setAppState(prev => ({ ...prev, foods, tags }));
    } catch (error) {
      console.error('更新标签数据失败:', error);
    }
  };  // 处理浮动按钮点击
  const handleFabClick = () => {
    // 根据当前页面决定浮动按钮的行为
    switch (currentPage) {
      case 'list':
        // 在食物清单页面，点击添加食物
        setCurrentPage('add-food');
        break;
      case 'tags':
        // 在标签页面，FAB按钮由TagsPage自己处理
        break;
      default:
        break;
    }
  };

  // 处理编辑食物
  const handleEditFood = (foodId: string) => {
    setEditingFoodId(foodId);
    setCurrentPage('edit-food');
  };

  // 处理返回操作
  const handleBack = () => {
    setCurrentPage('list');
    setEditingFoodId(null);
  };

  // 渲染当前页面内容
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'recommend':
        return (
          <RecommendPage
            foods={appState.foods}
            onRecommendationChange={handleRecommendationChange}
          />
        );
      case 'list':
        return (
          <FoodListPage
            foods={appState.foods}
            onFoodUpdate={handleFoodUpdate}
            onEditFood={handleEditFood}
          />
        );
      case 'tags':
        return (
          <TagsPage
            tags={appState.tags}
            onTagUpdate={handleTagUpdate}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'add-food':
        return (
          <AddFoodPage
            availableTags={appState.tags}
            onFoodAdded={handleFoodUpdate}
            onBack={handleBack}
          />
        );
      case 'edit-food':
        const foodToEdit = editingFoodId
          ? appState.foods.find(f => f.food.id === editingFoodId)
          : null;
        return (
          <AddFoodPage
            availableTags={appState.tags}
            editingFood={foodToEdit}
            onFoodAdded={handleFoodUpdate}
            onBack={handleBack}
          />
        );
      default:
        return (
          <RecommendPage
            foods={appState.foods}
            onRecommendationChange={handleRecommendationChange}
          />
        );
    }
  };

  // 显示加载状态
  if (appState.loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">🍽️</div>
        <p>正在加载...</p>
      </div>
    );
  }

  // 显示错误状态
  if (appState.error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p>{appState.error}</p>
        <button onClick={initializeApp}>重新加载</button>
      </div>
    );
  }

  return (
    <Layout
      currentPage={currentPage}
      onPageChange={handlePageChange}
      showFab={currentPage === 'list'}
      onFabClick={handleFabClick}
      hideNavigation={currentPage === 'add-food' || currentPage === 'edit-food'}
    >
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;
