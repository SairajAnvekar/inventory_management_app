import Vue from 'vue'
import Router from 'vue-router'
import * as Auth from '@/components/pages/Authentication'
// Pages
import Authentication from '@/components/pages/Authentication/Authentication'
import Home from '@/components/pages/Home'
import Product from '@/components/pages/Product'
import Stock from '@/components/pages/Stock'
import Users from '@/components/pages/Users'
// Global components
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Register components
Vue.component('app-header', Header)
Vue.component('app-footer', Footer)
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      components: {
        default: Home,
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/manageProduct',
      name: 'Product',
      components: {
        default: Product,
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/manageStock',
      name: 'Stock',
      components: {
        default: Stock,
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/manageUsers',
      name: 'Users',
      components: {
        default: Users,
        header: Header,
        foter:Footer
      },
      meta: {
        requiredAuth: true
      }
    },
    {
      path: '/login',
      name: 'Authentication',
      component: Authentication
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(Auth.default.user)
  if (to.meta.requiredAuth) {
    if (Auth.default.user.authenticated) {
      next()
    } else {
      router.push('/login')
    }
  } else {
    next()
  }
})

export default router
