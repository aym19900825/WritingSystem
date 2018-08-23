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
import ComAnnotation from '@/components/ComAnnotation'
import PersonInfo from '@/components/PersonInfo'

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
    meta:{
        requireAuth: true
    },
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
    meta:{
        requireAuth: true
    },
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
    meta:{
        requireAuth: true
    },
    component: D3Show
  },
  {
    path: '/bookdirectory',
    name: 'BookDirectory',
    meta:{
        requireAuth: true
    },
    component: BookDirectory
  },
  {
    path: '/story',
    name: 'Story',
    meta:{
        requireAuth: true
    },
    component: Story
  },
  {
    path: '/showrelation',
    name: 'ShowRelation',
    meta:{
        requireAuth: true
    },
    component: ShowRelation
  },
  {
    path: '/bookinfo',
    name: 'BookInfo',
    meta:{
        requireAuth: true
    },
    component: BookInfo
  },
  {
    path: '/editsoap',
    name: 'EditSoap',
    meta:{
        requireAuth: true
    },
    component: EditSoap
  },
  {
    path: '/bookrootdir',
    name: 'BookRootDir',
    meta:{
        requireAuth: true
    },
    component: BookRootDir
  },
  {
    path: '/bookdir',
    name: 'BookDir',
    meta:{
        requireAuth: true
    },
    component: BookDir
  },
  {
    path: '/comannotation',
    name: 'ComAnnotation',
    meta:{
        requireAuth: true
    },
    component: ComAnnotation
  },
  {
    path: '/personinfo',
    name: 'PersonInfo',
    meta:{
        requireAuth: true
    },
    component: PersonInfo
  }
];

const router = new Router({
  // mode:'history',  没有后端配合，打包index.html页面为空
  routes: routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
        var token = sessionStorage.getItem('writing-token');
        if (token) {  // 通过vuex state获取当前的token是否存在
            next();
        }
        else {
            next({
                path: '/login',
            })
        }
    }
    else {
        next();
    }
})


export default  router