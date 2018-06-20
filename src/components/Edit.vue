<template>
    <div class="app-container">
        <el-row :gutter="20">
          <el-col :span="8">
            <label v-model="chapterOrder">{{chapterOrder}}</label>
            <input type="text" class="titInput" v-model="chaptername" readOnly @click="editTit" v-on:blur.lazy="titSave"/>
          </el-col>
          <el-col :span="16">
            <el-button type="primary" plain class="left" size="small">人物图谱</el-button>
            <el-button type="primary" plain class="left" size="small">事件图谱</el-button>
            <el-button type="primary" plain class="left" size="small" @click="d3show">小说人物图谱</el-button>
            <el-button type="primary" plain class="left" size="small">小说事件图谱</el-button>
            <el-button type="primary" plain class="left" size="small" @click="bookDirectory">查看目录</el-button>
            <el-button type="primary" plain class="left" size="small" @click="changeBook">切换图书</el-button>
            <el-button type="primary" plain class="left" size="small" @click="readStory">故事大纲</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">
            <span class="tip">内容摘要：</span>
            <textarea name="content" rows="35" class="input_textarea" id="contentTip" readonly v-on:dblclick="editContent" v-on:blur.lazy="tipSave" v-model="chapterabstract"></textarea>
          </el-col>
          <el-col :span="20">
            <el-button size="medium" class="bigBtn" @click="newContent">+</el-button>
            <tinymce id="d2" :other_options="options1" class="tinyBtm">
            </tinymce>
            <el-button size="medium" class="aiBtn" @click="autoCreat">人工智能生成</el-button>
            <el-button size="medium" class="newChBtn" @click="finishSave">完成</el-button>
            <el-button size="medium" class="updateChBtn" @click="updateSave">保存</el-button>
            <div v-for="item in conntentVer" v-html="item" class="txtBlock"></div>
          </el-col>
        </el-row>
    </div>
</template>

