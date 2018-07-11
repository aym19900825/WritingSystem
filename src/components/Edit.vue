<template>
    <div id="bookInfo">
        <v-header></v-header>
        <p class="navTxt">
            写新章节
            <span class="returnList">
            <router-link :to="{path:'/booklist'}">返回我的作品</router-link></span>
            <i class="icon-back"></i>
        </p>
        <el-row :gutter="20" class="tit">
          <el-row>
            <span>{{bookname}}</span>
            <el-button type="primary" plain size="small" @click="readDirect">查看目录</el-button>
            <el-button type="success" plain style="margin-left: 20px;" size="small" @click="readRelation">查看作品图谱</el-button>
          </el-row>
          <el-row>
            <el-button type="success" class="newChapter" @click="add">写新章节</el-button>
          </el-row>
          <el-row class="chaptername">
            <el-col :span="4" class="chaperTit">
              <span>第</span>
              <el-input style="width: 50%;display: block;float: left;" v-model="chapternumber"></el-input>
              <span>章：</span>
            </el-col>
            <el-col :span="20">
              <el-input placeholder="请输入章节名称" v-model="chaptername"></el-input>
            </el-col>
          </el-row>
          <el-row class="chapterContent">
            <el-col :span="6" style="position: relative;">
              <p>章节大纲</p>
              <textarea id="contentTip" placeholder="添写章节大纲后，点击【人工智能生成】按钮，即可生成章节正文，如不满意，可继续点击。" v-model="chapterabstract"></textarea>
              <div class="line"></div>
            </el-col>
            <el-col :span="18">
              <p style="width: 50%;display: block;float: left;">章节正文</p>
              <el-button type="success" class="aibtn" @click="autoCreat">人工智能生成</el-button>
              <textarea id="content" placeholder="请填写内容" v-model="chaptercontent"></textarea>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="history-box" style="margin-left: 10px;">
            <el-col :span="12" :offset="10">
                <el-button type="info" @click="newContent">重写</el-button>
                <el-button type="primary" style="padding-left: 60px;padding-right: 60px;margin-top: 20px;" @click="updateSave">保存</el-button>
            </el-col>
          </el-row>
          <div class="history">
              <el-button type="warning" @click="finishSave" v-if="conntentVer.length>0">清空版本</el-button>
              <div v-for="(item,key) in conntentVer">
                <span class="point"></span>
                <h6>历史版本{{key+1}}</h6>
                <div>
                    {{item}}
                </div>
              </div>
          </div>
        </el-row>
    </div>
</template>

