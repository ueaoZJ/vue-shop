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
    component: () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue'),
    redirect: '/welcome',
    children:[
      {
        path: '/welcome',
        name:'welcome',
        component: () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue'),
      },
      {
        path: '/users',
        name:'users',
        component: () => import(/* webpackChunkName: "users_rights_roles" */ '../components/User.vue'),
      },
      {
        path: '/rights',
        name:'rights',
        component: () => import(/* webpackChunkName: "users_rights_roles" */ '../components/Rights.vue'),
      },
      {
        path: '/roles',
        name:'roles',
        component: () => import(/* webpackChunkName: "users_rights_roles" */ '../components/Roles.vue'),
      },
      {
        path: '/categories',
        name:'categories',
        component: () => import(/* webpackChunkName: "cate_params" */ '../components/Categories.vue'),
      },
      {
        path: '/params',
        name:'params',
        component: () => import(/* webpackChunkName: "cate_params" */ '../components/Params.vue'),
      },
      {
        path: '/goods',
        name:'goods',
        component: () => import(/* webpackChunkName: "goods_add_edit" */ '../components/Goods.vue'),
      },
      {
        path: '/goods/add',
        component: () => import(/* webpackChunkName: "goods_add_edit" */ '../components/GoodsAdd.vue'),
      },
      {
        path: '/goods/edit',
        component: () => import(/* webpackChunkName: "goods_add_edit" */ '../components/GoodsEdit.vue'),
      },
      {
        path: '/orders',
        component: () => import(/* webpackChunkName: "order_reports" */ '../components/Orders.vue'),
      },
      {
        path: '/reports',
        component: () => import(/* webpackChunkName: "order_reports" */ '../components/Reports.vue'),
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
