import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import BookList from '@/components/BookList'
import Edit from '@/components/Edit'
import Register from '@/components/Register'
import D3Show from '@/components/D3Show'
import BookDirectory from '@/components/BookDirectory'
import Story from '@/components/Story'

Vue.use(Router)

export default new Router({
  mode:'history',
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
    },
    {
      path: '/d3show',
      name: 'D3Show',
      component: D3Show
    },
    {
      path: '/bookdirectory',
      name: 'BookDirectory',
      component: BookDirectory
    },
    {
      path: '/story',
      name: 'Story',
      component: Story
    }
  ]
})
