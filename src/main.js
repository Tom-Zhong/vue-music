import 'babel-polyfill' //
import Vue from 'vue'
import App from './App'
import router from './router' // 引入路由
import fastclick from 'fastclick' // 减少300毫秒点击延迟
import 'common/stylus/index.styl' // 引入全局样式
import VueLazyload from 'vue-lazyload'

// or with options
Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})

Vue.config.productionTip = false

// 去掉三百毫秒的延迟
fastclick.attach(document.body)
  /* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})