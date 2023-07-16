import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element'

Vue.config.productionTip = false

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
})
Vue.prototype.$http = axios

let originPush =  Vue.prototype.push;  //备份原push方法
Vue.prototype.push = function (location, resolve, reject){
    if (resolve && reject) {    //如果传了回调函数，直接使用
        originPush.call(this, location, resolve, reject);
    }else {                     //如果没有传回调函数，手动添加
        originPush.call(this, location, ()=>{}, ()=>{}); 
    }
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
