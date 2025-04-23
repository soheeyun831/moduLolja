// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/Home.vue';
import BalancePage from '@/views/Balance.vue';
import RandomPage from '@/views/Random.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/', name: 'Home', meta: { title: '모두롤자' }, component: HomePage,
  },
  {
    path: '/balance', name: 'Balance', meta: { title: '모두롤자 | 협곡 팀짜기' }, component: BalancePage,
  },
  {
    path: '/random', name: 'Random', meta: { title: '모두롤자 | 칼바람 팀짜기' }, component: RandomPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  console.log(to);
  document.title = to.meta.title as string || '모두롤자';
  next();
});

export default router;
