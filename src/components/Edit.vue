<template>
    <div class="app-container">
        <el-menu class="el-menu-demo" mode="horizontal" 
            text-color="#000"  active-text-color="#409EFF">
            <el-submenu index="5">
              <template slot="title">
                <i class="el-icon-write-ren"></i>
              </template>
              <el-menu-item index="5-1" @click="logout">退出</el-menu-item>
            </el-submenu>
            <el-menu-item index="4">
              <router-link :to="{path: '/d3show'}">
                图谱
              </router-link>
            </el-menu-item>
            <el-menu-item index="3">小说图谱</el-menu-item>
            <el-menu-item index="2">
              <router-link :to="{path:'/bookdirectory',query:{bookid:bookid,bookname:bookname}}"> 查看目录
              </router-link>
            </el-menu-item>
            <el-menu-item index="1">
              <router-link :to="{path:'/booklist'}"> 
                图书列表
              </router-link>
            </el-menu-item>
        </el-menu>
        <div class="main">
          <el-row :gutter="24" style="border-bottom: 1px solid #e6e6e6;">
            <span class="bookTit">作品名称</span>
            <span class="bookname">{{bookname}}</span>
            <el-button @click="add" type="primary" size="medium " style="float:right;margin-top:5px;margin-bottom:5px;">新增章节</el-button>
          </el-row> 
          
          <el-row :gutter="24" style="border-bottom: 1px solid #e6e6e6;font-size:14px;">
              第{{this.chapternumber}}章:
              <input type="text" class="titInput" v-model="chaptername" placeholder="请输入章节名称"/>
          </el-row>

          <el-row :gutter="20" style="border-bottom: 1px solid #ccc;border-left:1px solid #ccc;">
            <el-col :span="6">
              <textarea name="content" :autosize="{minRows:1}" class="input_textarea" id="contentTip" v-model="chapterabstract" placeholder="请输入章节大纲"></textarea>
            </el-col>
            <el-col :span="18">
              <tinymce id="d2" :other_options="options1" class="tinyBtm">
              </tinymce>
              <el-button size="medium" class="aiBtn" @click="autoCreat">人工智能生成</el-button>
              <el-button size="medium" class="updateChBtn" @click="updateSave">保存</el-button>
              <el-button size="medium" class="finishBtn" @click="finishSave">完成</el-button>
              <el-button size="medium" class="resetBtn" @click="newContent">重置</el-button>
              <div v-for="item in conntentVer" v-html="item" class="txtBlock"></div>
            </el-col>
          </el-row>
        </div> 
        <el-dialog  width="30%"  title="创建成功" :visible.sync="isFinish"  append-to-body>
          <P class="congratulation">恭喜您！章节编辑完成！</P>
          <el-button @click="add"  type="text">新增章节</el-button>
          <el-button @click="returnLook"  type="text">查看本章内容</el-button>
        </el-dialog> 
    </div>
</template>

