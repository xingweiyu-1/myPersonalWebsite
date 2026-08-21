# My Portfolio

炫酷个人网站 — 纯 HTML/CSS/JS，零依赖，开箱即用。

## 特性

- 自定义光标 + 点击波纹
- 粒子背景 + 鼠标交互
- 动态渐变色块浮动
- 打字机效果
- 滚动揭示动画
- 数字计数动画
- 3D 卡片倾斜
- 玻璃拟态设计
- 暗色/亮色主题切换
- 响应式布局
- 技能进度条动画
- 项目 Mockup 交互
- 表单浮动标签

## 本地运行

直接用浏览器打开 `index.html`，或启动本地服务器：

```bash
npx serve .
# 或
python -m http.server 8080
```

## 部署到 GitHub Pages

1. 在 GitHub 创建仓库并推送代码：

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

2. 进入仓库 **Settings → Pages**
3. **Source** 选择 `Deploy from a branch`
4. **Branch** 选择 `main`，文件夹选 `/ (root)`
5. 点击 Save，等待 1-2 分钟
6. 访问 `https://你的用户名.github.io/你的仓库名/`

## 自定义

| 内容 | 修改位置 |
|------|----------|
| 姓名 | `index.html` → `#heroName` |
| 打字机文字 | `js/main.js` → `phrases` 数组 |
| 技能/标签 | `index.html` → `.skill-card` |
| 项目信息 | `index.html` → `.project-card` |
| 邮箱 | `index.html` → `mailto:` 链接 |
| 社交链接 | `index.html` → `.hero-socials` |
| 颜色主题 | `css/style.css` → `:root` 变量 |
| 粒子数量 | `js/main.js` → `PARTICLE_COUNT` |

## 技术栈

- HTML5
- CSS3 (Grid, Flexbox, Custom Properties, backdrop-filter, animations)
- Vanilla JavaScript (IntersectionObserver, Canvas API, requestAnimationFrame)
