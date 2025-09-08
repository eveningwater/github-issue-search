# GitHub Issue 搜索器

一个基于 GitHub API 的现代化 Issue 搜索网站，使用 Vite + Solid.js + TypeScript + Three.js 构建。

## ✨ 特性

- 🔍 **实时搜索** - 基于 GitHub API 的实时 Issue 搜索
- 🔐 **用户认证** - 支持 GitHub OAuth 登录，提高 API 限制
- 🎨 **精美界面** - 现代化的暗色主题设计
- 🌟 **Three.js 动效** - 炫酷的粒子背景动画
- 📱 **响应式设计** - 完美适配各种设备
- ⚡ **高性能** - 使用 Solid.js 实现的高性能渲染
- 🎯 **智能过滤** - 支持多种搜索参数和排序选项
- 💫 **流畅动画** - 丰富的交互动画效果
- 👤 **用户中心** - 显示用户信息和统计

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 🛠️ 技术栈

- **Solid.js** - 高性能的响应式 UI 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具
- **Three.js** - 3D 图形库，用于背景动效
- **Lucide Solid** - 精美的图标库
- **GitHub API** - 搜索 Issues 和 Pull Requests

## 📁 项目结构

```
src/
├── components/          # UI 组件
│   ├── ThreeBackground.tsx  # Three.js 背景组件
│   ├── Header.tsx           # 页面头部
│   ├── SearchBar.tsx        # 搜索栏
│   ├── SearchResults.tsx    # 搜索结果
│   ├── IssueCard.tsx        # Issue 卡片
│   └── Footer.tsx           # 页面底部
├── hooks/               # 自定义 Hooks
│   └── useSearch.ts         # 搜索逻辑
├── services/            # API 服务
│   └── githubApi.ts         # GitHub API 封装
├── types/               # TypeScript 类型定义
│   └── index.ts
├── App.tsx              # 主应用组件
├── main.tsx             # 应用入口
└── index.css            # 全局样式
```

## 🎨 设计特色

### 视觉效果
- 深色主题配色方案
- 玻璃态（Glassmorphism）设计元素
- 渐变色彩搭配
- 流畅的动画过渡

### 交互体验
- 实时搜索防抖
- 悬停效果和微交互
- 加载状态指示
- 错误处理和用户反馈

### 性能优化
- 虚拟滚动（大量数据时）
- 图片懒加载
- 组件按需渲染
- 优化的 Three.js 渲染

## 🔧 配置说明

### GitHub OAuth 设置
1. 在 GitHub 上创建 OAuth App：
   - 访问 GitHub Settings > Developer settings > OAuth Apps
   - 点击 "New OAuth App"
   - 填写应用信息：
     - Application name: GitHub Issue Search
     - Homepage URL: `http://localhost:3000`
     - Authorization callback URL: `http://localhost:3000/auth/callback`

2. 更新配置文件：
   - 在 `src/services/githubAuth.ts` 中替换 `GITHUB_CLIENT_ID`
   - 在生产环境中，需要配置 `GITHUB_CLIENT_SECRET`

### GitHub API 限制
- 未认证请求：每小时 60 次
- 认证请求：每小时 5000 次
- 登录后享受更高的 API 限制

### 自定义配置
可以在以下文件中修改配置：
- `src/services/githubApi.ts` - API 配置
- `src/services/githubAuth.ts` - 认证配置
- `src/hooks/useAuth.ts` - 认证逻辑

## 📱 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

Made with ❤️ using Solid.js & Three.js
