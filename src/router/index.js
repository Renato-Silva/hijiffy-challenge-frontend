import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        redirectIfLoggedIn: false,
        noAuth: false
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        redirectIfLoggedIn: true,
        noAuth: true
      }
    }
  ]
})

router.beforeEach(to => {
  const isLoggedIn = localStorage.getItem('token') !== null

  if (to.meta.redirectIfLoggedIn === true && isLoggedIn) {
    return { name: 'home' }
  }

  if (to.meta.noAuth === true) {    
    return
  }

  if (!isLoggedIn) {
    return { name: 'login' }
  }

})

export default router
