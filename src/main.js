// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
import '@/assets/css/common.css'
import MyHttpServer from '@/plugins/http.js'
import moment from 'moment'
// // 导入自定义组件
// import MyBread from '@/components/common/myBread.vue'
import '@/plugins/components.js'
// import axios from 'axios'
// Vue.prototype.$http = axios
// Vue.use(axios)
Vue.use(ElementUI)
Vue.use(MyHttpServer)
Vue.config.productionTip = false

// 全局过滤器 - 处理日期
Vue.filter('fmtdate', (v) => {
  return moment.unix(v).format('YYYY-MM-DD HH:mm:ss')
})
// // 全局自定义组件
// Vue.component('my-bread', MyBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
