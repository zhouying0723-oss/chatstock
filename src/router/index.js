import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../components/HomePage.vue') },
  { path: '/settings', name: 'settings', component: () => import('../components/SettingsPage.vue') },
]

export default createRouter({ history: createWebHistory(), routes })
