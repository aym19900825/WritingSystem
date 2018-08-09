<template>
  	<div id="header">
  		<div class="header-bg">
  			<header>
				<img src="../../assets/img/logo.png" alt="" />
				<ul class="login_list">
					<li v-if="userid==0||userid=='null'">
						<router-link :to="{ path: '/login' }">登录</router-link>
					</li>
					<!--
					<li v-if="userid==0||userid=='null'">
						<router-link :to="{ path: '/regiser' }">注册</router-link>
					</li>
					-->
					<li v-if="userid!=0"> 
						<el-dropdown>
						    <span class="el-dropdown-link">
						        {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
						    </span>
						    <el-dropdown-menu slot="dropdown">
						        <el-dropdown-item>
						        	<p @click="gotoPerson">个人信息</p>
						        </el-dropdown-item>
						        <el-dropdown-item>
						        	<p @click="isPwdDialog=true;">密码修改</p>
						        </el-dropdown-item>
						        <el-dropdown-item>
						        	<p @click="logout">退出</p>
						        </el-dropdown-item>
						    </el-dropdown-menu>
						</el-dropdown>
					</li>
				</ul>
			</header>
  		</div>
  		<el-dialog  title="密码修改" :visible.sync="isPwdDialog" width="30%"  :before-close="resetPwd">
		    <el-form ref="modifyForm" :model="pwdInfo" label-width="80px" label-position="top" style="border-top:1px solid rgba(233,235,242,1);" :rules="rules">
                <el-form-item label="原密码" prop="pwd">
                    <el-input  v-model="pwdInfo.pwd" placeholder="请输入原密码" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPwd">
                    <el-input v-model="pwdInfo.newPwd"  placeholder="请输入新密码" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input v-model="pwdInfo.checkPass"  placeholder="请确认新密码" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btnGrounp">
                    <el-button type="primary" @click="modifyPwd">确认</el-button>
                    <el-button @click="resetPwd" type="info">取消</el-button>
                </el-form-item>
            </el-form>
		</el-dialog>
  	</div>
</template>

<script>
import Config from '../../config.js'
export default {
    name: 'Header',
    data () {
    	var validatePass2 = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入新密码'));
            } else if (value !== this.pwdInfo.newPwd) {
              callback(new Error('两次输入新密码不一致!'));
            } else {
              callback();
            }
        };
    	return {
    		basic_url: Config.api,
        	userid:0,
        	username: "",
        	isPwdDialog: false,
        	pwdInfo:{
        		pwd: '',
        		newPwd: '',
        		checkPass: ''
        	},
        	rules: {
        		pwd:[
                        {
                            required: true,
                            message: '必填信息',
                            trigger: 'blur',
                        }
                    ],
                newPwd:[
                    {
                        required: true,
                        message: '必填信息',
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

  	},
  	methods:{
  		gotoPerson(){
  			this.$router.replace('/personinfo');
  		},
	  	logout () {
	  		sessionStorage.removeItem("userid");
	  		sessionStorage.removeItem("username");
	  		this.$router.replace('/login');
	    },
	    resetPwd(){
	    	this.$refs["modifyForm"].resetFields();
        	this.isPwdDialog = false;
    	},
	    modifyPwd() {
            var url = this.basic_url+'/api/user/modifyPassword';
            this.$refs.modifyForm.validate((valid) => {
                if (valid) {
                    this.$axios.post(url,{
                        userid: this.userid,
                        password: this.pwdInfo.pwd,
                        newpassword: this.pwdInfo.newPwd,
                    }).then((res) => {
                        if(res.data.code==1){
                        	this.$router.push({
                                path: '/login', 
                            })
                        }else{
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
    mounted(){
    	this.userid = sessionStorage.getItem("userid")?sessionStorage.getItem("userid"):0;
    	this.username = sessionStorage.getItem("username");
    }
}
</script>

<style scoped>
#header{
	width: 100%;
	height: 60px;
    background-color:linear-gradient(90deg,rgba(0,102,255,1),rgba(0,157,255,1));
}
.header-bg{
	width: 100%;
	height: 60px;
	background:linear-gradient(90deg,rgba(0,102,255,1),rgba(0,157,255,1));
}
header{
	width: 100%;
	box-sizing:border-box;
	-moz-box-sizing:border-box; /* Firefox */
	-webkit-box-sizing:border-box; 
	padding: 0px 100px;
	height: 60px;
	line-height: 60px;
	background:url('../../assets/img/header-rightbg.png');
	background-size:267px 50px;
	background-repeat:no-repeat;
	background-position:right 22px; 
}
.logoText{
	font-size: 30px;
	color: #fff;
	width:180px;
	display: block;
	float: left;
}
.login_list{
	display: block;
	float: right;
	padding-top: 25px;
}
.login_list li{
	float: left;
	height: 17px;
	line-height: 17px;
	padding: 0 15px;
}
.login_list li a{
	font-size: 15px;
	color: #fff;
}
.login_list li:nth-child(2){
	border-left: 1px solid #fff;
}
a.router-link-exact-active{
	font-size: 15px;
	color: #fff;
}
.el-dropdown-link{
	font-size: 15px;
	color: #fff;
	margin-rihgt: 5px;
}
.btnGrounp{
	text-align: center;
}
.btnGrounp button{
	width: 45%;
}
</style>
