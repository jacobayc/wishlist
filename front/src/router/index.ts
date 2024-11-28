import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import ItemDetail from '../views/ItemDetail.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/items/:id',
    name: 'ItemDetail',
    component: ItemDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router