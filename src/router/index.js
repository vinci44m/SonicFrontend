import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Videos from '../views/Videos.vue'
import Discussion from '../views/Discussion.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Live from '../views/Live.vue'

const routes = [
  { path: '/',            component: Home },
  { path: '/videos',      component: Videos },
  { path: '/discussion',  component: Discussion },
  { path: '/login',       component: Login },
  { path: '/register',    component: Register },
  { path: '/live',        component: Live },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
