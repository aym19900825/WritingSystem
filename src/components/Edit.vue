<template>
    <div id="bookInfo">
        <v-header></v-header>
        <p class="navTxt">
            写新章节
            <span class="returnList">
            <router-link :to="{path:'/booklist'}">返回我的作品</router-link></span>
            <i class="icon-back"></i>
        </p>
        <div class="tit">
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
              <p style="width: 50%;display: block;">章节正文</p>
              <el-button type="success" class="aibtn" @click="submitDialog">人工智能生成</el-button>
              <div @contextmenu.prevent="showMenu($event)" id="editor-mce">
                  <editor class="editor" :value="chaptercontent"  :setting="editorSetting" @input="(chaptercontent)=> chaptercontent = chaptercontent"></editor>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="history-box" style="margin-left: 10px;    padding-bottom: 20px;">
            <el-col :span="12" :offset="10">
                <el-button type="info" @click="newContent">重写</el-button>
                <el-button type="primary" style="padding-left: 60px;padding-right: 60px;margin-top: 20px;" @click="updateSave">保存</el-button>
            </el-col>
          </el-row>
          <div class="history">
              <el-button type="warning" @click="finishSave" v-if="conntentVer.length>0">清空版本</el-button>
              <div v-for="(item,key) in conntentVer">
                <span class="point"></span>
                <h6>
                  <span>历史版本{{key+1}}</span>
                  <span class="el-icon-delete del" @click="delHistory(key)"></span>
                </h6>
                <div v-html="item">
                </div>
              </div>
          </div>
        </div>
    </div>
</template>

<script>
import Header from './common/Header.vue'
import Editor from './plugin/Tinymce.vue'
import Vue from 'vue'
import Qs from 'qs'
import Config from '../config.js'

