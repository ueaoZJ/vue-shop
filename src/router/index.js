import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../components/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "about" */ '../components/Home.vue'),
    redirect: '/welcome',
    children:[
      {
        path: '/welcome',
        component: () => import(/* webpackChunkName: "about" */ '../components/Welcome.vue'),
      },
      {
        path: '/users',
        component: () => import(/* webpackChunkName: "about" */ '../components/User.vue'),
      },
      {
        path: '/rights',
        component: () => import(/* webpackChunkName: "about" */ '../components/Rights.vue'),
      },
      {
        path: '/roles',
        component: () => import(/* webpackChunkName: "about" */ '../components/Roles.vue'),
      },
      {
        path: '/categories',
        component: () => import(/* webpackChunkName: "about" */ '../components/Categories.vue'),
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to,from,next)=>{
  if(to.path=='/login') return next();
  const token = window.sessionStorage.getItem('token');
  if(!token) return next('/login');
  next();
})
export default router
