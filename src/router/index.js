import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/face-mesh'
  },
  {
    path: '/face-mesh',
    name: 'face-mesh',
    component: () => import('@/views/face-mesh')
  },
  {
    path: '/hands',
    name: 'hands',
    component: () => import('@/views/hands')
  },
  {
    path: '/holistic',
    name: 'holistic',
    component: () => import('@/views/holistic')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