export default{
    data(){
        return {

            userid: 0,

            editorSetting:{
                height:553,
                menubar: false,
                language_url: '../../static/tinymce/zh_CN.js',
                language: 'zh_CN',
                toolbar: 'formatselect | bold italic backcolor  | alignleft aligncenter alignright | removeformat'
            },


            basic_url: Config.api,
            isAutoSave: false,
            isFinish: false,
            chapternumber: 1,
            isNew: false,
            bookid: 1,
            bookname: "",
            eid:'', 

            isMenuShow: false,

            isNewChapter: false,

            autoContent: "",

            chaptername: '',
            chapterabstract: '',
            conntentVer: [],
            chaptercontent: '',

            //人工智能生成文本
            autoTxt:{
              title: "",
              scence: "",
              topics: "",
              casting: [],
              outline: "",
              script_size: ""
            },
            dialogFormVisible: false,

            scences: [],
            state3: '',
            castingOptions: [],

            autoTxtId:"",

            websock: null,

            timeQuery: null
        }
    },
    methods: {
      threadPoxi(){  // 实际调用的方法
          const agentData = this.autoTxtId;
          if (this.websock.readyState === this.websock.OPEN) {
              console.log("已经发送"+agentData);
              this.websocketsend(agentData)
          }
          else if (this.websock.readyState === this.websock.CONNECTING) {
              let that = this;
              setTimeout(function () {
                  console.log("已经发送"+agentData);
                  that.websocketsend(agentData)
              },300);
          }
          else {
              this.initWebSocket();
              let that = this;
              setTimeout(function () {
                  console.log("已经发送"+agentData);
                  that.websocketsend(agentData)
              },500);
          }
      },
      initWebSocket(){ //初始化weosocket
          //ws地址
          const wsuri = "ws://203.93.173.180:9001";
          this.websock = new WebSocket(wsuri);
          this.websock.onmessage = this.websocketonmessage;
          this.websock.onclose = this.websocketclose;
      },
      websocketonmessage(e){ //数据接收
        this.chaptercontent += '<p>'+e.data+'</p>';
        tinyMCE.editors[0].setContent(this.chaptercontent);
      },
      websocketsend(agentData){//数据发送
        this.websock.send(agentData);
      },
      websocketclose(e){  //关闭
        console.log("connection closed (" + e.code + ")");
      },

      submitDialog(){
        var keywords = [];
        var peoples = [];

        this.$axios.post(this.basic_url+"/api/ai",{
          "bookid": this.bookid,
          "chapterabstract": this.chapterabstract
        }).then((res) => {
           keywords = res.data.keywords;
           peoples = res.data.peoples;

           var submitData = {"title": this.chaptername,"scene":  "on ship","casting": ["Rose","Jack"],"topics": keywords,"outline": this.chapterabstract,"script_size": 50};

            this.$axios({
              method:"post",
              url:"http://203.93.173.180:8878/speak",
              data:'data='+JSON.stringify(submitData)
            }).then((res)=>{
                if(res.data.code == "100"){
                  this.autoTxtId = res.data.object;

                  this.initWebSocket();
                  this.threadPoxi();
                }
                
            });

        }).catch((err) => {
            
        })
      },
     
      querySearch(queryString, cb) {
        var scences = this.scences;
        var results = queryString ? scences.filter(this.createFilter(queryString)) : scences;
        cb(results);
      },
      createFilter(queryString) {
        return (scence) => {
          return (scence.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
         this.$axios.get('http://203.93.173.180:8868/modellist').then((res) => {
            if(res.data.code=="100"){
              var sences = res.data.object.scene;
              for(var i=0;i<sences.length;i++){
                var obj = {
                  value: sences[i]
                };
                this.scences.push(JSON.parse(JSON.stringify(obj)));
              }
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
      handleSelect(item) {
        console.log(item);
      },
      handleIconClick(ev) {
        console.log(ev);
      },


      readRelation(){
        this.$router.push({
            path: '/d3show', 
            query: { 
                bookid: this.bookid,
                bookname: this.bookname,
                eid: this.eid
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
      currentEidSave(){
        var url = this.basic_url+'/api/work/save';
        this.$axios.post(url,{
            "eid": this.eid,
            "userid": this.userid
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
        var url = this.basic_url+'/api/chapter/count';
        this.$axios.post(url,{
          "bookid": this.bookid,
        } ).then((res) => {
            this.eid='';
            this.chapternumber = res.data.next_chapter;
            this.chaptername = "";
            this.chapterabstract = "";
            this.chaptercontent = "";
            tinyMCE.editors[0].setContent(this.chaptercontent);
            this.conntentVer = [];
            this.addChapter();
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
          var url =this.basic_url + '/api/chapter/add';
          this.$axios.post(url,{
              "chaptername": this.chaptername,
              "chapterabstract": this.chapterabstract,
              "chaptercontent": this.chaptercontent,
              "chapterversion": chapterversion,
              "bookid": this.bookid,
              "bookname": this.bookname,
              "chapternumber": this.chapternumber
            }).then((res) => {
               if(res.data.code==1) {
                console.log(successMsg);
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
      updateChapter(successMsg,erroMsg,isShowMsg){
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
        var url = this.basic_url+'/api/chapter/edit';
        this.$axios.post(url,parma).then((res) => {
            if(res.data.code==1) {
              if(isShowMsg){
                this.$message({
                  type: 'success',
                  message: "保存成功",
                  showClose: true
                })  
              }
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
        this.updateChapter("更新成功","更新失败",true);
        this.generateMap();
      },
      //生成图谱做准备
      generateMap(){
        var parma = {
            "eid": this.eid,
            "title": this.chaptername,
            "content": this.chaptercontent,
        }
        var url = this.basic_url+'/api/chapter_scene/graph';
        this.$axios.post(url,parma).then((res) => {
            
        }).catch((err) => {
            
        })
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
        var url = this.basic_url+'/api/chapter/edit';
        this.$axios.post(url,parma).then((res) => {
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

      timeInterval(){
        var _this = this;
        this.timeQuery = setInterval(()=>{
           _this.updateChapter("更新成功","更新失败",false);
           console.log("自动保存");
        },10000);
      },

      changeBook(){
        this.$router.replace('/booklist');
      },
      d3show(){
        this.$router.replace('/d3show');
      },
      newContent(){
        var newContent = tinyMCE.editors[0].getContent(); 
        Vue.set(this.conntentVer,this.conntentVer.length, newContent);
        this.chaptercontent = '';
        tinyMCE.editors[0].setContent("");
      },

      delHistory(key){
        this.conntentVer.splice(key,1);
        this.updateChapter();
      },

      showMenu(e){
          alert("右击事件");
          $('#myMenu').show(500); 
          return false;
      }
    },
    computed: {
        user () {
            return this.$store.state.user;
        }
    },
    components: {
        'v-header': Header,
        'editor':Editor
    },
    mounted(){
     
      //获得场景接口
      //this.loadAll();
      this.getParams();
      this.userid = sessionStorage.getItem('userid');
      var preUrl = sessionStorage.getItem('url');
      var url = this.basic_url + '/api/work/detail';
      if(preUrl=='login'){
        this.$axios.post(url,{
          "userid": this.userid,
        } ).then((res) => {
          if(res.data.code==1){
            if(res.data.category=="soapopera"){
              this.$router.push({
                  path: '/editsoap', 
              })
            }else{
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
            }
          }else{
            this.$router.replace({ path: '/booklist' })
          }
        }).catch((err) => {
            
        })
      };

      if(preUrl=='booklist'){
        this.$axios.post(this.basic_url+'/api/chapter/count',{
          "bookid": this.bookid,
        } ).then((res) => {
            this.chapternumber = res.data.next_chapter;
            this.addChapter("新增成功","新增失败");
        }).catch((err) => {
            
        })
      }

      if(preUrl=='bookdirectory'){
        this.$axios.post(this.basic_url+'/api/chapter/detail',{
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

      this.timeInterval();

      var editorCon = $("#editor-mce iframe").contentWindow;
      $(editorCon).on("click",function(){
        alert("aaaaaaaaaaa");
      });
    },
    beforeDestroy: function() { 
      clearInterval(this.timeQuery);   
      this.websocketclose();
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
  position: absolute;
  right: 0px;
  top: 0px;
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
.history h6 span:first-child{
  font-size:13px;
  color:rgba(0,34,87,1);
}
.history h6 span.del{
  cursor: pointer;
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

.el-autocomplete{
  width: 100%;
}

.el-form-item__content .el-select{
  width: 100%;
}
#myMenu{
  display: none;
  position: absolute;
}
</style>

