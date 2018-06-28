<template>
    <el-form ref="loginForm" :model="user" :rules="rules" status-icon  label-width="80px" label-position="left"  class="login-container"> 
        <h3 class="title">登录</h3>
        <el-form-item prop="name" label="用户名">
            <el-input v-model="user.name" type="text" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="pass"  label="密码">
            <el-input v-model="user.pass" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item> 
            <el-button type="primary" icon="el-icon-upload" @click="login" class="submitBtn">登录</el-button>
        </el-form-item>
        <p class="regitstTip">没有账号？<router-link to="/regiser">注册</router-link></p>
    </el-form>
</template>

<script>
    export default {
        name: 'Login',
        methods: {
            login() {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.$axios.post('http://203.93.173.178:8888/api/login',{
                            username: this.user.name,
                            password: this.user.pass
                        } ).then((res) => {
                            if (res.data.code==1) {
                                this.$store.dispatch('login', res.data).then(() => {
                                    sessionStorage.setItem('url','login');
                                    this.$router.replace('/edit');
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
        data () {
            return {
                user: {},
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
.login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
}
.login-container .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
}
.login-container .remember {
    margin: 0px 0px 35px 0px;
}
.login-container .title:after{
    content: ' ';
    display: block;
    width: 100%;
    height: 2px;
    margin-top: 10px;
    background: -webkit-linear-gradient(left, rgba(235,228,242,0) 0%,rgba(235,228,242,0.8) 20%,rgba(235,228,242,1) 53%,rgba(235,228,242,0.8) 79%,rgba(235,228,242,0) 100%);
}
.submitBtn{
    float: right;
    width: 100px;
}
p.regitstTip{
    text-align: right;
}
p.regitstTip a{
    text-decoration: underline;
}
</style>