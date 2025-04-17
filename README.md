# PromptPro - 提示词管理系统

PromptPro是一个轻量级的提示词管理工具，帮助用户方便地管理、分类和使用AI提示词，提高工作效率。

## 主要功能

- **文件夹管理**: 创建和管理文件夹，系统化组织提示词
- **标签分类**: 添加标签，灵活分类提示词内容
- **收藏功能**: 收藏常用提示词，快速访问
- **导入导出**: 支持数据备份和迁移

## 技术栈

- 前端: React, TypeScript, Tailwind CSS
- 后端: Express.js
- 编辑器: CodeMirror

## 快速开始

### 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd prompt-server
npm install
cd ..
```

### 启动应用

```bash
# 同时启动前端和API服务器
npm run start
```

- 前端应用运行在: http://localhost:5173 (或自动选择其他端口)
- API服务器运行在: http://localhost:3000

## 截图

![提示词管理系统截图](./screenshots/screenshot.png)

## 目录结构

```
project/
├── src/               # 前端代码
│   ├── components/    # React组件
│   ├── types.ts       # 类型定义
│   └── store.ts       # 状态管理
├── prompt-server/     # 后端API服务器
│   └── index.js       # Express服务器
└── package.json       # 项目配置
```

## 贡献指南

欢迎提交issues和pull requests，一起改进这个项目！

## 许可证

[MIT](./LICENSE) 