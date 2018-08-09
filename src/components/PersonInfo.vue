<template>
    <div id="PersonInfo">
        <v-header></v-header>
        <p class="navTxt">
            作者信息
            <span class="returnList">
            <router-link :to="{path:'/booklist'}">返回我的作品</router-link></span>
            <i class="icon-back"></i>
        </p>
        <div class="person">
            <el-form status-icon ref="personForm" :model="person" :rules="rules" label-width="80px" label-position="right"> 
                <h3>作者信息</h3>
                <el-form-item label="用户名" prop="username">
                     <el-input type="text" v-model="person.username"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="person.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="电话" prop="phonenumber">
                    <el-input type="text" v-model="person.phonenumber" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="name">
                    <el-input type="text" v-model="person.name"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" prop="idcard">
                    <el-input type="text" v-model="person.idcard"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input type="text" v-model="person.address"></el-input>
                </el-form-item>
                <el-form-item> 
                    <el-button type="success" class="registerBtn" @click="editData">更新</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import Config from '../config.js'
    import Header from './common/Header.vue'
    export default {
        name: 'PersonInfo',
        components: {
            'v-header': Header
        },
        methods: {
            requestData(){
                this.$axios.post(this.basic_url+"/api/user/detail",{
                    userid: this.userid
                }).then((res) => {
                    if(res.data.code==1){
                        Object.assign(this.person,res.data.user);
                    }else{
                        this.$message({
                            type: 'error',
                            message: '网络错误，请重试',
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
            },
            editData(){
                this.$refs.personForm.validate((valid) => {
                    if (valid) {
                        this.$axios.post(this.basic_url+"/api/user/edit",this.person).then((res) => {
                            if(res.data.code=1){
                                this.$message({
                                    type: 'success',
                                    message: "修改成功",
                                    showClose: true
                                })
                                this.requestData();
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: res.data.message,
                                    showClose: true
                                })
                            }
                        }).catch((err) => {
                            
                        })
                    }
                    else {
                        return false;
                    }
                })


                
            }
        },
        data () {
            var validatePass1 = (rule, value, callback) => {
                var regName =/^[\u4e00-\u9fa5]{2,4}$/; 
                if (value === '') {
                    callback(new Error('必填'));
                } else if (!regName.test(this.person.name)) {
                    callback(new Error('真实姓名填写有误'));
                } else {
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
                if (value === '') {
                    callback(new Error('必填'));
                } else if (!regIdNo.test(this.person.idcard)) {
                    callback(new Error('身份证号填写有误'));
                } else {
                    callback();
                }
            };

            return {
                userid: 0,
                person: {
                    username: '',
                    sex: '',
                    phonenumber: '',
                    name: '',
                    idcard: '',
                    address: '',
                    uid: 0
                },
                basic_url: Config.api,

                rules:{
                    name:[
                        {
                            required: true,
                            validator: validatePass1,
                            trigger: 'blur',
                        }
                    ],
                    idcard:[
                        {
                            required: true,
                            validator: validatePass2,
                            trigger: 'blur',
                        }
                    ]
                }
            }        
        },
        mounted(){
            this.userid = sessionStorage.getItem('userid');
            this.requestData();
        }
    }
</script>
<style scoped>
.person{
    width: 420px;
    margin: 0 auto;
    margin-top: 40px;
}
.person h3{
    height: 40px;
    line-height: 40px;
    font-size: 24px;
    text-align: center;
    margin-bottom: 30px;
}
.person button{
    float: right;
    padding-left: 60px;
    padding-right: 60px;
}

.navTxt{
    height: 56px;
    line-height: 65px;
    padding: 0px 100px;
    background:rgba(243,246,250,1);
    font-size: 18px;
    color:rgba(170,178,192,1);
    text-align: left;
}
.navTxt button{
    float: right;
    margin-top: 10px;
}
.navTxt i{
    width: 13px;
    height: 13px;
    float: right;
    margin-top: 23px;
    color: #00BAFC;
    margin-right: 10px;
    cursor: pointer;
}
.returnList{
    display: block;
    float: right;
}
.returnList a{
    color: #00BAFC;
    font-size: 13px;
    cursor: pointer;
}
</style>
