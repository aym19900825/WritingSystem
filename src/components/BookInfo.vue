<template>
    <div id="bookInfo">
        <v-header></v-header>
        <p class="navTxt">
        	创建作品
            <span class="returnList"><router-link to="/booklist">返回</router-link></span>
            <i class="icon-back"></i>
        </p>
        <div class="infoContent">
            <h2>完善作品信息</h2>
            <el-form :model="newBook" :rules="rules" ref="bookinfoForm">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="作品名称" prop="bookname">
                            <el-input v-model="newBook.bookname" placeholder="15字内，请勿添加特殊符号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="作品体裁" prop="category">
                            <el-select v-model="newBook.category"  placeholder="请选择作品体裁">
                                <el-option label="小说" value="fiction"></el-option>
                                <el-option label="剧本" value="scripts"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="作品简介" prop="abstract">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}"  placeholder="请填写"  v-model="newBook.abstract">
                    </el-input>
                    <p class="inputTip">10~1000字</p>
                </el-form-item>
                <el-form-item label="扉页寄语" prop="writing">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}"  placeholder="希望大家喜欢这本书，并支持正版阅读！"  v-model="newBook.writing">
                    </el-input>
                    <p class="inputTip">0~500字</p>
                </el-form-item>
            </el-form>            
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addBook" v-if="bookid==''">创建作品</el-button>
                <el-button type="primary" @click="editBook" v-else>更新作品</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import Header from './common/Header.vue'
export default {
  name: 'BookInfo',
  data () {
   var validateWriting = (rule, value, callback) => {
                if(value.length >1000){
            callback(new Error('长度在 0 到 1000个字符'));
        }else {
          callback();
        }
    };
    var validateAbstract = (rule, value, callback) => {
        if(value.length <= 0){
            callback(new Error('必填'));
        }else if(value.length > 1000){
            callback(new Error('长度在 0 到 1000个字符'));
        }else{
            callback();
        }
    };
    return {
        userid: 0,
        bookid: '',
        innerVisible: false,
	    newBook: {
            bookname: '',
            category: '',
            label: '',
            abstract: '',
            writing: '',
        },
        rules:  {
            bookname:[
                {
                    required: true,
                    message: '必填信息',
                    trigger: 'blur',
                },
                { min: 1,
                  max: 15, 
                  message: '15个字符内', 
                  trigger: 'blur' 
                }
            ],
            writing:[
                {
                    validator: validateWriting, 
                    trigger: 'blur'
                }
            ],
            abstract:[
                {
                    validator: validateAbstract, 
                    trigger: 'blur'
                }
            ]

        }
    }
  },
  methods:{
  	editBook(){
        this.$axios.post('http://203.93.173.179:8888/api/editBook',{
            bookid: this.bookid,
            bookname: this.newBook.bookname,
            category: this.newBook.category,
            label: this.newBook.label,
            abstract: this.newBook.abstract,
            writing: this.newBook.writing,
            bookstatus: 0
        }).then((res)=>{
            if(res.data.code==1){
                /*
                this.$message({
                  type: 'success',
                  message: '修改成功',
                  showClose: true
                }) 
                this.initBookList();
                this.reset();
                */
                this.$router.push({
                    path: '/booklist'
                })
            }else{
                this.$message({
                  type: 'error',
                  message: '修改失败',
                  showClose: true
                }) 
            }
        }).catch((err)=>{
            
        })
    },
    addBook() {
        this.$axios.post('http://203.93.173.179:8888/api/addBook',{
            bookname: this.newBook.bookname,
            category: this.newBook.category,
            label: this.newBook.label,
            abstract: this.newBook.abstract,
            writing: this.newBook.writing,
            userid: this.userid
        }).then((res)=>{
            if(res.data.code==1){
                this.$router.push({
                    path: '/booklist'
                })
            }else{
                this.$message({
                    type: 'error',
                    message: res.data.message,
                    showClose: true
                })
            }
        }).catch((err)=>{
            
        })
        }
    },
    components: {
  	    'v-header': Header
    },
    mounted(){
        if(this.$route.query.bookid){
            this.bookid = this.$route.query.bookid;
            this.newBook = JSON.parse(JSON.stringify(this.$route.query.bookInfo));
        }else{
            console.log(this.$route.query.userid);
            this.userid = this.$route.query.userid;
        }
    }
}
</script>

<style scoped>
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
.infoContent{
    padding: 0px 100px;
}
.infoContent h2{
    font-size:27px;
    height: 100px;
    line-height: 100px;
    color:rgba(55,57,76,1);
}
p.inputTip{
    text-align: right;
    color: #AAB2C0;
    font-size:13px;
}
.dialog-footer button{
    float: right;
    width: 180px;
    height: 40px;
    margin-bottom: 40px;
}
.returnList{
    display: block;
    float: right;
}
.returnList a{
    color: #00BAFC;
    font-size: 13px;
}
.el-select{
    width: 100%;
}
</style>
