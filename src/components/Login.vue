<template>
    <div id="login">
        <v-header></v-header>
        <div style="height: 50px; width: 100%;"></div>
        <el-container>
            <el-main>
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="8">
                        <img src="../assets/img/login_img.png" alt="" class="loginbg"/>
                    </el-col>
                    <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
                    <el-col :span="6">
                        <el-form ref="loginForm" :model="user" :rules="rules"  status-icon  label-width="80px" label-position="top"  class="login-container"> 
                            <h3>作者登录</h3>
                            <el-form-item label="手机号" prop="name">
                                <el-input  type="text" placeholder="手机号" v-model="user.name"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="pass">
                                <el-input type="password" placeholder="密码" v-model="user.pass"></el-input>
                            </el-form-item>
                            <el-form-item> 
                                <el-button type="primary" class="submitBtn" @click="login">登录</el-button>
                            </el-form-item>
                            <!--
                            <p class="regitstTip"><router-link to="/regiser">新用户？</router-link></p>
                            -->
                        </el-form>
                    </el-col>
                </el-row>
            </el-main>
        </el-container>
  </div>
</template>

<script>
import Config from '../config.js'
import Encrypt from '../cryptojs.js'
import Header from './common/Header.vue'
    export default {
        name: 'Login',
        methods: {
            loginEnter(e){
                if(e.keyCode==13){
                    this.login();
                }
            },
            login() {
                this.$refs.loginForm.validate((valid) => {
                    var url = this.basic_url+'/api/login';
                    if (valid) {
                        var str = Encrypt(this.user.pass);
                        this.$axios.post(url,{
                            username: this.user.name,
                            password: str
                        }).then((res) => {
                            if (res.data.code==1) {
                                sessionStorage.setItem('url','login');
                                sessionStorage.setItem('writing-expired-time',new Date().getTime());
                                sessionStorage.setItem('userid',res.data.userid);
                                sessionStorage.setItem('username',res.data.username);
                                sessionStorage.setItem('writing-token',res.data.token);
                                sessionStorage.setItem('writingserity',str);

                                this.$axios.post(this.basic_url+'/api/work/detail',{
                                    userid: res.data.userid
                                }).then((res)=>{
                                    if(res.data.code==0){
                                        this.$router.replace('/booklist');
                                    }else{
                                        this.$router.replace('/edit');
                                    }
                                }).catch((err)=>{
                                    this.$message({
                                        type: 'error',
                                        message: '网络错误，请重试',
                                        showClose: true
                                    })
                                })
                                
                                
                            }else {
                                this.$message({
                                    type: 'error',
                                    message: '用户名或密码错误',
                                    showClose: true
                                })
                            }
                        }).catch((err) => {
                            this.$message({
                                type: 'error',
                                message: '网络错误，请重试',
                                showClose: true
                            })
                        })
                    }
                    else {
                        return false
                    }
                })
            }
        },
        components:{
            'v-header': Header
        },
        data () {
            return {
                user: {},
                basic_url: Config.api,
                rules:  {
                    name:[
                        {
                            required: true,
                            message: '必填信息',
                            trigger: 'blur',
                        }
                    ],
                    pass:[
                        {
                            required: true,
                            message: '必填信息',
                            trigger: 'blur',
                        }
                    ]
                }
            }
        }
    }
</script>

<style scoped>
<!--
header{
    height: 80px;
    line-height: 80px;
}
.login_list{
    padding-top: 25px;
}
.login-container{
    margin-top: 100px;
}
-->
#login{
    width: 100%;
    height: 100%;
    overflow: hidden;   
    min-width: 960px;
}
.login-container{
    margin-top: 100px;
}
.login-container h3{
    height: 50px;
    line-height: 50px;
    font-size: 27px;
    border-bottom:2px solid rgba(233,235,242,1);
    margin-bottom: 15px;
}
.submitBtn{
    width: 100%;
    margin-top: 30px;
}
.regitstTip{
    font-size: 13px;
    color:rgba(44,193,108,1);
    text-align: right;
}
.regitstTip a{
    color:rgba(44,193,108,1);
    text-decoration: underline;
}
.el-form-item{
    margin-bottom: 12px;
}
.loginbg{
    width: 486px;
}
</style>
