import Vue from 'vue'
import Router from 'vue-router'
import Login from '../pages/login/login.vue'
import Home from '../pages/home/home.vue'
import Users from '../pages/users/users.vue'
import Rights from '../pages/rights/rights.vue'
import Roles from '../pages/rights/roles.vue'
import Goods from '../pages/goods/goods.vue'
import GoodsAdd from '../pages/goods/goodsadd.vue'
import Params from '../pages/goods/params.vue'
import Categories from '../pages/goods/categories.vue'
import { Message } from 'element-ui'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles
        },
        {
          name: 'goods',
          path: '/goods',
          component: Goods
        },
        {
          name: 'goodsadd',
          path: '/goodsadd',
          component: GoodsAdd
        },
        {
          name: 'params',
          path: '/params',
          component: Params
        },
        {
          name: 'categories',
          path: '/categories',
          component: Categories
        }
      ]
    }
  ]
})
// 在路由配置生效之前，统一判断token
// 路由守卫，在路由配置生效之前
// 路由/导航守卫
// to -> 要去的路由配置
// from -> 当前的路由配置
// / -> /login home->login to就是login from就是home路由配置
router.beforeEach((to, from, next) => {
  // to from next
  // 如果要去的是登录 -> next()
  // console.log(to, from)

  if (to.path === '/login') {
    next()
  } else {
    // 如果要去的不是登录
    // 判断token
    const token = localStorage.getItem('token')
    if (!token) {
      // 如果token没有->login
      // this.$router.push({ name: 'login' })
      Message.warning('请先登录')
      router.push({name: 'login'})
    }
  }
  next()
})
export default router