<script>
import Vue from 'vue'
export default{
    data(){
        return {
            isAutoSave: false,
            next_chapter: 1,
            isNew: false,
            bookid: 1,
            bookname: "",
            eid:'',            
            options1: {
              language_url: '../../static/tinymce/zh_CN.js',
              height: 400,
              menubar: false
            },

            isMenuShow: false,

            isNewChapter: false,

            autoContent: "<p>夕阳西下，彩霞满天。</p><p>何以琛站在十楼办公室的落地窗前，奇怪自己怎么会有了欣赏夕阳的心情。</p><p>也许，因为她回来了。</p><p>美婷推开门，就看到何律师背对着她站在窗前，手里夹着烟，一身落寞的样子……落寞？美婷简直怀疑自己的眼睛了，这个词能用在从来都是自信沉着的何律师身上吗？</p><p>以琛听到开门声，转过身问：“什么事？”</p><p>“哦。”美婷这才从自己的迷思中惊醒，快速地说，“何律师，红远公司的张副总来了。”</p><p>“请他进来。”以琛收起杂乱的思绪，全身心地投入到工作中去。瞥了一眼壁上的钟——五点，她还没来。</p><p>好不容易送走了张副总，以琛疲惫地靠在椅子上闭目养神，猛的一只巨掌拍下来，以琛无奈地睁开眼：“老袁。”</p>",
            chapterOrder: '',
            chaptername: '',
            chapterabstract: '',
            conntentVer: [],
            chaptercontent: ''
        }
    },
    methods: {
      setTimeSave(){
        var data = {};
        var self = this;
        if(this.eid==" "){
          data = self.addChapter();
          alert(data.eid);
          this.eid = data.eid;
        }else{
          data = self.updateChapter();
        }
        alert(data);
        if(data.code==1) {
            this.$message({
              type: 'success',
              message: '自动保存成功',
              showClose: true
            })                
        }else{
            this.$message({
              type: 'error',
              message: '自动保存失败',
              showClose: true
            })  
        }
      },
      finishSave(){
        this.$axios.post('/api/api/work/save',{
            "chaptername": this.chaptername,
            "chapterabstract": this.chapterabstract,
            "chaptercontent": this.chaptercontent,
            "chapterversion": "{}",
            "bookid": this.bookid,
            "eid": this.eid,
            "chapterfinish": 1
          }).then((res) => {
            if(res.data.code==1) {
                this.$message({
                  type: 'success',
                  message: '新增成功',
                  showClose: true
                })                
            }else{
                this.$message({
                  type: 'success',
                  message: '新增失败',
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
      readStory(){
        this.$router.push({
            path: '/story', 
            name: 'Story',
            query: { 
                bookid: this.bookid,
            }
        })
      },
      addChapter(){
          var chapterversion = {};
          var versionName = "";
          this.chaptercontent = tinyMCE.editors[0].getContent();
          for(var i=0;i<this.conntentVer.length;i++){
            versionName = "v"+eval(i+1);
            chapterversion[versionName] = this.conntentVer[i];
          }
          this.$axios.post('/api/api/chapter/add',{
              "chaptername": this.chaptername,
              "chapterabstract": this.chapterabstract,
              "chaptercontent": this.chaptercontent,
              "chapterversion": chapterversion,
              "chapterOrder": this.chapterOrder,
              "bookid": this.bookid
            }).then((res) => {
              return res.data;
          }).catch((err) => {
              this.$message({
                  type: 'error',
                  message: '网络错误，请重试',
                  showClose: true
              })
          })
      },
      newChapter(){
        var data = this.addChapter();
        if(data.code==1) {
            this.$message({
              type: 'success',
              message: '新增成功',
              showClose: true
            })                
        }else{
            this.$message({
              type: 'success',
              message: '新增失败',
              showClose: true
            })  
        }
      },
      updateChapter(){
        var chapterversion = {};
        var versionName = "";
        this.chaptercontent = tinyMCE.editors[0].getContent();
        for(var i=0;i<this.conntentVer.length;i++){
          versionName = "v"+eval(i+1);
          chapterversion[versionName] = this.conntentVer[i];
          console.log(i);
        }
        var parma = {
            "bookid": this.bookid,
            "eid": this.eid,
            "chaptername": this.chaptername,
            "chapterabstract": this.chapterabstract,
            "chaptercontent": this.chaptercontent,
            "chapterversion": chapterversion,
            "chapterOrder": this.chapterOrder
        }
        this.$axios.post('/api/api/chapter/edit',parma).then((res) => {
            return res.data;
        }).catch((err) => {
            this.$message({
                type: 'error',
                message: '网络错误，请重试',
                showClose: true
            })
        })
      },
      updateSave(){
        var data = this.updateChapter();
        if(data.code==1) {
            this.$message({
              type: 'success',
              message: '更新成功',
              showClose: true
            })                
        }else{
            this.$message({
              type: 'success',
              message: '更新失败',
              showClose: true
            })  
        }
      },
      currentChapterSave(){
        this.$axios.post('/api/api/work/save',{
          userid: this.user.userid,
          eid: this.eid
        }).then((res) => {
            alert(res.data);
        }).catch((err) => {
            this.$message({
                type: 'error',
                message: '网络错误，请重试',
                showClose: true
            })
        })
      },
      getParams () {
        let isNew = this.$route.query.isNew;
        let bookid = this.$route.query.bookid;
        let eid = this.$route.query.eid;
        let bookname = this.$route.query.bookname;
        this.isNew = isNew;
        this.bookid = bookid;
        this.eid = eid;
      },
      bookDirectory(){
        this.$router.push({
            path: '/bookdirectory', 
            name: 'BookDirectory',
            query: { 
                bookid: this.bookid,
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
        user(){
            return sessionStorage.getItem("user");
        }
    },
    mounted(){
      this.getParams();
      if(!this.isNew){
        this.$axios.post('/api/api/chapter/detail',{
          "eid": this.eid,
        } ).then((res) => {
          this.chaptername = res.data.chaptername;
          this.chapterabstract = res.data.chapterabstract;
          this.chaptercontent = res.data.chaptercontent;
          tinyMCE.editors[0].setContent(this.chaptercontent);
          var jsonObj = eval('(' + res.data.chapterversion + ')');
          var arr = []
          for (var i in jsonObj) {
              arr.push(jsonObj[i]); //属性
          }
          this.conntentVer = arr;
        }).catch((err) => {
            
        })
      }else{
        this.$axios.post('/api/api/chapter/count',{
          "bookid": this.bookid,
        } ).then((res) => {
            this.chapterOrder = "第"+res.data.next_chapter+"章";
            console.log(this.chapterOrder);
        }).catch((err) => {
            
        })
      }
    }
} 
</script>
<style scoped>
.app-container{
  padding-top: 0px;
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
  height: 25px;
  line-height: 25px;
  padding-left: 5px;
  padding-right: 5px;
  font-size: 14px;
}
#contentTip{
  width: 100%;
  padding-left:5px;
  padding-right:5px;
  border: 1px solid #ccc;
  padding-top: 5px;
  padding-bottom: 5px;
  text-indent: 32px;
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
input[readOnly]{
  background: transparent;
  border: none;
  color: #000;
}
.aiBtn{
    position: absolute;
    top: 420px;
    right: 30px;
    z-index: 100000;
}
.newChBtn{
    position: absolute;
    top: 420px;
    right: 180px;
    z-index: 100000;
}
.updateChBtn{
    position: absolute;
    top: 420px;
    right: 230px;
    z-index: 100000;
}
</style>

