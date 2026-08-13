// ============================================================
// 站点内容数据 v3（改内容只动这个文件）
// ============================================================

export const profile = {
  name: 'QQ Hamburger',        // 名字
  nameCn: 'QQ 汉堡',
  title: '25届计算机科学与技术专业',
  tagline: '1816414891@qq.com',
  stamp: 'CS 2025',            // 印章文字
  employeeId: 'EMPLOYEE #025'
}

// 收银机屏幕照片（蓝色按钮循环切换，把图片放进 src/assets/ 后加路径）
export const photos = [
  import.meta.env.BASE_URL + 'src/assets/photo-1.jpg',
  import.meta.env.BASE_URL + 'src/assets/photo-2.jpg',
  import.meta.env.BASE_URL + 'src/assets/photo-3.jpg',
  import.meta.env.BASE_URL + 'src/assets/photo-4.jpg',
  import.meta.env.BASE_URL + 'src/assets/photo-5.jpg',
  import.meta.env.BASE_URL + 'src/assets/photo-6.jpg'
]

export const stats = []   // 数据条已删除（两端），保留空导出以防其他引用

export const skills = [
  'Vue 3', 'TypeScript', 'Python', 'Node.js',
  'Docker', 'Git', 'MySQL', 'Rust', 'Three.js', 'Linux'
]

// 技能分组（分组卡片用）
export const skillGroups = [
  {
    group: 'FRONTEND · 前端',
    icon: '◈',
    desc: '喜欢把界面做得又好看又能跑，最近沉迷动效。',
    items: ['Vue 3', 'TypeScript', 'CSS 动效', 'Three.js']
  },
  {
    group: 'BACKEND · 后端',
    icon: '▣',
    desc: '写 API 像做汉堡：配料清楚、层次分明。',
    items: ['Node.js', 'Python', 'MySQL', 'Rust']
  },
  {
    group: 'TOOLS · 工具',
    icon: '⚒',
    desc: '工欲善其事，这些是我的老伙计。',
    items: ['Docker', 'Git', 'Linux', 'VS Code']
  }
]

export const about = {
  paragraphs: [
    '你好，我是 QQ Hamburger，25届计算机科学与技术专业学生。喜欢把复杂的问题拆成有趣的零件，再组装成能跑的东西。',
    '空闲时间在 GitHub 上写开源，在深海餐厅里研究汉堡配方，偶尔也修修企鹅的电脑。'
  ],
  signature: 'Q.H.',
  photo: null  // TODO: 放个人照片路径（如 /src/assets/me.png）
}

export const timeline = [
  { year: '2022', title: '进入 CS 专业', desc: '从 Hello World 开始' },
  { year: '2023', title: '第一个 Web 项目', desc: '个人博客上线' },
  { year: '2024', title: '参加开源贡献', desc: '给 Vue 生态提 PR' },
  { year: '2025', title: '全栈实习', desc: '企业级项目实战' },
  { year: '2026', title: '毕业设计', desc: '深海餐厅管理系统' }
]

// ---- 汉堡 6 层（对应 6 个栏目） ----
export const burgerLayers = [
  { id: 'github',    num: '01', name: 'GitHub',       channel: 'GITHUB',      color: '#f2b84b', shape: 'bun-top' },
  { id: 'blog',      num: '02', name: '博客',         channel: 'BLOG',         color: '#f1ebe0', shape: 'lettuce' },
  { id: 'resume',    num: '03', name: '简历',         channel: 'RESUME',       color: '#e0452e', shape: 'cheese' },
  { id: 'interests', num: '04', name: '兴趣爱好',     channel: 'INTERESTS',    color: '#1a3048', shape: 'patty' },
  { id: 'guestbook', num: '05', name: '留言',         channel: 'GUESTBOOK',    color: '#24425e', shape: 'tomato' },
  { id: 'soon',      num: '06', name: '敬请期待',     channel: 'COMING SOON',  color: '#f2b84b', shape: 'bun-bottom' }
]

// 博客文章（博客栏目用）
export const blogs = []

