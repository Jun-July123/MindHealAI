// 2-1 路由的引入
// 2-1.1 安装路由 npm install vue-router
// 2-1.2 创建src/router/index.js，引入vue-router路由，history模式
import { createRouter, createWebHistory } from 'vue-router'
import BackendLayout from '@/components/BackendLayout.vue'  
import FrontendLayout from '@/components/FrontendLayout.vue'

// 2-1.3 创建后台一级路由BackEndLayout，二级路由
// 2-1.4 配置后台路由
const backendRoutes = [
  {
    path: '/back',
    // 24-1.5 重定向 访问back跳转到back/dashboard数据分析页面
    redirect: '/back/dashboard',
    component: BackendLayout,
    // 3-1.5 创建配置后台二级路由
    // 4-1.3 创建配置所有后台二级路由
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/backDashboard.vue'),
        // 4-1.4 二级路由配置meta-title及icon属性,用于显示在侧边菜单栏中
        meta: {
          title: '数据分析',
          icon: 'PieChart',
        }
      },
      {
        path: 'knowledge',
        component: () => import('@/views/backKnowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'ChatLineSquare',
        }
      },
      {
        path: 'consultations',
        component: () => import('@/views/backConsultations.vue'),
        meta: {
          title: '咨询记录',
          icon: 'Message',
        }
      },
      {
        path: 'emotional',
        component: () => import('@/views/backEmotional.vue'),
        meta: {
          title: '情绪日志',
          icon: 'User',
        }
      },
    ]
  },
  // 12-1.1 创建配置后台登录注册路由(一级路由Auth，二级路由登录、注册)
  {
    path:'/auth',
    component: () => import('@/components/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/views/login.vue'),
        meta: {
          title: '登录',
        }
      },
      {
        path: 'register',
        component: () => import('@/views/register.vue'),
        meta: {
          title: '注册',
        }
      },
    ]
  }
]

// 25-1.2 创建前台一级路由FrontendLayout，二级路由
const frontendRoutes = [
  {
    path: '/',
    redirect: '/home',
    component: FrontendLayout,
    children: [
      // 25-1.2.1 创建首页组件，配置为二级路由
      {
        path: 'home',
        component: () => import('@/views/frontHome.vue'),
      },
      // 25-1.2.2 创建AI咨询组件，配置为二级路由
      {
        path: 'consultation',
        component: () => import('@/views/frontConsutation.vue'),
        meta: {
          title: 'AI咨询',
        }
      },
      // 25-1.2.3 创建情绪日记组件，配置为二级路由
      {
        path: 'emotion-diary',
        component: () => import('@/views/frontEmotionDiary.vue'),
        meta: {
          title: '情绪日记',
        }
      },
      // 25-1.2.4 创建知识库组件，配置为二级路由
      {
        path: 'knowledge',
        component: () => import('@/views/frontKnowledge.vue'),
        props: true,//知识文章详情的id可以通过props传递接收
        meta: {
          title: '知识库',
        }
      },
      {
        // 29-2.4 router/index.js 创建文章详情组件，配置为二级路由，接收文章id
        path: 'knowledge/article/:id',
        component: () => import('@/views/frontDetailArticle.vue'),
        meta: {
          title: '文章详情',
        }
      },
    ]
  }
]
// 2-1.5 创建路由实例
const router = createRouter({
  // 25-1.3 将后台路由和前台路由合并到router实例中
  routes: [...backendRoutes, ...frontendRoutes],
  history: createWebHistory(),
})

// 24-1.6 路由前置守卫（路由跳转之前执行）
router.beforeEach((to, from, next) => {
  // 24-1.6.1 从本地存储中获取token
  const token = localStorage.getItem('token')
  // 24-1.6.2 如果token存在,获取userInfo信息,userType为2是后台管理员
  // 访问的是后台路由,则放行,否则跳转到back/dashboard数据分析页面
  if (token) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo.userType == 2 ) {
      if (to.path.startsWith('/back')) {
        next()
      } else {
        next('/back/dashboard')
      }
    }
    else if(userInfo.userType === 1){
      // 26-1.2 路由前置守卫，存在token且普通用户访问后台路由或登录注册路由,则跳转首页
      if (to.path.startsWith('/back')||to.path.startsWith('/auth')) {
        next('/')
      } else {
        next()
      }
    }
  }
  // 24-1.6.3 如果token不存在,访问的是后台路由,则跳转后台登录页
  else {
    if (to.path.startsWith('/back')) {
      next('/auth/login')
    } else {
      next()
    }
  }
})

// 2-1.6 导出路由实例
export default router