<script>
import Header from './common/Header.vue'
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

            autoContent: "夕阳西下，彩霞满天。何以琛站在十楼办公室的落地窗前，奇怪自己怎么会有了欣赏夕阳的心情。也许，因为她回来了。美婷推开门，就看到何律师背对着她站在窗前，手里夹着烟，一身落寞的样子……落寞？美婷简直怀疑自己的眼睛了，这个词能用在从来都是自信沉着的何律师身上吗？以琛听到开门声，转过身问：“什么事？”“哦。”美婷这才从自己的迷思中惊醒，快速地说，“何律师，红远公司的张副总来了。“请他进来。”以琛收起杂乱的思绪，全身心地投入到工作中去。瞥了一眼壁上的钟——五点，她还没来。好不容易送走了张副总，以琛疲惫地靠在椅子上闭目养神，猛的一只巨掌拍下来，以琛无奈地睁开眼：“老袁。”",

            chaptername: '',
            chapterabstract: '',
            conntentVer: [],
            chaptercontent: ''
        }
    },
    methods: {
      readRelation(){
        this.$router.push({
            path: '/d3show', 
            query: { 
                bookid: this.bookid,
                bookname: this.bookname
            }
        })
      },
      readDirect(){
        this.$router.push({
            path: '/bookdirectory', 
            query: { 
                bookid: this.bookid,
                bookname: this.bookname
            }
        })
      },
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
        this.$axios.post('http://203.93.173.179:8888/api/work/save',{
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
        this.$axios.post('http://203.93.173.179:8888/api/chapter/count',{
          "bookid": this.bookid,
        } ).then((res) => {
            this.eid='';
            this.chapternumber = res.data.next_chapter;
            this.chaptername = "";
            this.chapterabstract = "";
            this.chaptercontent = "";
            // tinyMCE.editors[0].setContent(this.chaptercontent);
            this.conntentVer = [];
            this.setTimeSave();
            this.currentEidSave();
        }).catch((err) => {
            
        })
      },
      addChapter(successMsg,erroMsg){
          var chapterversion = {};
          var versionName = "";
          // this.chaptercontent = tinyMCE.editors[0].getContent();
          for(var i=0;i<this.conntentVer.length;i++){
            versionName = "v"+eval(i+1);
            chapterversion[versionName] = this.conntentVer[i];
          }
          this.$axios.post('http://203.93.173.179:8888/api/chapter/add',{
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
        // this.chaptercontent = tinyMCE.editors[0].getContent();
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
        this.$axios.post('http://203.93.173.179:8888/api/chapter/edit',parma).then((res) => {
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
        this.$axios.post('http://203.93.173.179:8888/api/chapter/edit',parma).then((res) => {
            if(res.data.code==1) {
              this.isFinish = true;
              this.conntentVer = [];
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
        this.chaptercontent = this.autoContent;
        // tinyMCE.editors[0].setContent(this.autoContent);
      },
      changeBook(){
        this.$router.replace('/booklist');
      },
      d3show(){
        this.$router.replace('/d3show');
      },
      newContent(){
        var newContent = this.chaptercontent; 
        this.chaptercontent = this.autoContent;
        Vue.set(this.conntentVer,this.conntentVer.length, newContent);
        this.chaptercontent = '';
        // tinyMCE.editors[0].setContent("");
      }
    },
    computed: {
         user () {
            return this.$store.state.user;
          }
    },
    components: {
        'v-header': Header
    },
    mounted(){
      this.getParams();
      var preUrl = sessionStorage.getItem('url');
      if(preUrl=='login'){
        this.$axios.post('http://203.93.173.179:8888/api/work/detail',{
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
            // tinyMCE.editors[0].setContent(this.chaptercontent);
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
        this.$axios.post('http://203.93.173.179:8888/api/chapter/count',{
          "bookid": this.bookid,
        } ).then((res) => {
            this.chapternumber = res.data.next_chapter;
            this.setTimeSave();
        }).catch((err) => {
            
        })
      }

      if(preUrl=='bookdirectory'){
        this.$axios.post('http://203.93.173.179:8888/api/chapter/detail',{
          "eid": this.eid,
        } ).then((res) => {
          this.chaptername = res.data.chaptername;
          this.chapterabstract = res.data.chapterabstract;
          this.chaptercontent = res.data.chaptercontent;
          this.chapternumber = res.data.chapternumber;
          // tinyMCE.editors[0].setContent(this.chaptercontent);
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
.tit{
  padding: 0px 100px;
  margin-top: 30px;
  box-sizing: border-box;
}
.tit span{
  font-size: 24px;
  color: rgba(55,57,76,1);
  margin-right: 10px;
  display: block;
  float: left;
}
.newChapter{
  float: right;
  margin-bottom: 20px;
}
.chaperTit span,.chaperTit input{
  display: block;
  float: left;
}
.chaperTit span{
  font-size: 16px;
  height: 30px;
  line-height: 42px;
  padding-left: 5px;
  padding-right: 5px;
}
.chapterContent{
  margin-top: 20px;
}
.chapterContent p{
  text-align: left;
  height:40px;
  font-size:13px;
  color:rgba(151,163,180,1);
  line-height:60px;
  margin-bottom: 10px;
}
.chapterContent textarea{
  width: 100%;
  height: 625px;
  padding: 8px;
  box-sizing: border-box;
}
.aibtn{
  float:right;
}
#contentTip{
  margin-right: 15px;
  padding-right: 17px;
}
.line{
  position: absolute;
  right: 0px;
  top: 50px;
  width:13px;
  height:623px;
  background:linear-gradient(90deg,rgba(242,244,246,1),rgba(225,229,233,1));
  border:1px solid rgba(225,229,233,1);
}
.history{
  margin-left: 10px;
  border-left: 1px solid #ccc;
}
.history button{
  margin-left: 20px;
  margin-bottom: 20px;
}
.history-box{
  margin-left: 10px;
  border-left: 1px solid #ccc;
}
.history h6{
  height:22px;
  font-size:13px;
  color:rgba(0,34,87,1);
  line-height:22px;
  padding-left: 20px;
}
.history div div{
  margin-left: 20px;
  padding:15px;
  background:rgba(243,246,250,1);
  border-radius:4px;
  margin-top: 10px;
  margin-bottom: 30px
}
.history .point{
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #0064FF;
  display: block;
  float: left;   
  margin-left: -7px;
  margin-top: 4px;
}
</style>

