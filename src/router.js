import { createWebHistory, createRouter } from 'vue-router'
import Login from './views/Login.vue'
import Dashboard from './views/Dashboard.vue'
import ProductList from './views/ProductList.vue'
import ProductForm from './views/ProductForm.vue'
import Unauthorized from './components/Unauthorized.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductList,
    meta: { requiresAuth: true }
  },
  {
    path: '/product/create',
    name: 'ProductCreate',
    component: ProductForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/product/edit/:id',
    name: 'ProductEdit',
    component: ProductForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: Unauthorized
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token')
  const role = localStorage.getItem('user_role') // ambil role dari localStorage
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // Kalau butuh login tapi belum ada token → ke /unauthorized
  if (requiresAuth && !token) {
    next('/unauthorized')
  } 
  // Kalau butuh login & token ada, tapi bukan admin → tolak
  else if (requiresAuth && token && role !== 'admin') {
    next('/unauthorized')
  } 
  // Kalau sudah login & buka halaman login → redirect ke dashboard
  else if (to.path === '/' && token && role === 'admin') {
    next('/dashboard')
  } 
  else {
    next()
  }
})


export default router
