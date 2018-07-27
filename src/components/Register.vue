<template>
    <div id="registe">
        <div class="registebg">
             <div class="registe_box">
                <el-form status-icon ref="registerForm" :model="newUser" :rules="rules" label-width="80px" label-position="top"  class="registe_container" id="form"> 
                    <h3>作家注册</h3>
                    <el-form-item label="用户名" prop="name">
                         <el-input type="text" v-model="newUser.name"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" prop="phoneNum">
                        <el-input type="text" v-model="newUser.phoneNum"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pass">
                         <el-input type="password" v-model="newUser.pass"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                         <el-input type="password" v-model="newUser.checkPass"></el-input>
                    </el-form-item>
                    <el-form-item> 
                        <p class="regitstTip"><router-link to="/login">已有账号？</router-link></p>
                        <el-button type="success" class="registerBtn" @click="register">注册</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Config from '../config.js'
    export default {
        name: 'Register',
        methods: {
            login(){
                this.dialogVisible = false;
                this.$router.replace("/login");
            },
            handleClose(){
                this.login();
            },
            register() {
                var url = this.basic_url+'/api/register';
                this.$refs.registerForm.validate((valid) => {
                    if (valid) {
                        this.$axios.post(url,{
                            username: this.newUser.name,
                            password: this.newUser.pass,
                            phonenumber: parseInt(this.newUser.phoneNum),
                            sex: this.newUser.sex
                        }).then((res) => {
                            if (res.data.code==1) {
                                this.$router.push({
                                    path: '/login', 
                                })
                            }else {
                                this.$message({
                                    type: 'error',
                                    message: res.data.message,
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
                        return false;
                    }
                })
            }
        },
        data () {
            var checkPhone = (rule, value, callback) => {
                if (!value) {
                  return callback(new Error('必填'));
                }
                setTimeout(() => {
                    var re = /^1\d{10}$/;
                    if (!re.test(value)) {
                        callback(new Error('请输入正确的手机号'));
                    } else {
                        callback();
                    }
                }, 1000);
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请再次输入密码'));
                } else if (value !== this.newUser.pass) {
                  callback(new Error('两次输入密码不一致!'));
                } else {
                  callback();
                }
            };
            return {
                newUser: {
                    name: '',
                    pass: '',
                    checkPass: '',
                    phoneNum: '',
                    sex: ''
                },
                basic_url: Config.api,

                dialogVisible: false,

                rules:  {
                    name:[
                        {
                            
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
                    ],
                    phoneNum:[
                        {
                            required: true,
                            validator: checkPhone, 
                            trigger: 'blur'
                        }
                    ],
                    checkPass:[
                        {
                            validator: validatePass2, 
                            trigger: 'blur'
                        }
                    ]
                }
            }
        }
    }
</script>
<style scoped>
<!--
.registe_box{
    width: 640px;
    height: 700px;
}
.registe_container{
    padding: 160px;
}
.registe_container{
    font-size: 27px;
}
-->
#registe{
    width: 100%;
    height: 100%
}
.registebg{
    width: 100%;
    height: 100%;
    min-height: 660px;
    background-image: url('../assets/img/registe_bg.png');
    background-size: 100% 100%;
    background-repeat:no-repeat;
    position: absolute;
}
.registe_box{
    width: 440px;
    height: 100%;
    min-height: 660px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0%);
    background-color: rgb(0,157,255,1);
    background-image: url('../assets/img/header-rightbg.png');
    background-size: 440px 120px;
    background-repeat:no-repeat;
    background-position:right bottom; 
}
.registe_container{
    box-sizing:border-box;
    -moz-box-sizing:border-box; /* Firefox */
    -webkit-box-sizing:border-box; /* Safari */
    width: 100%;
    padding: 60px;
    margin-top: 60px;
}
.registe_container{
    height: 38px;
    line-height: 38px;
    font-size:24px;
    color:rgba(255,255,255,1);
}
.el-form-item{
    margin-bottom: 10px;
}
.registerBtn{
    margin-top: 40px;
    width: 160px;
    float: right;
}
.regitstTip{
    float: left;
    color: #fff;
    margin-top: 50px;
}
.regitstTip a{
    color: #fff;
    text-decoration: underline;
}

</style>