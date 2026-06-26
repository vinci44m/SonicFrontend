import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Videos from '../views/Videos.vue'
import Discussion from '../views/Discussion.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Live from '../views/Live.vue'
import Upload from '../views/Upload.vue' // 1. Hier importieren

const routes = [
  { path: '/',            component: Home },
  { path: '/videos',      component: Videos },
  { path: '/discussion',  component: Discussion },
  { path: '/login',       component: Login },
  { path: '/register',    component: Register },
  { path: '/live',        component: Live },
  { path: '/upload',      component: Upload }, // 2. Hier den Pfad hinzufügen
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router