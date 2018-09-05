import Vue from 'vue'
import router from '../router'
import axios  from 'axios' 

// axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use(
  config => {
  	var token = sessionStorage.getItem('writing-token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config
  },
  err => {
    return Promise.reject(err)
  },
)

// http response 拦截器
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 401 清除token信息并跳转到登录页面
          sessionStorage.removeItem('writing-token');
          
          // 只有在当前路由不是登录页面才跳转
          sessionStorage.removeItem("userid");
	  	    sessionStorage.removeItem("username");
	  	    console.log("401");
          router.push({ path: 'login' });
        case 403:
          // 401 清除token信息并跳转到登录页面
          sessionStorage.removeItem('writing-token');
          sessionStorage.removeItem("userid");
	  	    sessionStorage.removeItem("username");
          console.log("403");

          // 只有在当前路由不是登录页面才跳转
          router.push({ path: 'login' });
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  },
)

function isTokenExpired() {
  let lastTime = sessionStorage.getItem("writing-expired-time");
  let expiredTime = 900;
  let nowTime = new Date().getTime();
  let diffTime = nowTime - lastTime;
  return expiredTime > diffTime;
}

function refreshToken(){
  let pwd = sessionStorage.removeItem("writingserity");
  let username = sessionStorage.removeItem("username");
}

Vue.prototype.$axios = axios