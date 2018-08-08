<template>
    <div id="bookInfo">
        <v-header></v-header>
        <p class="navTxt">
            写新场次
            <span class="returnList">
            <router-link :to="{path:'/booklist'}">返回我的作品</router-link></span>
            <i class="icon-back"></i>
        </p>
        <div class="tit">
          <el-row>
            <span>{{bookname}}</span>
            <el-button type="primary" plain size="small" @click="readDirect">查看剧集</el-button>
             <el-button type="primary" plain size="small" @click="readDirSon">查看场次</el-button>
            <el-button type="success" plain style="margin-left: 20px;" size="small" @click="readRelation">查看作品图谱</el-button>
          </el-row>
          <el-row>
            <el-button type="success" class="newChapter" @click="add">写新场次</el-button>
          </el-row>
          <el-row class="chaptername">
            <el-col :span="4" class="chaperTit">
              <span>第</span>
              <el-input style="width: 50%;display: block;float: left;" v-model="chapternumber"></el-input>
              <span>场：</span>
            </el-col>
            <el-col :span="16">
              <el-input placeholder="请输入场次名称" v-model="chaptername"></el-input>
            </el-col>
            <el-col :span="4">
              <el-select  placeholder="请选择集" v-model="selepisodeid" v-if="episodeList.length>0">
                  <el-option v-for="item in episodeList" :label="'第'+item.episodenumber+'集'" :value="item.episodeid"></el-option>
                  <p @click="showAddEpisode" style="background:#67c23a;color:#fff; line-height: 34px;
    padding-left: 20px;">新建集</p>
              </el-select>
              <el-button type="success" class="newChapter" @click="showAddEpisode" v-if="episodeList.length==0">新建集</el-button>
            </el-col>
          </el-row>
          <el-row class="chaptername" style="margin-top: 20px;">
             <el-col :span="3" class="chaperTit">
                <span>场次人物：</span>
             </el-col>
              <el-col :span="21">
                <el-input placeholder="请输入场次人物" v-model="charactersetting"></el-input>
              </el-col>
          </el-row>
          <el-row class="chapterContent">
            <el-col :span="6" style="position: relative;">
              <p>场次大纲</p>
              <textarea id="contentTip" placeholder="添写场次大纲后，点击【人工智能生成】按钮，即可生成章节正文，如不满意，可继续点击。" v-model="chapterabstract"></textarea>
              <div class="line"></div>
            </el-col>
            <el-col :span="18">
              <p style="width: 50%;display: block;">场次正文</p>
              <el-button type="success" class="aibtn" @click="submitDialog">人工智能生成</el-button>
              <editor class="editor" :value="chaptercontent"  :setting="editorSetting" @input="(chaptercontent)=> chaptercontent = chaptercontent"></editor>
              <!--<textarea id="content" placeholder="请填写内容" v-model="chaptercontent"></textarea>-->
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

        <el-dialog title="集信息" :visible.sync="episodeDialogVisible" width="35%" id="episodeDialog" :before-close="resetEpisode">
            <el-form ref="form" :model="newEpisode" label-width="80px" label-position="top" style="border-top:1px solid rgba(233,235,242,1);">
                <el-form-item label="序列号" prop="episodenumber">
                     <el-input  v-model="newEpisode.episodenumber"></el-input>
                 </el-form-item>
                <el-form-item label="名称" prop="episodename">
                    <el-input v-model="newEpisode.episodename"  placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item class="btnGrounp">
                    <el-button type="primary" @click="addEpisode">添加</el-button>
                    <el-button @click="resetEpisode" type="info">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import Header from './common/Header.vue'
import Vue from 'vue'
import Qs from 'qs'
import Config from '../config.js'

