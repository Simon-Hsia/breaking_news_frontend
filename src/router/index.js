import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout'),
    redirect: '/home', // 默认显示首页的二级路由
    children: [
      {
        path: 'home',
        component: () => import('@/views/home')
      },
      {
        path: 'user-info', // 这里必须叫user-info, 因为侧边栏导航切换的是它
        component: () => import('@/views/user/userInfo')
      },
      {
        path: 'user-avatar', // 必须用这个值
        component: () => import('@/views/user/userAvatar')
      },
      {
        path: 'user-pwd', // 必须用这个值
        component: () => import('@/views/user/userPwd')
      },
      {
        path: 'art-cate', // 文章分类
        component: () => import('@/views/article/artCate')
      },
      {
        path: 'art-list', // 文章列表
        component: () => import('@/views/article/artList')
      }
    ]
  },
  {
    path: '/reg',
    component: () => import('@/views/register')
    /*  webpack提供import函数来路由懒加载导入组件
        路由懒加载，就是页面路由路径切换到/ reg, 才去加载对应组件
        代码好处: 让首页加载文件体积更新，打开更快 */
  },
  {
    path: '/login',
    component: () => import('@/views/login')
  }
]

const router = new VueRouter({
  routes
})

const whiteList = ['/login', '/reg']
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    if (!store.state.userInfo.username) {
      // 有token但是没有用户信息, 才去请求用户信息保存到vuex里
      // 调用actions里方法请求数据
      store.dispatch('initUserInfo')
    }
    // 下次切换页面vuex里有用户信息数据就不会重复请求用户信息
    next() // 路由放行
  } else {
    // 如果是想去登录注册，那就放你走
    if (whiteList.includes(to.path)) return next()
    // 你又没token，又想去登录注册以外的页面，不行，强制转到登录页
    next('/login')
  }
})
export default router
