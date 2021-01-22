/*
 * @Descripttion: 使用ctrl+alt+i添加头部注释，ctrl+alt+t添加方法注释, 或者复制方法名后使用gocm来添加方法注释
 * @version: 
 * @Author: bb
 * @Date: 2020-10-12 09:04:32
 * @LastEditors: bb
 * @LastEditTime: 2021-01-22 11:36:57
 */
import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import VueRouter from 'vue-router'
import LoginBox from './components/Login/LoginBox.vue'
import MainPage from './components/MainPage/MainPage.vue'
import ListPage from './components/ListPage/ListPage.vue'
import axios from 'axios'


axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$http=axios.create({
  baseURL: 'http://192.168.140.58:9000',
})
Vue.use(VueRouter);
Vue.config.productionTip = false

let router = new VueRouter({
  routes: [{
    path: "/",
    component: LoginBox
  }, 
  {
    path: '/mainPage',
    component: MainPage
  },
  {
    path: '/listPage',
    component: ListPage
  }
]
});

new Vue({
  render: h => h(App),
  router: router,
}).$mount('#app')
