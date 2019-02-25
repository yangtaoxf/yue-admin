import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VCharts from 'v-charts'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
import global_ from './global'//引用文件
Vue.prototype.$global_ = global_

import '@/icons' // icon
import '@/permission' // permission control

import * as filters from './filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(Antd);
Vue.use(ElementUI, { locale })
Vue.use(VCharts)


Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
