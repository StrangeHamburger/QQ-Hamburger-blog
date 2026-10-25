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
  import.meta.env.BASE_URL + 'assets/photo-1.webp',
  import.meta.env.BASE_URL + 'assets/photo-2.webp',
  import.meta.env.BASE_URL + 'assets/photo-3.webp',
  import.meta.env.BASE_URL + 'assets/photo-4.webp',
  import.meta.env.BASE_URL + 'assets/photo-5.webp',
  import.meta.env.BASE_URL + 'assets/photo-6.webp'
]

export const stats = []   // 数据条已删除（两端），保留空导出以防其他引用

export const skills = [
  'Vue 3', 'TypeScript', 'Python', 'Node.js',
  'Docker', 'Git', 'MySQL', 'Rust', 'Three.js', 'Linux'
]

// 技能分组（分组卡片用）——level 是实在的熟练度标签，自信但不吹
export const skillGroups = [
  {
    group: 'FRONTEND · 前端',
    icon: '◈',
    level: '主战场',
    desc: '界面好看又能跑是我的追求，CSS 动效和 3D 场景都在这个网站里用上了。',
    items: ['Vue 3', 'TypeScript', 'CSS 动效', 'Three.js']
  },
  {
    group: 'BACKEND · 后端',
    icon: '▣',
    level: '持续补课',
    desc: '能写出跑得起来的接口。像做汉堡：一层一层，认真堆好。',
    items: ['Node.js', 'Python', 'MySQL', 'Rust']
  },
  {
    group: 'TOOLS · 工具',
    icon: '⚒',
    level: '日常顺手',
    desc: '工欲善其事，这几件是我的老伙计。',
    items: ['Docker', 'Git', 'Linux', 'VS Code']
  }
]

export const about = {
  paragraphs: [
    '你好，我是 QQ Hamburger，25 届计算机科学与技术专业。喜欢把想法做成能跑的东西——你现在看到的这个网站，从设计、动效到部署，就是我独立完成的。',
    '前端是我的主场，后端和工具链在持续补课。做汉堡和写代码是一个道理：一层一层，认真堆好。'
  ],
  signature: 'Q.H.',
  photo: null  // TODO: 放个人照片路径（如 /src/assets/me.webp）
}

export const timeline = [
  { year: '2022', title: '进入 CS 专业', desc: '从 Hello World 开始' },
  { year: '2023', title: '第一个 Web 项目', desc: '个人博客上线' },
  { year: '2024', title: '参加开源贡献', desc: '给 Vue 生态提 PR' },
  { year: '2025', title: '全栈实习', desc: '企业级项目实战' },
  { year: '2026', title: '毕业设计', desc: '深海餐厅管理系统' }
]

// ---- 汉堡 6 层（对应 6 个栏目）+ 每层的食材来源彩蛋 ----
// name = 栏目名（卷轴/抽屉用）；ingredient + source = 点击汉堡层的食材来源彩蛋
export const burgerLayers = [
  { id: 'github',    num: '01', name: 'GitHub',   channel: 'GITHUB',      color: '#f2b84b', shape: 'bun-top',
    ingredient: '顶层面包', source: '深海麦田现烤，每天清晨 5 点由海绵宝宝新鲜送达。' },
  { id: 'blog',      num: '02', name: '博客',     channel: 'BLOG',         color: '#f1ebe0', shape: 'lettuce',
    ingredient: '脆脆生菜', source: '比奇堡有机农场直供，蟹老板为了批发价砍了三小时。' },
  { id: 'resume',    num: '03', name: '简历',     channel: 'RESUME',       color: '#e0452e', shape: 'cheese',
    ingredient: '浓香芝士', source: '章鱼哥擦了三年的芝士轮，成熟度刚刚好。' },
  { id: 'interests', num: '04', name: '兴趣爱好', channel: 'INTERESTS',    color: '#1a3048', shape: 'patty',
    ingredient: '秘制肉饼', source: '成分保密——痞老板偷了 17 年都没得手。' },
  { id: 'guestbook', num: '05', name: '留言',     channel: 'GUESTBOOK',    color: '#24425e', shape: 'tomato',
    ingredient: '沙甜番茄', source: '珊瑚礁日光温室现摘，沙甜多汁还会脸红。' },
  { id: 'soon',      num: '06', name: '敬请期待', channel: 'COMING SOON',  color: '#f2b84b', shape: 'bun-bottom',
    ingredient: '底层面包', source: '和顶层面包是一对，从小一起长大的。' }
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
    id: 'qq-hamburger-blog',   // 路由 id（/projects/:id）
    name: 'QQ Hamburger Blog',
    desc: '个人博客，记录汉堡与代码的日常',
    year: '2026',
    tag: 'BLOG',
    image: import.meta.env.BASE_URL + 'assets/project-1.webp',  // 项目封面图
    href: 'https://github.com/StrangeHamburger/QQ-Hamburger-blog',  // 项目链接（GitHub/线上地址）
    detail: {
      intro: '一个装满汉堡秘方和代码彩蛋的个人站。',
      sections: [
        {
          type: 'paras',
          title: '项目简介',
          content: [
            '2026 年夏天从零搭起来的个人网站。配色、内容、交互都是自己定的——蟹堡王配色（暖米白 / 砖红 / 芥末黄 / 深海蓝）是反复试出来的。',
            '开发过程就是不断推翻重来：CSS 入场动画否过一版，Three.js 海岛开场也做过，最后定稿现在的深海房间。'
          ]
        },
        {
          type: 'list',
          title: '功能亮点',
          content: [
            '3D 深海房间开场：点笔记本把网站投影到屏幕（桌面端），墙上挂画可靠近查看',
            '6 层写实汉堡纯 CSS：hover 秘方卷轴条目，对应层右移放大',
            '复古收银机：POWER/PHOTO 按钮 + 故障特效 + 隐藏凤凰彩蛋',
            '手机端直出主页：跳过 3D，移动端布局单独适配',
            '留言墙 giscus：评论同步到仓库 Discussions，GitHub 账号登录',
            'GitHub Actions 自动部署 + 自定义域名'
          ]
        },
        {
          type: 'chips',
          title: '技术栈',
          content: ['Vue 3', 'Vite', 'Three.js', 'CSS', 'giscus', 'GitHub Actions']
        },
        {
          type: 'paras',
          title: '未来规划',
          content: [
            '补上博客内容：把踩过的坑和做网站的过程写出来',
            '继续打磨 3D 场景：加更多可交互的小物件',
            '给收银机加新的彩蛋'
          ]
        },
        {
          type: 'paras',
          title: '过程中的收获',
          content: [
            '完整走了一遍 设计 → 开发 → 部署 的流程：组件拆分、设计令牌、响应式布局、GitHub Pages 部署',
            '对细节的执念：每个动效、每个间距都是手动调过的'
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
    image: import.meta.env.BASE_URL + 'assets/hobby-sport.webp',
    items: ['羽毛球', '骑行', '台球', '乒乓球']
  },
  {
    name: '游戏',
    symbol: '▷',
    desc: '第二人生加载中',
    image: import.meta.env.BASE_URL + 'assets/hobby-game.webp',
    items: ['鸣潮', '三角洲', '猛兽派对', '变色龙涂鸦']
  }
]

export const contacts = [
  { label: 'EMAIL', value: 'your@email.com', href: 'mailto:your@email.com' },
  { label: 'GITHUB', value: 'github.com/StrangeHamburger', href: 'https://github.com/StrangeHamburger' },
  { label: 'BLOG', value: 'blog.example.com', href: '#' }
]
