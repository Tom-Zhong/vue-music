/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Sinnger from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
// 注册中间件router
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/singer',
      component: Sinnger
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/serach',
      component: Search
    }
  ]
})