export const resume = {
  education: [],   // 简历暂无（TODO: 有了再填）
  skills: []
}

export const projects = [
  {
    no: '01',
    name: 'QQ Hamburger Blog',
    desc: '个人博客，记录汉堡与代码的日常',
    year: '2026',
    tag: 'BLOG',
    image: import.meta.env.BASE_URL + 'src/assets/project-1.jpg',  // 项目封面图
    href: 'https://github.com/StrangeHamburger/QQ-Hamburger-blog',  // 项目链接（GitHub/线上地址）
    detail: {
      intro: '一个记录代码与生活的小站——把汉堡秘方和 bug 修复记在同一个屋檐下。',
      sections: [
        {
          type: 'paras',
          title: '项目背景',
          content: [
            '从大学第一年就想有一个自己的空间。课上敲的代码、课下踩的坑、深夜想明白的道理，都散落在各种笔记软件里，越堆越乱。',
            '试过 Notion、语雀、本地 Markdown……不是太笨重就是太封闭。最后决定：自己写一个，反正我是学计算机的。',
            '于是这个博客从"一时冲动"变成了第一个认真做的项目——用最熟悉的 Vue 3 从零搭起，每一行都是自己写的。'
          ]
        },
        {
          type: 'list',
          title: '功能亮点',
          content: [
            '文章发布与标签分类',
            '代码高亮（贴代码不糊是底线）',
            '响应式阅读体验（手机上也不挤）',
            '汉堡秘方专栏（正经博客，不正经的栏目）',
            '全站动效：纯 CSS 实现，零 JS 动画库',
            '留言墙：访客可以贴便签'
          ]
        },
        {
          type: 'chips',
          title: '技术栈',
          content: ['Vue 3', 'Vite', 'Markdown', 'CSS', 'JavaScript', 'Git']
        },
        {
          type: 'paras',
          title: '未来规划',
          content: [
            '支持全文搜索，文章多了也好找',
            '暗色模式（深夜写代码不刺眼）',
            '新栏目「深海日记」：记录海底餐厅的日常'
          ]
        },
        {
          type: 'paras',
          title: '过程中的收获',
          content: [
            '完整走了一遍从零搭项目的流程：需求 → 设计 → 实现 → 构建 → 部署',
            '对 Vue 组合式 API 和响应式原理有了真正的手感，不再是"照着文档抄"',
            '学会了把复杂页面拆成小组件：内容数据、样式令牌、交互逻辑各管各的'
          ]
        }
      ]
    }
  }
]

export const github = {
  username: 'StrangeHamburger',
  avatar: 'https://avatars.githubusercontent.com/StrangeHamburger',
  bio: '',                  // GitHub 个人简介（未设置）
  location: '',             // 位置（未设置）
  followers: 0,
  following: 0,
  publicRepos: 1,
  url: 'https://github.com/StrangeHamburger',
  repos: [
    {
      name: 'GomokuMind',
      desc: '五子棋策略评估与辅助系统：4种策略对比（启发式/Q-Learning/PPO/MCTS）',
      lang: 'Go',
      stars: 0,
      updatedDays: 62,
      href: 'https://github.com/StrangeHamburger/GomokuMind'
    }
  ]
}

export const interests = [
  {
    name: '运动',
    symbol: '◇',
    desc: '动起来才像话',
    image: import.meta.env.BASE_URL + 'src/assets/hobby-sport.jpg',
    items: ['羽毛球', '骑行', '台球', '乒乓球']
  },
  {
    name: '游戏',
    symbol: '▷',
    desc: '第二人生加载中',
    image: import.meta.env.BASE_URL + 'src/assets/hobby-game.jpg',
    items: ['鸣潮', '三角洲', '猛兽派对', '变色龙涂鸦']
  }
]

export const contacts = [
  { label: 'EMAIL', value: 'your@email.com', href: 'mailto:your@email.com' },
  { label: 'GITHUB', value: 'github.com/StrangeHamburger', href: 'https://github.com/StrangeHamburger' },
  { label: 'BLOG', value: 'blog.example.com', href: '#' }
]
