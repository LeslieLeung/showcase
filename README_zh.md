# GitHub 项目展示

一个美观的 GitHub 仓库展示页面，通过 GitHub Actions 自动更新。

## 特性

- 🚀 自动从 GitHub API 获取公开仓库
- 📚 使用 React + Tailwind CSS 的精美书架风格显示
- 🔄 通过 GitHub Actions 自动更新
- 📄 通过 GitHub Pages 静态站点部署
- ⭐ 显示仓库统计信息（星标、分叉、编程语言）

## 快速开始

### 1. Fork 此仓库
- 点击页面右上角的 "Fork" 按钮
- 克隆您 Fork 的仓库：
  ```bash
  git clone https://github.com/YOUR_USERNAME/showcase.git
  cd showcase
  ```

### 2. 基本配置

1. **安装依赖**
   ```bash
   npm install
   ```

2. **更新配置**
   - 编辑 `config.yaml` 设置您的 GitHub 用户名和自定义显示选项：
     ```yaml
     github_username: "YOUR_GITHUB_USERNAME"
     ```

3. **启用 GitHub Pages**
   - 转到您的仓库设置 > Pages
   - 将源设置为 "GitHub Actions"

4. **部署**
   - 推送任何更改以触发自动部署
   - 您的展示页面将在 `https://YOUR_USERNAME.github.io/showcase/` 可用

您的展示页面将自动更新最新的仓库。

## 详细设置

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置用户名**
   - 编辑 `config.yaml` 并设置您的 GitHub 用户名：
     ```yaml
     github_username: "YOUR_GITHUB_USERNAME"
     ```

3. **设置 GitHub 令牌**（本地开发用）
   - 在 GitHub 上创建具有 `public_repo` 权限的个人访问令牌
   - 复制 `.env.example` 到 `.env` 并添加您的令牌：
     ```bash
     cp .env.example .env
     # 编辑 .env 并添加您的 GITHUB_TOKEN
     ```

4. **开发**
   ```bash
   # 获取仓库并启动开发服务器
   npm run fetch-repos
   npm run dev
   ```

5. **生产构建**
   ```bash
   npm run build-complete
   ```

## GitHub Pages 部署

1. **启用 GitHub Pages**
   - 转到您的仓库设置 > Pages
   - 将源设置为 "GitHub Actions"

2. **添加仓库密钥**
   - 转到设置 > Secrets and variables > Actions
   - 工作流使用自动提供的默认 `GITHUB_TOKEN`

3. **部署**
   - 推送到主分支或手动触发工作流
   - 站点将在 `https://yourusername.github.io/showcase/` 可用

## 高级自定义

### 仓库过滤
- **用户名**：在 `config.yaml` 的 `github_username` 字段设置您的 GitHub 用户名
- **配置**：编辑 `config.yaml` 来设置仓库过滤器、排序和显示选项
- **获取参数**：修改 `scripts/fetch-repos.ts` 来更改 API 参数

### 个人信息
- **简介和链接**：在主组件中自定义您的个人资料部分

### 部署设置
- **基础 URL**：如果部署到自定义域名，修改 `vite.config.ts`
- **GitHub Actions**：自定义 `.github/workflows/deploy.yml` 以获得不同的部署计划

## 脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 生产构建
- `npm run fetch-repos` - 从 GitHub API 获取仓库
- `npm run build-complete` - 获取仓库并构建（CI 使用）

## 项目结构

```
├── src/
│   ├── components/          # React 组件
│   ├── data/               # 生成的仓库数据
│   ├── types.ts            # TypeScript 类型
│   └── App.tsx             # 主应用组件
├── scripts/
│   ├── fetch-repos.ts      # GitHub API 客户端
│   └── build.ts            # 构建脚本
├── .github/workflows/      # GitHub Actions
└── dist/                   # 构建文件
```