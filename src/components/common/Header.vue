<template>
  	<div id="header">
  		<div class="header-bg">
  			<header>
				<img src="../../assets/img/logo.png" alt="" />
				<ul class="login_list">
					<li v-if="!user">
						<router-link :to="{ path: '/login' }">登录</router-link>
					</li>
					<li v-if="!user">
						<router-link :to="{ path: '/regiser' }">注册</router-link>
					</li>
					<li v-if="user"> 
						<el-dropdown>
						    <span class="el-dropdown-link">
						        {{user.username}}<i class="el-icon-arrow-down el-icon--right"></i>
						    </span>
						    <el-dropdown-menu slot="dropdown">
						        <el-dropdown-item>
						        	<p @click="logout">退出</p>
						        </el-dropdown-item>
						    </el-dropdown-menu>
						</el-dropdown>
					</li>
				</ul>
			</header>
  		</div>
  	</div>
</template>

<script>
export default {
    name: 'Header',
    data () {
    	return {
        
    	}
  	},
  	methods:{
	  	logout () {
	        this.$store.dispatch('logout').then(() => {
	            this.$router.replace('/login')
	        })
	    },
  	},
    computed: {
        user () {
            return this.$store.state.user;
        }
    },
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
</style>
