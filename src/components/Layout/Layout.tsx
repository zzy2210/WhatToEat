import React from 'react';
import type { PageType } from '../../types';
import './Layout.css';

export interface LayoutProps {
  children: React.ReactNode;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  title?: string;
  showFab?: boolean;
  onFabClick?: () => void;
  hideNavigation?: boolean;
}

const navigation = [
  { id: 'recommend' as const, label: '推荐', icon: '🎯' },
  { id: 'list' as const, label: '清单', icon: '📋' },
  { id: 'tags' as const, label: '标签', icon: '🏷️' },
  { id: 'about' as const, label: '关于', icon: 'ℹ️' },
];

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentPage,
  onPageChange,
  title = 'WhatToEat',
  showFab = false,
  onFabClick,
  hideNavigation = false,
}) => {
  return (
    <div className="layout">
      {/* 头部区域 */}
      <header className="layout__header">
        <div className="layout__header-content">
          <div className="layout__title">🍽️ {title}</div>
          <div className="layout__subtitle">智能美食选择助手</div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="layout__main">
        <div className="layout__content">
          {children}
        </div>
      </main>

      {/* 浮动添加按钮 */}
      {showFab && (
        <button className="layout__fab" onClick={onFabClick}>
          ➕
        </button>
      )}

      {/* 底部导航栏 */}
      {!hideNavigation && (
        <nav className="layout__nav">
          {navigation.map((item) => (
            <button
              key={item.id}
              className={`layout__nav-item ${
                currentPage === item.id ? 'layout__nav-item--active' : ''
              }`}
              onClick={() => onPageChange(item.id)}
            >
              <div className="layout__nav-icon">{item.icon}</div>
              <div className="layout__nav-label">{item.label}</div>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};