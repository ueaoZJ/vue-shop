import Vue from 'vue'
import App from './App.vue'
import router from './router'
import TreeTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor'


Vue.config.productionTip = false

import NProgress from 'nprogress'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
})
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config;
})
Vue.prototype.$http = axios


Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.filter("dateFilter",(str)=>{
  let dt = new Date(str);
  let yy = dt.getFullYear();
  let mm = (dt.getMonth()+1+'').padStart(2,'0');
  let dd = (dt.getDate()+'').padStart(2,'0');
  
  let hh = (dt.getHours()+'').padStart(2,'0');
  let MM = (dt.getMinutes()+'').padStart(2,'0');
  let ss = (dt.getSeconds()+'').padStart(2,'0');
  return `${yy}-${mm}-${dd} ${hh}-${MM}-${ss}`;
})



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
