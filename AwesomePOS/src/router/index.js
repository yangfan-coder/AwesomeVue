import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/page/HelloWorld'
import Post from '@/components/page/post'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'post',
      component: Post
    }
  ]
})
