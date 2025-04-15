// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomePage from '@/views/Home.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: HomePage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
