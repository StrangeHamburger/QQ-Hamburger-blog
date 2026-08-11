# 🍔 QQ Hamburger Blog

> 在深海和代码之间，构建有趣的东西。

**QQ Hamburger** 的个人网站 · Vue 3 + Vite · 纯手写 CSS · 零 UI 库

---

## ✨ 特色

- **🍔 6 层写实汉堡** — 纯 CSS 侧视剖面：高拱芝麻面包 / 波浪生菜 / 滴落芝士 / 焦边肉饼 / 番茄片，还配了餐盘垫纸、热气、浮动动画
- **📜 秘方卷轴** — 点击展开 6 层秘方，hover 条目汉堡对应层右移放大，点击滑出详情抽屉
- **🖥 复古收银机** — 右上角红/蓝按钮（开关屏幕 / 切换照片），关屏时雪花噪点 + RGB 分离故障特效
- **📁 项目展示** — 点击小方块弹出全屏 case study（背景 / 功能 / 技术栈）
- **🐙 GitHub 面板** — 用户卡（头像 / 关注数）+ 仓库列表（语言 / stars / 更新时间）
- **💬 留言墙** — localStorage 持久化，访客可留便签
- **◌ 敬请期待** — 神秘栏目，正在烤炉里

## 🛠 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Vue 3 (Composition API) |
| 构建 | Vite |
| 样式 | 手写 CSS（Design Tokens + 双色投影 + 纸张噪点纹理） |
| 依赖 | 零 UI 库，零运行时依赖 |

## 🚀 本地运行

```bash
npm install        # 安装依赖
npm run dev        # 开发服务器（默认 5173）
npm run build      # 生产构建
npm run preview    # 预览构建产物
```

## 📁 目录结构

```
src/
├── data/content.js        # ★ 所有内容数据（名字/项目/博客/仓库…改这里）
├── components/
│   ├── PageHome.vue       # 首页（Hero + 项目 + 汉堡秘方）
│   ├── Burger25D.vue      # 2.5D 写实汉堡（纯 CSS）
│   ├── FormulaScroll.vue  # 秘方卷轴
│   ├── MiniComputer.vue   # 复古收银机（红蓝按钮 + 故障特效）
│   ├── ProjectModal.vue   # 全屏项目详情弹层
│   └── channels/          # 汉堡 6 层栏目（GitHub/博客/简历/兴趣/留言/敬请期待）
├── styles/
│   ├── tokens.css         # 设计令牌（配色/字体/间距/动效）
│   └── base.css           # 全局基础样式
└── assets/                # 图片资源
```

## 🎨 设计语言

暖米白纸底 + 砖红 + 芥末黄 + 深海蓝，复古印刷质感：双色投影、纸张噪点、衬线标题 + mono 标注。

---

📬 有问题？去 [留言墙](https://strangehamburger.github.io/QQ-Hamburger-blog/) 贴张便签 🦀