<script>
import Vue from 'vue'
export default{
    data(){
        return {
            isAutoSave: false,
            isFinish: false,
            chapternumber: 1,
            isNew: false,
            bookid: 1,
            bookname: "",
            eid:'',            
            options1: {
              language_url: '../../static/tinymce/zh_CN.js',
              height: 500,
              menubar: false
            },

            isMenuShow: false,

            isNewChapter: false,

            autoContent: "<p>夕阳西下，彩霞满天。何以琛站在十楼办公室的落地窗前，奇怪自己怎么会有了欣赏夕阳的心情。也许，因为她回来了。美婷推开门，就看到何律师背对着她站在窗前，手里夹着烟，一身落寞的样子……落寞？美婷简直怀疑自己的眼睛了，这个词能用在从来都是自信沉着的何律师身上吗？以琛听到开门声，转过身问：“什么事？”“哦。”美婷这才从自己的迷思中惊醒，快速地说，“何律师，红远公司的张副总来了。“请他进来。”以琛收起杂乱的思绪，全身心地投入到工作中去。瞥了一眼壁上的钟——五点，她还没来。好不容易送走了张副总，以琛疲惫地靠在椅子上闭目养神，猛的一只巨掌拍下来，以琛无奈地睁开眼：“老袁。”</p>",

            chaptername: '',
            chapterabstract: '',
            conntentVer: [],
            chaptercontent: ''
        }
    },
    methods: {
      logout () {
          this.$store.dispatch('logout').then(() => {
              this.$router.replace('/login')
          })
      },
      setTimeSave(){
        var data = {};
        var self = this;
        console.log(this.eid);
        if(this.eid==""||this.eid==undefined){
          data = self.addChapter("自动保存成功","自动保存失败");
        }else{
          self.updateChapter("自动保存成功","自动保存失败");
        }
       
      },
      currentEidSave(){
        this.$axios.post('http://192.168.1.168:8888/api/work/save',{
            "eid": this.eid,
            "userid": this.user.userid
          }).then((res) => {
            console.log("save sussess");
        }).catch((err) => {
            this.$message({
                type: 'error',
                message: '网络错误，请重试',
                showClose: true
            })
        })
      },
      add(){
        this.isFinish = false;
        this.$axios.post('http://192.168.1.168:8888/api/chapter/count',{
          "bookid": this.bookid,
        } ).then((res) => {
            this.eid='';
            this.chapternumber = res.data.next_chapter;
            this.chaptername = "";
            this.chapterabstract = "";
            this.chaptercontent = "";
            tinyMCE.editors[0].setContent(this.chaptercontent);
            this.conntentVer = [];
            this.setTimeSave();
            this.currentEidSave();
        }).catch((err) => {
            
        })
      },
      addChapter(successMsg,erroMsg){
          var chapterversion = {};
          var versionName = "";
          this.chaptercontent = tinyMCE.editors[0].getContent();
          for(var i=0;i<this.conntentVer.length;i++){
            versionName = "v"+eval(i+1);
            chapterversion[versionName] = this.conntentVer[i];
          }
          this.$axios.post('http://192.168.1.168:8888/api/chapter/add',{
              "chaptername": this.chaptername,
              "chapterabstract": this.chapterabstract,
              "chaptercontent": this.chaptercontent,
              "chapterversion": chapterversion,
              "bookid": this.bookid,
              "bookname": this.bookname,
              "chapternumber": this.chapternumber
            }).then((res) => {
               if(res.data.code==1) {
                this.$message({
                  type: 'success',
                  message: successMsg,
                  showClose: true
                })
                this.eid = res.data.eid;
                this.currentEidSave();
              }else{
                  this.$message({
                    type: 'error',
                    message: erroMsg,
                    showClose: true
                  })  
              }
          }).catch((err) => {
              
          })
      },
      returnLook(){
        this.conntentVer = [];
        this.isFinish = false;
      },
      newChapter(){
        this.addChapter("新增成功","新增失败");
      },
      updateChapter(successMsg,erroMsg){
        var chapterversion = {};
        var versionName = "";
        this.chaptercontent = tinyMCE.editors[0].getContent();
        for(var i=0;i<this.conntentVer.length;i++){
          versionName = "v"+eval(i+1);
          chapterversion[versionName] = this.conntentVer[i];
        }
        var parma = {
            "bookid": this.bookid,
            "bookname": this.bookname,
            "eid": this.eid,
            "chaptername": this.chaptername,
            "chapterabstract": this.chapterabstract,
            "chaptercontent": this.chaptercontent,
            "chapterversion": chapterversion,
            "chapternumber": this.chapternumber
        }
        this.$axios.post('http://192.168.1.168:8888/api/chapter/edit',parma).then((res) => {
            if(res.data.code==1) {
              this.$message({
                type: 'success',
                message: successMsg,
                showClose: true
              })                
            }else{
                this.$message({
                  type: 'error',
                  message: erroMsg,
                  showClose: true
                })  
            }
        }).catch((err) => {
            
        })
      },

      //保存
      updateSave(){
        this.updateChapter("更新成功","更新失败");
      },

      //完成保存
      finishSave(){
        var parma = {
            "bookid": this.bookid,
            "bookname": this.bookname,
            "eid": this.eid,
            "chaptername": this.chaptername,
            "chapterabstract": this.chapterabstract,
            "chaptercontent": this.chaptercontent,
            "chapterversion": {},
            "chapternumber": this.chapternumber
        }
        this.$axios.post('http://192.168.1.168:8888/api/chapter/edit',parma).then((res) => {
            if(res.data.code==1) {
              this.isFinish = true;
            }else{
                this.$message({
                  type: 'error',
                  message: erroMsg,
                  showClose: true
                })  
            }
        }).catch((err) => {
            
        })
      },
      getParams () {
        let isNew = this.$route.query.isNew;
        let bookid = this.$route.query.bookid;
        let eid = this.$route.query.eid;
        let bookname = this.$route.query.bookname;
        this.isNew = isNew;
        this.bookid = bookid;
        this.bookname = bookname;
        this.eid = eid;
      },
      bookDirectory(){
        this.$router.push({
            path: '/bookdirectory', 
            query: { 
                bookid: this.bookid,
                bookname: this.bookname,
            }
        })
      },
      autoCreat(){
        tinyMCE.editors[0].setContent(this.autoContent);
      },
      changeBook(){
        this.$router.replace('/booklist');
      },
      d3show(){
        this.$router.replace('/d3show');
      },
      editContent(){
        $("#contentTip").prop("readonly",false)
      },
      tipSave(){
        $("#contentTip").prop("readonly",true)
      },
      editTit(){
        $(".titInput").prop("readonly",false)
      },
      titSave(){
        $(".titInput").prop("readonly",true)
      },
      newContent(){
        var newContent = tinyMCE.editors[0].getContent(); 
        Vue.set(this.conntentVer,this.conntentVer.length, newContent);
        tinyMCE.editors[0].setContent("");
      }
    },
    computed: {
         user () {
            return this.$store.state.user;
          }
    },
    mounted(){
      this.getParams();
      var preUrl = sessionStorage.getItem('url');
      if(preUrl=='login'){
        this.$axios.post('http://192.168.1.168:8888/api/work/detail',{
          "userid": this.user.userid,
        } ).then((res) => {
          if(res.data.code==1){
            var data = res.data.chapter;
            this.bookid = data.bookid;
            this.bookname = data.bookname;
            this.eid = res.data.eid;
            this.chaptername = data.chaptername;
            this.chapterabstract = data.chapterabstract;
            this.chaptercontent = data.chaptercontent;
            this.chapternumber = data.chapternumber;
            tinyMCE.editors[0].setContent(this.chaptercontent);
            var jsonObj = eval('(' + data.chapterversion + ')');
            var arr = []
            for (var i in jsonObj) {
                arr.push(jsonObj[i]); //属性
            }
            this.conntentVer = arr;
            this.currentEidSave();
          }else{
            this.$router.replace({ path: '/booklist' })
          }
        }).catch((err) => {
            
        })
      };

      if(preUrl=='booklist'){
        this.$axios.post('http://192.168.1.168:8888/api/chapter/count',{
          "bookid": this.bookid,
        } ).then((res) => {
            this.chapternumber = res.data.next_chapter;
            this.setTimeSave();
        }).catch((err) => {
            
        })
      }

      if(preUrl=='bookdirectory'){
        this.$axios.post('http://192.168.1.168:8888/api/chapter/detail',{
          "eid": this.eid,
        } ).then((res) => {
          this.chaptername = res.data.chaptername;
          this.chapterabstract = res.data.chapterabstract;
          this.chaptercontent = res.data.chaptercontent;
          this.chapternumber = res.data.chapternumber;
          tinyMCE.editors[0].setContent(this.chaptercontent);
          var jsonObj = eval('(' + res.data.chapterversion + ')');
          var arr = []
          for (var i in jsonObj) {
              arr.push(jsonObj[i]); //属性
          }
          this.conntentVer = arr;
          this.currentEidSave();
        }).catch((err) => {
            
        })
      }
    },
} 
</script>
<style scoped>
.app-container{
  background: #fff;
}
.chaptetit{
  margin-bottom:5px;
  margin-top:10px;
}
h5{
  text-align:center;
}
.bigBtn{
  width: 100%;
  margin-bottom: 5px;
}
.tinyBtm{
  margin-bottom: 10px;
}
.txtBlock{
  background: #fff;
  color: #000;
  text-align: left;
  line-height: 26px;
  text-indent: 32px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left:10px;
  padding-right:10px;
  margin-bottom:10px;
  border-bottom: 2px solid #000;
}
.txtBlock p{
  text-align: left;
}
.contentTip{
  color: #000;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  height: 30px;
  text-indent: 32px;
}
.titInput{
  width: 80%;
  height: 47px;
  line-height: 47px;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 14px;
  border:none;
}
#contentTip{
  width: 100%;
  height: 560px;
  padding-left:5px;
  padding-right:5px;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 14px;
}
.tip{
  display: block;
  width: 100%;
  border: 1px solid #ccc;
  height: 35px;
  line-height: 35px;
  background: #fff;
  padding-left:5px;
  padding-right:5px;
  border-bottom: none;
  font-size: 14px;
  font-weight: bold;
}
.left{
  float: right;
}
.left:nth-child(1){
  margin-left: 10px;
}
.aiBtn{
    position: absolute;
    top: 480px;
    right: 30px;
    z-index: 100000;
}
.newChBtn{
    position: absolute;
    top: 480px;
    right: 180px;
    z-index: 100000;
}
.updateChBtn{
    position: absolute;
    top: 480px;
    right: 280px;
    z-index: 100000;
}
.resetBtn{
    position: absolute;
    top: 480px;
    right: 180px;
    z-index: 100000;
}
.header h3, p{
  text-align:left;
}
.main{
  background: #fff;
  width:85%;
  margin: 0 auto
}
label{
  padding:10px;
}
input,textarea{
  border: 1px solid #ccc;
  border-top: none;
  border-left: none;
  border-right: none;
  font-size: 14px;
}
.maintit{
  font-size:14px;
  font-weight:bold;
  height:30px;
  line-height:30px;
}
.finishBtn{
  position: absolute;
  top: 480px;
  right: 380px;
  z-index: 100000;
}
.el-menu--horizontal>.el-menu-item{
  float:right;
}
.el-menu--horizontal>.el-submenu{
  float:right;
  margin-left: 150px;
}
.el-menu--horizontal>.el-menu-item a:hover{
  color:#409EFF;
}
.bookTit,.bookname{
  display: block;
  height:47px;
  width:70px;
  float:left;
  line-height:47px;
  font-size:14px;
}
.bookTit::before{
    content: "";
    position: absolute;
    left: 70px;
    top: 20px;
    width: 36px;
    height: 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-bottom: 1px solid #e6e6e6;
    -webkit-transform: rotateZ(45deg) scale(1.414);
    transform: rotateZ(120deg) scale(1.414);
}
.bookname{
  width:300px;
  padding-left: 20px;
}
</style>

