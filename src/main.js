// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import $ from 'jquery'
import * as d3 from 'd3';

import App from './App'
import router from './router'
import store from './vuex'

import tinymce from 'vue-tinymce-editor'
import './axios'

import './assets/reset.css'




Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.component('tinymce', tinymce)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
