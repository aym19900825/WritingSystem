<template>
    <div class="app-container">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" v-show="isMenuShow">
        <el-menu-item index="1">人物速本</el-menu-item>
        <el-menu-item index="2">事件速本</el-menu-item>
        <el-menu-item index="3">小说人物速本</el-menu-item>
        <el-menu-item index="4">小说事件图谱</el-menu-item>
        <el-menu-item index="4">查看目录</el-menu-item>
        <el-menu-item index="5">
          <router-link to="/">切换图书</router-link> 
        </el-menu-item>
      </el-menu>
      <el-row :gutter="20">
        <el-col :span="8">
          <label>第一章：</label>
          <input type="text" class="titInput" v-model="tit" readOnly @click="editTit" v-on:blur.lazy="titSave"/>
        </el-col>
        <el-col :span="16">
          <el-button type="primary" plain class="left" size="small">人物速本</el-button>
          <el-button type="primary" plain class="left" size="small">事件速本</el-button>
          <el-button type="primary" plain class="left" size="small">小说人物速本</el-button>
          <el-button type="primary" plain class="left" size="small">小说事件图谱</el-button>
          <el-button type="primary" plain class="left" size="small">查看目录</el-button>
          <el-button type="primary" plain class="left" size="small" @click="changeBook">切换图书</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">
          <span class="tip">内容摘要：</span>
          <textarea name="content" rows="35" class="input_textarea" id="contentTip" readonly v-on:dblclick="editContent" v-on:blur.lazy="tipSave" v-model="contentTip"></textarea>
        </el-col>
        <el-col :span="20">
          <el-button size="medium" class="bigBtn">+</el-button>
          <tinymce id="d2" v-model="data" :other_options="options1" class="tinyBtm"></tinymce>
          <div class="txtBlock">这篇是纯分析贴，分以琛和默笙两个角色各自进入内心的独白，分集详解。
              何以电视剧我已经看了不下20遍了，各种独白番外不知道看了多少，有很多写得很好的，所以我也动动笔啦。若有分析不到位处欢迎补充哦～～BTW学生党更新速度略慢，估计等到暑假速度会飙起来，希望大家经常进来看看，别沉啊～         本人乃是良民，有的时候截图大多是小哇的，别介意啊并不影响分析的好了话不多说，放图镇楼。
              这篇是纯分析贴，分以琛和默笙两个角色各自进入内心的独白，分集详解。
              何以电视剧我已经看了不下20遍了，各种独白番外不知道看了多少，有很多写得很好的，所以我也动动笔啦。若有分析不到位处欢迎补充哦～～BTW学生党更新速度略慢，估计等到暑假速度会飙起来，希望大家经常进来看看，别沉啊～         本人乃是良民，有的时候截图大多是小哇的，别介意啊并不影响分析的好了话不多说，放图镇楼。
          </div>
          <div class="txtBlock">这篇是纯分析贴，分以琛和默笙两个角色各自进入内心的独白，分集详解。
              何以电视剧我已经看了不下20遍了，各种独白番外不知道看了多少，有很多写得很好的，所以我也动动笔啦。若有分析不到位处欢迎补充哦～～BTW学生党更新速度略慢，估计等到暑假速度会飙起来，希望大家经常进来看看，别沉啊～         本人乃是良民，有的时候截图大多是小哇的，别介意啊并不影响分析的好了话不多说，放图镇楼。
              这篇是纯分析贴，分以琛和默笙两个角色各自进入内心的独白，分集详解。
              何以电视剧我已经看了不下20遍了，各种独白番外不知道看了多少，有很多写得很好的，所以我也动动笔啦。若有分析不到位处欢迎补充哦～～BTW学生党更新速度略慢，估计等到暑假速度会飙起来，希望大家经常进来看看，别沉啊～         本人乃是良民，有的时候截图大多是小哇的，别介意啊并不影响分析的好了话不多说，放图镇楼。
          </div>
          <div class="txtBlock">这篇是纯分析贴，分以琛和默笙两个角色各自进入内心的独白，分集详解。
              何以电视剧我已经看了不下20遍了，各种独白番外不知道看了多少，有很多写得很好的，所以我也动动笔啦。若有分析不到位处欢迎补充哦～～BTW学生党更新速度略慢，估计等到暑假速度会飙起来，希望大家经常进来看看，别沉啊～         本人乃是良民，有的时候截图大多是小哇的，别介意啊并不影响分析的好了话不多说，放图镇楼。
              这篇是纯分析贴，分以琛和默笙两个角色各自进入内心的独白，分集详解。
              何以电视剧我已经看了不下20遍了，各种独白番外不知道看了多少，有很多写得很好的，所以我也动动笔啦。若有分析不到位处欢迎补充哦～～BTW学生党更新速度略慢，估计等到暑假速度会飙起来，希望大家经常进来看看，别沉啊～         本人乃是良民，有的时候截图大多是小哇的，别介意啊并不影响分析的好了话不多说，放图镇楼。
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
export default{
    data(){
        return {
            options1: {
              language_url: '../../static/tinymce/zh_CN.js',
              height: 400,
              menubar: false
            },
            options2:{
              language_url: '../../static/tinymce/zh_CN.js',
              height: 400,
              plugins: [''],
              toolbar1: '',
              toolbar2: '',
              menubar: false
          },
          isMenuShow: false,
          tit: '重逢',
          contentTip: '她，本是西凉国的九公主，集万千宠爱于一身，因为和亲踏上了中原之路。他，乃是当今的太子，一人之、人之上的储君，因为政治联姻不得已迎娶了异域公主。他有自己的宠妃，赵良娣。她有自己的生活，偷溜出宫拦惊马、打恶少、追小偷、送迷路的小孩回家，兼且喝酒、逛窑子。本来是两条永不相交的平行线。然而东宫之中权位的争夺、无端的是非、暗藏的杀机，却将她一步一步卷入其中。在一次死里逃生的大劫之后，她蓦然忆起了三年前的曾经：他与她在沙漠里相亲，他为她斩杀天亘山的白眼狼王，他和她在草原上举办了一个盛大的婚礼'
        };
    },
    methods: {
      changeBook(){
        this.$router.replace('/booklist');
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
      }
    },
    mounted(){
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
</style>

