import React, { useState } from 'react';
import { Card } from '../ui/Card';
import './AboutPage.css';

export const AboutPage: React.FC = () => {
  const [logoClicks, setLogoClicks] = useState(0);

  // Logo点击彩蛋
  const handleLogoClick = () => {
    setLogoClicks(prev => prev + 1);
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
            <div className="author-name">y1nhui (zzy2210)</div>
            <div className="author-role">全栈开发者 & 产品设计师</div>
            <div className="author-desc">
              热爱技术创新，专注于用户体验设计。相信好的软件应该既强大又简单。
            </div>
          </div>
        </div>

        <div className="contact-section">
          <div className="section-subtitle">📫 联系方式</div>
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
              href="mailto:your-email@example.com" 
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

      {/* 致谢 */}
      <Card className="thanks-card fade-in-delay-2">
        <div className="card-title">🙏 致谢</div>
        <div className="thanks-content">
          <div className="license-badge">MIT License</div>
          <p>
            感谢所有开源项目的贡献者，特别是 Tauri、React 和 Rust 社区的支持。<br />
            本项目采用 MIT 开源许可证，欢迎自由使用和贡献代码。
          </p>
          
          {/* 技术栈展示 */}
          <div className="tech-stack">
            <div className="tech-section">
              <div className="tech-title">前端技术</div>
              <div className="tech-items">
                <span className="tech-item">React 18</span>
                <span className="tech-item">TypeScript</span>
                <span className="tech-item">Vite</span>
              </div>
            </div>
            <div className="tech-section">
              <div className="tech-title">后端技术</div>
              <div className="tech-items">
                <span className="tech-item">Rust</span>
                <span className="tech-item">Tauri</span>
                <span className="tech-item">SQLite</span>
              </div>
            </div>
          </div>

          <div className="copyright">
            Made with ❤️ by zzy2210 | Copyright © 2025 WhatToEat
            {logoClicks >= 10 && (
              <div className="easter-egg">
                🎉 您发现了隐藏彩蛋！感谢您对WhatToEat的喜爱！
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};