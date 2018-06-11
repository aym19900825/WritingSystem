import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import BookList from '@/components/BookList'
import Edit from '@/components/Edit'
import Register from '@/components/Register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/booklist',
      name: 'BookList',
      component: BookList
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/edit',
      name: 'Edit',
      component: Edit
    },
    {
      path: '/regiser',
      name: 'Register',
      component: Register
    }
  ]
})
