<template>
    <div id="bookInfo">
        <v-header></v-header>
        <p class="navTxt">
        	创建作品
            <span class="returnList"><router-link to="/regiser">返回</router-link></span>
        </p>
        <div class="infoContent">
            <h2>完善作品信息</h2>
            <el-form :model="newBook" :rules="rules" ref="bookinfoForm"  :label-position="top">
                <el-form-item label="作品名称" prop="bookname" style="width: 48%;float: left;">
                    <el-input v-model="newBook.bookname" auto-complete="off" placeholder="15字内，请勿添加特殊符号"></el-input>
                </el-form-item>
                <el-form-item label="作品体裁" label-position="top" prop="category" style="width: 48%;float: right;">
                     <el-input v-model="newBook.category" auto-complete="off" placeholder="15字内，请勿添加特殊符号"></el-input>
                </el-form-item>
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
            <el-dialog  width="30%"  title="创建成功" :visible.sync="innerVisible" :before-close="handleClose" append-to-body>
                <P class="congratulation">恭喜您！创建成功！</P>
                <el-button @click="returnList"  type="text">返回图书列表</el-button>
            </el-dialog>
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
    return {
        bookid: '',
	    newBook: {
            bookname: '',
            category: '',
            label: '',
            abstract: '',
            writing: '',
        },
    }
  },
  methods:{
  	editBook(){
        this.$axios.post('http://192.168.1.168:8888/api/editBook',{
            bookid: this.upDateBookId,
            bookname: this.newBook.bookname,
            category: this.newBook.category,
            label: this.newBook.label,
            abstract: this.newBook.abstract,
            writing: this.newBook.writing,
            bookstatus: 0
        }).then((res)=>{
            if(res.data.code==1){
                this.$message({
                  type: 'success',
                  message: '修改成功',
                  showClose: true
                }) 
                this.initBookList();
                this.reset();
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
        this.$axios.post('http://192.168.1.168:8888/api/addBook',{
            bookname: this.newBook.bookname,
            category: this.newBook.category,
            label: this.newBook.label,
            abstract: this.newBook.abstract,
            writing: this.newBook.writing,
            userid: this.user.userid
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
        this.bookid = this.$route.query.bookid;
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
</style>
