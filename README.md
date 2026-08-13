# 🍔 QQ Hamburger Blog

> 在深海和代码之间，构建有趣的东西。 · 1816414891@qq.com

**QQ Hamburger** 的个人网站 · Vue 3 + Vite + Three.js · 纯手写 CSS · 零 UI 库

🌐 在线访问：[https://qqhamburger.top](https://qqhamburger.top)（备用：[GitHub Pages](https://strangehamburger.github.io/QQ-Hamburger-blog/)）

---

## ✨ 特色

- **🌊 3D 深海房间开场（桌面端）** — Three.js 手搓场景：吊灯 / 挂画 / 汉堡 / 可乐 / 立体键盘笔记本，点击笔记本相机推近，把真实网站 DOM 投影到屏幕上（matrix3d 门户）；点击墙上 4 幅画可靠近查看，每幅画对应一段专属音效
- **📱 响应式分流** — 手机端跳过 3D 场景直接展示网站主页（移动端适配集中在 `MobileHome.vue`），桌面端保留完整 3D 入口
- **🍔 6 层写实汉堡** — 纯 CSS 侧视剖面：高拱芝麻面包 / 波浪生菜 / 滴落芝士 / 焦边肉饼 / 番茄片，配餐盘垫纸、热气、浮动动画
- **📜 秘方卷轴** — 点击展开 6 层秘方，hover 条目汉堡对应层右移放大，点击滑出详情抽屉
- **🖥 复古收银机** — 红/蓝按钮（POWER 开关屏幕 / PHOTO 切换照片），关屏时雪花噪点 + RGB 分离故障特效；隐藏彩蛋：连点屏幕触发"凤凰丁神奶"对话（语音气泡可点击推进）
- **📁 项目展示** — 点击小方块弹出全屏 case study（背景 / 功能 / 技术栈）
- **🐙 GitHub 面板** — 用户卡（头像 / 关注数）+ 仓库列表（语言 / stars / 更新时间）
- **💬 留言墙** — giscus 驱动（GitHub Discussions），访客用 GitHub 账号登录即可留言，评论真实同步到仓库
- **◌ 敬请期待** — 神秘栏目，正在烤炉里

## 🛠 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Vue 3 (Composition API) |
| 构建 | Vite |
| 3D | Three.js（动态 import 懒加载分包） |
| 样式 | 手写 CSS（Design Tokens + 双色投影 + 纸张噪点纹理） |
| 留言 | giscus（GitHub Discussions API） |
| 部署 | GitHub Actions → GitHub Pages + 自定义域名 |

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
├── data/content.js        # ★ 所有内容数据（名字/项目/照片/仓库…改这里）
├── components/
│   ├── PageHome.vue       # 主页（Hero + 项目 + 汉堡秘方 + 收银机）
│   ├── MobileHome.vue     # 移动端入口（跳过 3D，移动端适配集中于此）
│   ├── KrustyScene.vue    # 3D 房间场景组件（桌面端开场）
│   ├── ScreenPortal.vue   # DOM 门户（网站投影到 3D 笔记本屏幕）
│   ├── Burger25D.vue      # 2.5D 写实汉堡（纯 CSS）
│   ├── BurgerSection.vue  # 汉堡区（海底场景 + 秘方卷轴布局）
│   ├── FormulaScroll.vue  # 秘方卷轴（展开/收起 + 装饰图）
│   ├── MiniComputer.vue   # 复古收银机（POWER/PHOTO + 凤凰彩蛋）
│   ├── ProjectModal.vue   # 全屏项目详情弹层
│   ├── ProjectsShowcase.vue # 项目小方块 + GitHub 面板
│   └── channels/          # 汉堡 6 层栏目（GitHub/博客/简历/兴趣/留言/敬请期待）
├── three/
│   ├── krustyScene.js     # 3D 场景核心（房间/笔记本/投影/看画/音效）
│   └── portalRef.js       # 门户引用桥
├── styles/
│   ├── tokens.css         # 设计令牌（配色/字体/间距/动效）
│   └── base.css           # 全局基础样式
├── utils/sound.js         # 全局音效（Web Audio 合成 + 视频提取样本）
└── assets/                # 图片资源（public/assets 为运行时引用）
```

## 🎨 设计语言

暖米白纸底 + 砖红 + 芥末黄 + 深海蓝，复古印刷质感：双色投影、纸张噪点、衬线标题 + mono 标注。桌面端入口为 3D 深海房间（暖光吊灯 + 木桌 + 漂浮气泡），点击笔记本"进入"网站。

## 🚢 部署

GitHub Actions 自动构建部署（`.github/workflows/deploy.yml`），推送 main 即上线：

- **自定义域名**：`qqhamburger.top`（CNAME → strangehamburger.github.io）
- **GitHub Pages**：`strangehamburger.github.io/QQ-Hamburger-blog/`

---

📬 有问题？去 [留言墙](https://qqhamburger.top) 贴张便签 🦀
