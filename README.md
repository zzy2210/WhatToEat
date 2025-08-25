# 🍽️ WhatToEat

[![Tauri](https://img.shields.io/badge/Tauri-24C8D8?style=for-the-badge&logo=tauri&logoColor=white)](https://tauri.app/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)

> 🎲 一个基于加权随机算法的智能美食选择助手

## ✨ 项目简介

WhatToEat 是一个帮助解决"今天吃什么"难题的桌面应用程序。通过智能的加权随机算法，结合用户的个性化标签和偏好设置，为您推荐最适合的美食选择。

### 🚀 核心特性

- 🏷️ **智能标签系统** - 为每个食物/餐厅添加个性化标签
- ⚖️ **加权随机算法** - 基于权重智能推荐
- 🎯 **偏好管理** - 支持正负权重调节
- 💾 **数据持久化** - 本地存储用户数据
- 🖥️ **跨平台支持** - Windows、macOS、Linux 全平台兼容
- ⚡ **高性能** - Rust 后端 + React 前端的完美组合

## 🛠️ 技术栈

### 前端
- **React 18** - 现代化用户界面框架
- **TypeScript** - 类型安全的 JavaScript 超集
- **Vite** - 快速的前端构建工具

### 后端
- **Rust** - 高性能系统编程语言
- **Tauri** - 现代化桌面应用开发框架

### 开发工具
- **Node.js** - JavaScript 运行时环境
- **Cargo** - Rust 包管理器和构建工具

## 📋 功能说明

### 添加食物/餐厅
```
黄焖鸡xx店 +10|味道不错 -5|天天吃 ✅已启用
川味火锅 +15|超级好吃 -3|有点贵 ✅已启用
麦当劳 +5|方便快捷 -8|不够健康 ❌已禁用
```

### 权重计算逻辑
- ✅ **正权重(+)**: 增加被选中的概率
- ❌ **负权重(-)**: 降低被选中的概率
- 🎯 **最终权重**: 所有标签权重的总和
- 🎲 **随机选择**: 基于权重进行加权随机选择

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- Rust >= 1.70.0
- Tauri CLI

### 安装依赖

```bash
# 安装前端依赖
npm install

# 安装 Tauri CLI (如果尚未安装)
npm install -g @tauri-apps/cli
```

### 开发模式

```bash
# 启动开发服务器
npm run tauri dev
```

### 构建应用

```bash
# 构建生产版本
npm run tauri build
```

## 📁 项目结构

```
WhatToEat/
├── 📁 src/                    # React 前端源码
│   ├── App.tsx               # 主应用组件
│   ├── main.tsx              # 应用入口
│   └── 📁 assets/            # 静态资源
├── 📁 src-tauri/             # Tauri 后端源码
│   ├── src/
│   │   ├── main.rs           # Rust 主程序
│   │   └── lib.rs            # 库文件
│   ├── Cargo.toml            # Rust 依赖配置
│   └── tauri.conf.json       # Tauri 配置文件
├── 📁 public/                # 公共资源
├── package.json              # Node.js 依赖配置
├── tsconfig.json             # TypeScript 配置
├── vite.config.ts            # Vite 配置
└── README.md                 # 项目说明文档
```

## 🔧 开发指南

### 前端开发
- 使用 React Hooks 进行状态管理
- TypeScript 提供类型安全
- Vite 提供热重载开发体验

### 后端开发
- Rust 处理核心业务逻辑
- Tauri Commands 提供前后端通信
- 本地文件系统存储数据

## 🤝 贡献指南

我们欢迎任何形式的贡献！请遵循以下步骤：

1. 🍴 Fork 本项目
2. 🌟 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 💾 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 📤 推送到分支 (`git push origin feature/AmazingFeature`)
5. 🔀 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 作者

- **y1nhui** - *项目创建者* - [GitHub](https://github.com/zzy2210)

## 🙏 致谢

- 感谢 [Tauri](https://tauri.app/) 提供优秀的桌面应用开发框架
- 感谢 [React](https://reactjs.org/) 团队的持续创新
- 感谢所有为开源社区做出贡献的开发者们

---

<div align="center">
  Made with ❤️ by zzy2210
</div>