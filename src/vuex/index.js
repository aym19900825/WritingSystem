import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    // 全局变量
    state: {
        user: undefined,
        isLogin: false
    },
    // 修改全局变量必须通过mutations中的方法
    // mutations只能采用同步方法
    mutations: {
        login (state, payload) {
            state.user = payload;
            state.isLogin = true;
            sessionStorage.setItem("user",payload);
            sessionStorage.setItem("isLogin",true);
        },
        logout (state) {
            state.user = undefined;
            state.isLogin = false;
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("usisLoginer");
        }
    },
    // 异步方法用actions
    // actions不能直接修改全局变量，需要调用commit方法来触发mutation中的方法
    actions: {
        login (context, payload) {
            context.commit('login', payload)
        },
        logout (context) {
            context.commit('logout')
        }
    },

    getter: {
        isLogin (state) {  
            if (!state.isLogin) {      
                state.isLogin=sessionStorage.getItem('isLogin');   //从sessionStorage中读取状态  
                state.username=sessionStorage.getItem('username');  
            }  
            return state; 
        }  
    }
})

export default store