import Editor from './Tinymce.vue'
export default{
    data(){
        return {
            editorSetting:{
                language:'../../static/tinymce/zh_CN.js',
                height:553,
                menubar: false,
                toolbar: 'formatselect | bold italic backcolor  | alignleft aligncenter alignright'
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

            timeQuery: null,

            episodeList: [],

            selepisodeid: '请选择集',

            charactersetting: "",

            newEpisode:{
              episodenumber:"",
              episodename:""
            },
            episodeDialogVisible: false,

            userid:0
        }
    },
    methods: {
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

      readDirSon(){
        this.$router.push({
            path: '/bookdir', 
            name: 'BookDir',
            query: { 
                bookid: this.bookid,
                episodeid: this.selepisodeid,
                bookname: this.bookname
            }
        })

      },

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
        console.log(e.data);
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
        if(this.chapterabstract==""){
          this.$message({
            type: 'error',
            message: "故事大纲必填",
            showClose: true
          })  
        }else{
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
                  url:"http://203.93.173.180:8868/speak",
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
        }
       
      },

      getParams () {
        let isNew = this.$route.query.isNew;
        let bookid = this.$route.query.bookid;
        let eid = this.$route.query.eid;
        let bookname = this.$route.query.bookname;
        let episodeid = this.$route.query.episodeid;
        this.isNew = isNew;
        this.bookid = bookid;
        this.bookname = bookname;
        this.eid = eid;
        this.episodeid = episodeid;
      },
      getDirList(){
        var url = this.basic_url + '/api/episode/list';
        this.$axios.post(url,{
            bookid: this.bookid,
            page_index: 1,
            page_size: 50
        }).then((res)=>{
            if(res.data.total > 0){
                this.episodeList = res.data.episodes;
            }
        }).catch((err)=>{
            
        })
      },
      readDirect(){
        this.$router.push({
            path: '/bookrootdir', 
            query: { 
                bookid: this.bookid,
                bookname: this.bookname
            }
        })
      },
      updateSave(){
        this.updateChapter("更新成功","更新失败",true);
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
          "scenename": this.chaptername,
          "scenecontent": this.chaptercontent,
          "bookid": this.bookid,
          "sceneversion": chapterversion,
          "charactersetting": this.charactersetting,
          "scenenumber": this.chapternumber,
          "bookname": this.bookname,
          "episodeid": this.selepisodeid,
          "eid": this.eid,
          "sceneabstract": this.chapterabstract
        }
        var url = this.basic_url+'/api/scene/edit';
        this.$axios.post(url,parma).then((res) => {
            if(res.data.code==1) {
              if(isShowMsg){
                this.$message({
                  type: 'success',
                  message: "保存成功",
                  showClose: true
                })  
              }
              console.log(successMsg);
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
      delHistory(key){
        this.conntentVer.splice(key,1);
        this.updateChapter();
      },
      newContent(){
        var newContent = tinyMCE.editors[0].getContent(); 
        Vue.set(this.conntentVer,this.conntentVer.length, newContent);
        this.chaptercontent = '';
        tinyMCE.editors[0].setContent("");
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
      finishSave(){
        var parma = { 
          "scenename": this.chaptername,
          "scenecontent": this.chaptercontent,
          "bookid": this.bookid,
          "sceneversion": {},
          "charactersetting": this.charactersetting,
          "scenenumber": this.chapternumber,
          "bookname": this.bookname,
          "episodeid": this.selepisodeid,
          "eid": this.eid
        }
        var url = this.basic_url+'/api/scene/edit';
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
      addChapter(successMsg,erroMsg){
          var chapterversion = {};
          var versionName = "";
          this.chaptercontent = tinyMCE.editors[0].getContent();
          for(var i=0;i<this.conntentVer.length;i++){
            versionName = "v"+eval(i+1);
            chapterversion[versionName] = this.conntentVer[i];
          }
          var url =this.basic_url + '/api/scene/add';

          var parma = { 
            "scenename": this.chaptername,
            "scenecontent": this.chaptercontent,
            "bookid": this.bookid,
            "scenenumber": this.chapternumber,
            "bookname": this.bookname,
            "episodeid": 0,
            "sceneabstract": this.chapterabstract,
            "sceneversion":{},
            "charactersetting": ""
          }
          
          this.$axios.post(url,parma).then((res) => {
              if(res.data.code==1) {
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
       showAddEpisode(){
          var url = this.basic_url + '/api/episode/count';
          this.$axios.post(url,{
              "bookid": this.bookid
          }).then((res) => {
              if(res.data.code == 1){
                   this.newEpisode.episodenumber = res.data.next_episode;
              }
              this.episodeDialogVisible = true;
          }).catch((err) => {
              this.$message({
                  type: 'error',
                  message: '网络错误，请重试',
                  showClose: true
              })
          })

      },

      timeInterval(){
        var _this = this;
        this.timeQuery = setInterval(()=>{
           _this.updateChapter("更新成功","更新失败",false);
           console.log("自动保存");
        },600000);
      },

      addEpisode(){
          var url = this.basic_url + '/api/episode/add';
          this.$axios.post(url,{
              "episodename": this.newEpisode.episodename,
              "episodenumber": this.newEpisode.episodenumber,
              "bookid": this.bookid
          }).then((res) => {
              if(res.data.code != 1){
                  this.$message({
                      type: 'error',
                      message: '新增失败',
                      showClose: true
                  })
              }
              this.resetEpisode();
              this.getDirList();
          }).catch((err) => {
              this.$message({
                  type: 'error',
                  message: '网络错误，请重试',
                  showClose: true
              })
          })
      },
      resetEpisode(){
          this.episodeDialogVisible = false;
          this.newEpisode = {
              episodenumber: 1,
              episodename: ""
          };
      },

      readRelation(){
        this.$router.push({
            path: '/d3show', 
            query: { 
                bookid: this.bookid,
                bookname: this.bookname
            }
        })
      },
      add(){
        this.isFinish = false;

        var url = this.basic_url+'/api/scene/count';
        this.$axios.post(url,{
          "bookid": this.bookid,
          "episodeid": this.selepisodeid?this.selepisodeid:0
        } ).then((res) => {
            this.eid='';
            this.chapternumber = res.data.next_scene;
            this.charactersetting = "";
            this.chaptername = "";
            this.chapterabstract = "";
            this.chaptercontent = "";
            tinyMCE.editors[0].setContent(this.chaptercontent);
            this.conntentVer = [];

            this.addChapter("新增成功","新增失败");
        }).catch((err) => {
            
        })
      },
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
      this.getParams();

      this.userid = sessionStorage.getItem('userid')
      
      var preUrl = sessionStorage.getItem('url');
      var url = this.basic_url + '/api/work/detail';

      this.episodeid?this.selepisodeid = this.episodeid:this.selepisodeid=0;
      
      var url = this.basic_url + '/api/work/detail';
      if(preUrl=='login'){
        this.$axios.post(url,{
          "userid": this.userid,
        } ).then((res) => {
            if(res.data.code==1){
                var data = res.data.chapter;
                this.bookid = data.bookid;
                this.bookname = data.bookname;
                this.eid = res.data.eid;
                this.chaptername = data.scenename;
                this.chapterabstract = data.sceneabstract;
                this.chaptercontent = data.scenecontent;
                this.chapternumber = data.scenenumber;
                this.charactersetting = data.charactersetting;
                this.selepisodeid = data.episodeid;
                tinyMCE.editors[0].setContent(this.chaptercontent);

                var jsonObj = eval('(' + data.sceneversion + ')');
                var arr = []
                for (var i in jsonObj) {
                    arr.push(jsonObj[i]); //属性
                }

                this.conntentVer = arr;
                this.getDirList();
                this.currentEidSave();
            }else{
                this.$router.replace({ path: '/booklist' })
            }
        }).catch((err) => {
            
        })
      };


      if(preUrl=='booklist'){
        this.$axios.post(this.basic_url+'/api/scene/count',{
          "bookid": this.bookid,
          "episodeid": this.episodeid?this.episodeid:0
        }).then((res) => {
          this.chapternumber = res.data.next_scene;
          this.getDirList();
          this.addChapter("新增成功","新增失败");
        }).catch((err) => {
            
        })
      }

      if(preUrl=='bookdirectory'){
        this.$axios.post(this.basic_url+'/api/scene/deatil',{
          "eid": this.eid,
        } ).then((res) => {
          var data = res.data;
          this.bookid = data.bookid;
          this.bookname = data.bookname;
          this.chaptername = data.scenename;
          this.chapterabstract = data.sceneabstract;
          this.chaptercontent = data.scenecontent;
          this.chapternumber = data.scenenumber;
          this.charactersetting = data.charactersetting;
          this.selepisodeid = data.episodeid;
          tinyMCE.editors[0].setContent(this.chaptercontent);

          var jsonObj = eval('(' + data.sceneversion + ')');
          var arr = []
          for (var i in jsonObj) {
              arr.push(jsonObj[i]); //属性
          }

          this.conntentVer = arr;
          this.getDirList();
          this.currentEidSave();

        }).catch((err) => {
            
        })
      }

      this.timeInterval();
      
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
</style>

