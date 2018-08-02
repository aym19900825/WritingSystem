import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import BookList from '@/components/BookList'
import Edit from '@/components/Edit'
import Register from '@/components/Register'
import D3Show from '@/components/D3Show'
import BookDirectory from '@/components/BookDirectory'
import BookInfo from '@/components/BookInfo'
import Story from '@/components/Story'
import ShowRelation from '@/components/ShowRelation'
import EditSoap from '@/components/EditSoap'
import BookRootDir from '@/components/BookRootDir'
import BookDir from '@/components/BookDir'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
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
  },
  {
    path: '/showrelation',
    name: 'ShowRelation',
    component: ShowRelation
  },
  {
    path: '/bookinfo',
    name: 'BookInfo',
    component: BookInfo
  },
  {
    path: '/editsoap',
    name: 'EditSoap',
    component: EditSoap
  },
  {
    path: '/bookrootdir',
    name: 'BookRootDir',
    component: BookRootDir
  },
  {
    path: '/bookdir',
    name: 'BookDir',
    component: BookDir
  }
];

const router = new Router({
  // mode:'history',  没有后端配合，打包index.html页面为空
  routes: routes
})

/*router.beforeEach((to, from, next)=>{
  let userid = window.sessionStorage.getItem('write-userid');
  if(!userid || userid === null){
    next({
      path: '/login'
    });
  }else{
    next();
  }
})*/


export default  router