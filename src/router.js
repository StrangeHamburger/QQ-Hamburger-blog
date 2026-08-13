import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ProjectDetail from './views/ProjectDetail.vue'

// history 路由（GitHub Pages 用 public/404.html 兜底刷新）
// 路由变化：项目详情独立 URL，如 /projects/qq-hamburger-blog
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/projects/:id', name: 'project', component: ProjectDetail },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() { return { top: 0 } }
})

export default router
