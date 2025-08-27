import React from 'react';
import { Card } from '../ui/Card';
import './AboutPage.css';

export const AboutPage: React.FC = () => {
  // Logo点击彩蛋
  const handleLogoClick = () => {
    const emojis = ['🍽️', '🍜', '🍕', '🍔', '🍱', '🥘', '🍲', '🥗'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    // 临时改变logo显示
    const logoElement = document.querySelector('.app-logo');
    if (logoElement) {
      logoElement.textContent = randomEmoji;
      setTimeout(() => {
        logoElement.textContent = '🍽️';
      }, 2000);
    }
  };

  // 头像点击彩蛋
  const handleAvatarClick = () => {
    const avatarElement = document.querySelector('.author-avatar') as HTMLElement;
    if (avatarElement) {
      const randomHue1 = Math.random() * 360;
      const randomHue2 = Math.random() * 360;
      avatarElement.style.background = `linear-gradient(135deg, hsl(${randomHue1}, 70%, 60%), hsl(${randomHue2}, 70%, 50%))`;
    }
  };

  return (
    <div className="about-page">
      {/* 产品介绍 */}
      <Card className="app-info fade-in">
        <div className="app-logo" onClick={handleLogoClick}>
          🍽️
        </div>
        <div className="app-name">WhatToEat</div>
        <div className="app-slogan">智能美食推荐，告别选择困难</div>
        <div className="app-description">
          基于加权随机算法的智能美食推荐应用。通过个性化标签系统，帮助用户快速找到最适合的美食选择，彻底解决"今天吃什么"的日常难题。
        </div>
        <div className="version-badges">
          <span className="version-badge">v1.0.0 Beta</span>
          <span className="version-badge">React + Rust</span>
          <span className="version-badge">跨平台</span>
        </div>

        {/* 核心功能 */}
        <div className="features-section">
          <div className="section-subtitle">✨ 核心功能</div>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🏷️</span>
              <span className="feature-text">智能标签系统</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚖️</span>
              <span className="feature-text">加权随机算法</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <span className="feature-text">数据统计分析</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💾</span>
              <span className="feature-text">本地数据存储</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 开发者 & 联系方式 */}
      <Card className="developer-card fade-in-delay-1">
        <div className="card-title">👨‍💻 开发者</div>
        <div className="author-section">
          <div className="author-avatar" onClick={handleAvatarClick}>
            Y
          </div>
          <div className="author-info">
            <div className="author-name">阴晦 (zzy2210)</div>
            <div className="author-role">全栈开发者 & 产品设计师</div>
            <div className="author-desc">
              热爱技术创新，专注于用户体验设计。相信好的软件应该既强大又简单。
            </div>
          </div>
        </div>

        <div className="contact-section">
          <div className="section-subtitle">📫 联系方式</div>
          <div className="contact-info">
            <div className="contact-email">
              <span className="contact-label">邮箱：</span>
              <span className="contact-value">y1nhui@foxmail.com</span>
            </div>
          </div>
          <div className="contact-links">
            <a
              href="https://github.com/zzy2210"
              className="contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="contact-icon">🐙</span>
              <span>GitHub</span>
            </a>
            <a
              href="mailto:y1nhui@foxmail.com"
              className="contact-link"
            >
              <span className="contact-icon">📧</span>
              <span>Email</span>
            </a>
            <a
              href="#"
              className="contact-link"
              onClick={(e) => {
                e.preventDefault();
                alert('感谢您的反馈建议！请通过GitHub Issues提交您的想法。');
              }}
            >
              <span className="contact-icon">💬</span>
              <span>反馈建议</span>
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
};