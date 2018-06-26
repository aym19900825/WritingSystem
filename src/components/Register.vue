<template>
    <el-form ref="registerForm" :model="newUser" :rules="rules" status-icon  label-width="80px" label-position="right"  class="login-container"> 
        <h3 class="title">注册</h3>
        <el-form-item label="用户名" prop="name">
             <el-input type="text" v-model="newUser.name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phoneNum">
            <el-input type="text" v-model="newUser.phoneNum"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="newUser.sex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
             <el-input type="password" v-model="newUser.pass"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
             <el-input type="password" v-model="newUser.checkPass"></el-input>
        </el-form-item>
        <el-form-item> 
            <el-button type="primary" @click="register" class="registerBtn">注册</el-button>
        </el-form-item>
        <p class="regitstTip">已有账号？<router-link to="/login">登录</router-link></p>
    </el-form>
</template>

<script>
    export default {
        name: 'Register',
        methods: {
            register() {
                this.$refs.registerForm.validate((valid) => {
                    if (valid) {
                        this.$axios.post('http://192.168.1.168:8888/api/register',{
                            username: this.newUser.name,
                            password: this.newUser.pass
                        }).then((res) => {
                            if (res.data.code==1) {
                                this.$confirm('您已经注册成功！', '提示', {
                                        confirmButtonText: '确定',
                                    }).then(({ value }) => {
                                        this.$router.replace('/login');
                                    }).catch(() => {
                                
                                });
                    
                            }else {
                                this.$message({
                                    type: 'error',
                                    message: '用户名已经存在',
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
                    ],
                    phoneNum:[
                        {
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
.login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 50px auto;
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
.registerBtn{
    width: 200px;
    margin-top: 10px;
}
p.regitstTip{
    text-align: center;
}
p.regitstTip a{
    text-decoration: underline;
}
</style>