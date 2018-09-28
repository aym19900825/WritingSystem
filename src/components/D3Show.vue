<template>
    <div id="d3show">
        <v-header></v-header>
        <el-row>
            <el-col :span="16" style="position: relative;" class="main">
                <p class="navTxt">
                    <span class="tit">{{bookname}}-作品图谱</span>
                    <ul class="tabList">
                        <li @click="tabChang('first')">图谱</li>
                        <li @click="tabChang('second')">小说人物图谱</li>
                        <li @click="tabChang('third')">评论</li>
                        <li @click="tabChang('four')">章节/场次图谱</li>
                    </ul>
                    <span class="returnList" @click="returnPre">返回</span>
                    <i class="icon-back"></i>
                </p>
                <div class="tabContent">
                    <!--图谱-->
                    <div id="first">
                        <el-row>
                            <el-badge :value="cur_com_total" class="item" v-if="!!cur_com_total">
                                 <el-button size="small"  @click="curComShow">评论</el-button>
                            </el-badge>
                        </el-row>
                        <el-row>
                            <div id="chart"></div>
                        </el-row>
                        <el-row>
                            <div id="relationTxt">
                                <h4></h4>
                                <span></span>
                                <p></p>
                                <div></div>
                            </div>
                        </el-row>
                    </div>

                    <!--小说人物图谱-->
                    <div id="second" style="position: relative;">
                       <div class="noneMap" style="display: none;">
                            <p style="width:100%;font-size:24px;text-align:center;margin-top:200px;">您还没有人物图谱</p>
                       </div>
                       <div id="chapterchart" v-show="chaptereid!=''"></div>
                        <!--图谱点击的人物卡-->
                        <div class="d3PeopleInfo" v-show="peopleInfoVisible">
                            <i class="el-icon-close" @click="closePeople"></i>
                            <el-form ref="form" :model="peopleInfo" label-width="80px">
                              <el-form-item label="姓名" prop="name">
                                <el-input  v-model="peopleInfo.name" placeholder="暂无信息" :disabled="true"></el-input>
                              </el-form-item>
                              <el-form-item label="身份特征" prop="titles">
                                <el-input type="textarea" :rows="2" v-model="peopleInfo.title"  placeholder="暂无信息" :disabled="true"></el-input>
                              </el-form-item>
                              <el-form-item label="性格特点" prop="characters">
                                <el-input type="textarea" :rows="2" v-model="peopleInfo.character"  placeholder="暂无信息" :disabled="true"></el-input>
                              </el-form-item>
                            </el-form>
                        </div>
                    </div>

                    <!--评论显示区-->
                    <div id="third" style="display: none;">
                        <el-row>
                            <div class="comment">
                                <el-input placeholder="请输入搜索关键字" v-model="commentSearch" class="input-with-select" @keydown="comSearchS($event)">
                                    <el-button type="primary" slot="append" icon="el-icon-search" @click="comSearchS"></el-button>
                                </el-input>
                            </div>
                            <div class="commentContent">
                                <div class="commentResult" v-for = "item in commentList">
                                    <p v-html="item.highlight.content[0]"></p>
                                    <p>{{item._source.create_date}}</p>
                                </div>
                                <div align="right" style="margin-top: 20px;margin-bottom: 40px;">
                                    <el-pagination
                                        @size-change="handleSizeChange1"
                                        @current-change="handleCurrentChange1"
                                        :current-page="currentPage1"
                                        :page-size="pagesize1"
                                        layout="total, prev, pager, next"
                                        :total="totalCount1">
                                    </el-pagination>
                                </div>
                            </div>
                        </el-row>
                    </div>

                    
                    <div id="four" style="display: none;">
                        <div id="cur_chart"></div>
                    </div>
                </div>
                <span class="cirle icon-arrow2-right" @click="showHide" v-show="isRelation"></span>
            </el-col>
            <el-col :span="8" v-show="isSearch">
                <div class="search-div">
                    <p class="search-box">
                        <el-input placeholder="请输入搜索关键字" v-model="search" class="input-with-select" @keydown="searchEnter($event)">
                                <el-button type="primary" slot="append" icon="el-icon-search" @click="searchRelation"></el-button>
                        </el-input>
                    </p>
                    <div class="searchResult">
                        <ul>
                           <li @click="searchChart(item._source.eid,item._source.title,$event)" v-for="(item,index) in listData" :title="item._source.title" v-bind:style="{background:currentPage==1&&index==0?'#F3F6FA':'#FFFFFF'}">{{item._source.title}}</li>
                        </ul>
                    </div>
                    <div align="right">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pagesize"
                            layout="total, prev, pager, next"
                            :total="totalCount">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
            <!--本章节/场次目录显示区-->
            <el-col :span="8" v-show="isBookDir">
                <div class="search-div">
                    <p class="search-box">
                        <span>目录</span>
                        <span class="returnList" @click="returnRoot" v-show="!isRootDir&&this.bookCat == '电视剧剧本'">返回剧集</span>
                        <i class="icon-back" v-show="!isRootDir&&this.bookCat == '电视剧剧本'"></i>
                    </p>
                    <div class="searchResult" v-show="!isRootDir">
                        <ul>
                            <li  v-for="(item,index) in dirData" :title="item._source.chaptername" @click="generateMap(item._id,$event)" v-if="bookCat=='小说'" v-bind:style="{background:bookDir_currentPage==1&&index==0?'#F3F6FA':'#FFFFFF'}">
                                第{{item._source.chapternumber}}章：{{item._source.chaptername}}
                            </li>
                            <li  v-for="(item,index) in dirData" :title="item._source.chaptername" @click="generateMap(item._id,$event)" v-if="bookCat=='电视剧剧本'" v-bind:style="{background:bookDir_currentPage==1&&index==0?'#F3F6FA':'#FFFFFF'}">
                                第{{item._source.chapternumber}}场：{{item._source.chaptername}}
                            </li>
                        </ul>
                    </div>
                    <div class="searchResult" v-show="isRootDir">
                        <ul>
                            <li  v-for="item in dirRootData" :title="item.episodename" @click="sonDirClick(item.episodeid)">
                                第{{item.episodenumber}}集：{{item.episodename}}
                            </li>
                        </ul>
                    </div>
                    <div align="right">
                        <el-pagination
                            @size-change="bookDir_handleSizeChange"
                            @current-change="bookDir_handleCurrentChange"
                            :current-page="bookDir_currentPage"
                            :page-size="bookDir_pagesize"
                            layout="total, prev, pager, next"
                            :total="bookDir_totalCount">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
        </el-row>
        <!--评论样式-->
        <!--
        <div class="mask" v-show="isMask">
            <i class="el-icon-close closeMask" @click="closeMask"></i>
            <div class="cur_comment">
                <div class="commentResult" v-for = "item in cur_commentList">
                    <p>{{item._source.content}}</p>
                    <p>{{item._source.create_date}}</p>
                </div>
                <p class="loadMore" @click="loadMore" v-show="cur_commentList.length<cur_com_total">加载更多...</p>
                <p class="loadMore" v-show="cur_commentList.length>=cur_com_total">已经没有更多了</p>
            </div>
        </div>
        -->
        <el-dialog title="评论" :visible.sync="isMask">
            <div class="cur_comment">
                <div class="commentResult" v-for = "item in cur_commentList">
                    <p>{{item._source.content}}</p>
                    <p>{{item._source.create_date}}</p>
                </div>
                <p class="loadMore" @click="loadMore" v-show="cur_commentList.length<cur_com_total">加载更多...</p>
                <p class="loadMore" v-show="cur_commentList.length>=cur_com_total">已经没有更多了</p>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Config from '../config.js'
    import Header from './common/Header.vue'
    import axios  from 'axios' 
    import topNav from '@/components/common/TopNav';
    export default {
        name: 'D3Show',
        components: {
            'v-header': Header
        },
        methods: {
            closeMask(){
                this.cur_currentPage = 1;
                this.cur_commentList = [];
                this.isMask = !this.isMask;
                $('body').css({ 
                　　"overflow-y":"auto" 
                });
            },
            loadMore(){
                ++this.cur_currentPage;
                this.current_com();
            },
            curComShow(){
                this.isMask = !this.isMask;
                $('body').css({ 
                　　"overflow-y":"hidden" 
                });
                if(this.cur_commentList.length==0){
                     this.current_com();
                }
            },
            comSearchS(){
                this.currentPage1 = 1;
                this.comSearch();
            },
            comSearch(){
                var _this = this;
                var url = _this.basic_url+"/api/comment/search";
                this.$axios.post(url,{
                    "word": this.commentSearch,
                    "page_index": this.currentPage1,
                    "page_size":this.pagesize1,
                    "userid": this.userid
                }).then((res) => {
                    this.commentList = res.data.data;
                    $(".comment").css("marginTop","40px");
                    $(".comment").css("marginBottom","10px");
                    this.totalCount1 = res.data.total;
                }).catch((err) => {
                    this.$message({
                        type: 'error',
                        message: '网络错误，请重试',
                        showClose: true
                    })
                })
            },
            closePeople(){
                this.peopleInfoVisible = false;
            },
            showHide(){
                if($("#first").css("display")=="block"){
                    if(this.isSearch){
                        $(".main").width("100%");
                        $(".cirle").removeClass("icon-arrow2-right");
                        $(".cirle").addClass("icon-arrow2-left");

                        var tmpH = $(window).height()-125;
                        $(".tabContent").height(tmpH);
                    }else{
                        $(".main").width("66.66%");
                        $(".cirle").removeClass("icon-arrow2-left");
                        $(".cirle").addClass("icon-arrow2-right");
                    }
                    this.isSearch = !this.isSearch;
                }
                if($("#four").css("display")=="block"){
                    if(this.isBookDir){
                        $(".main").width("100%");
                        $(".cirle").removeClass("icon-arrow2-right");
                        $(".cirle").addClass("icon-arrow2-left");

                        var tmpH = $(window).height()-125;
                        $(".tabContent").height(tmpH);
                    }else{
                        $(".main").width("66.66%");
                        $(".cirle").removeClass("icon-arrow2-left");
                        $(".cirle").addClass("icon-arrow2-right");
                    }
                    this.isBookDir = !this.isBookDir;
                }
                
            },
            tabChang(tabname){
                if(tabname=="first"){
                    $("#first").show().siblings("div").hide();
                    $("ul.tabList li").css("background","#F3F6FA");
                    $("ul.tabList li:nth-child(1)").css("background","#fff");

                    //人物图谱样式设置
                    this.isRelation = true;
                    this.isSearch = true;
                    this.isBookDir = false;
                    $(".main").width("66.66%");
                    $(".cirle").removeClass("icon-arrow2-left");
                    $(".cirle").addClass("icon-arrow2-right");
                }
                if(tabname=="second"){
                    $("#second").show().siblings("div").hide();
                    $("ul.tabList li").css("background","#F3F6FA");
                    $("ul.tabList li:nth-child(2)").css("background","#fff");

                    //人物图谱样式设置
                    this.isRelation = false;
                    this.isSearch = false;
                    this.isBookDir = false;
                    $(".main").width("100%");

                    //首次点击人物图谱加载数据
                    if(this.chaptereid==""){
                        this.initChaptereid();
                    }
                }
                if(tabname=="third"){
                    $("#third").show().siblings("div").hide();
                    $("ul.tabList li").css("background","#F3F6FA");
                    $("ul.tabList li:nth-child(3)").css("background","#fff");

                    this.isRelation = false;
                    this.isSearch = false;
                    this.isBookDir = false;
                    $(".main").width("100%");
                }
                if(tabname=="four"){
                    $("#four").show().siblings("div").hide();
                    $("ul.tabList li").css("background","#F3F6FA");
                    $("ul.tabList li:nth-child(4)").css("background","#fff");

                    this.isRelation = true;
                    this.isSearch = false;
                    this.isBookDir = true;

                    $(".main").width("66.66%");
                    $(".cirle").removeClass("icon-arrow2-left");
                    $(".cirle").addClass("icon-arrow2-right");

                    if($("#four svg").length == 0 && this.bookCat == "小说"){
                        this.requireDir();
                    }
                    if($("#four svg").length == 0 && this.bookCat == "电视剧剧本"){
                        console.log("电视剧剧本");
                        this.requireRoot();
                    }
                }
            },
            getCat(){
                this.$axios.post(this.basic_url+"/api/bookCategory",{
                    bookid: this.bookid,
                }).then((res)=>{
                    console.log(res.data.category);
                    this.bookCat = res.data.category;
                    console.log(this.bookCat);
                }).catch((err)=>{
                    
                })
            },
            sonDirClick(episodeid){
                this.bookDir_currentPage = 1;
                this.bookDir_pagesize = 10;
                this.selEpisodeid = episodeid;
                this.requireSonDir();
            },
            requireSonDir(){
                var url = this.basic_url + '/api/scene/list';
                this.$axios.post(url,{
                    bookid: this.bookid,
                    page_index: this.bookDir_currentPage,
                    page_size: this.bookDir_pagesize,
                    episodeid: this.selEpisodeid
                }).then((res)=>{
                    if(res.data.total>0){
                        var datas = res.data.data;
                        var arr = [];
                        var obj = {
                            _id: '',
                            _source: {
                                chaptername: '',
                                chapternumber: '',
                            }
                        }
                        for(var i=0;i<datas.length;i++){
                            obj._id = datas[i]._id;
                            obj._source.chaptername = datas[i]._source.scenename;
                            obj._source.chapternumber = datas[i]._source.scenenumber;
                            arr.push( JSON.parse(JSON.stringify(obj)));
                        }
                        this.dirData = arr;
                        this.bookDir_totalCount = res.data.total;
                        this.d3Init(this.basic_url+"/api/chapter_scene/show","cur_chart",res.data.data[0]._id);
                        this.isRootDir = false;
                    }else{
                        this.$message({
                            type: 'success',
                            message: '暂无数据',
                            showClose: true
                        });
                        this.dirData = [];
                        this.bookDir_totalCount = 0;
                        this.isRootDir = false;
                    }
                }).catch((err)=>{
                    
                })
            },
            returnRoot(){
                this.bookDir_currentPage = 1;
                this.bookDir_pagesize = 10;
                this.requireRoot();
            },
            requireRoot(){
                this.$axios.post(this.basic_url+"/api/episode/list",{
                    bookid: this.bookid,
                    page_index: this.bookDir_currentPage,
                    page_size: this.bookDir_pagesize
                }).then((res)=>{
                    if(res.data.total>0){
                        this.dirRootData = res.data.episodes;
                        this.bookDir_totalCount = res.data.total;
                        this.isRootDir = true;
                    }else{
                        this.$message({
                            type: 'success',
                            message: '暂无数据',
                            showClose: true
                        })
                        this.bookDir_totalCount = 0;
                    }
                }).catch((err)=>{
                    
                })
            },
            generateMap(eid,event){
                 var thisDom = event.currentTarget;
                $(thisDom).css("background","#F3F6FA")
                          .siblings("li")
                          .css("background","#FFFFFF");
                this.d3Init(this.basic_url+"/api/chapter_scene/show","cur_chart",eid);
            },
            requireDir(){
                var url = this.basic_url + '/api/chapter/list';
                this.$axios.post(url,{
                    bookid: this.bookid,
                    page_index: this.bookDir_currentPage,
                    page_size: this.bookDir_pagesize
                }).then((res)=>{
                    if(res.data.total>0){
                       this.dirData = res.data.data;
                       this.bookDir_totalCount = res.data.total;
                       this.d3Init(this.basic_url+"/api/chapter_scene/show","cur_chart",res.data.data[0]._id);
                    }else{
                        this.$message({
                            type: 'success',
                            message: '暂无数据',
                            showClose: true
                        })
                    }
                }).catch((err)=>{
                    
                })
            },
            initChaptereid(){
                var url = this.basic_url+'/api/character/query';
                this.$axios.post(url,{
                    "bookid": this.bookid,
                } ).then((res) => {
                    if(res.data.length>0){
                        this.chaptereid = res.data[0]._id;
                        this.initchapter(this.basic_url+"/api/char_graph_search",this.chaptereid);
                    }else{
                        $(".noneMap").show();
                    }
                }).catch((err) => {
                
                })
            },
            d3Init(url,svgdom,queryParam1,queryParam2){
                var _this = this;
                var svgdom = '#'+svgdom;
                var width = $(svgdom).width();
                var height = this.d3Params.height;
                var img_w = this.d3Params.img_w;
                var img_h = this.d3Params.img_h;
                var _this = this;
                d3.select(svgdom+" svg").remove();
                var param = '';
                if(queryParam2){
                    param = JSON.stringify({search_text: queryParam1,eid:queryParam2});
                }else{
                    param = JSON.stringify({eid: queryParam1});
                }

                var svg = d3.select(svgdom).append("svg")
                                .attr("width",width)
                                .attr("height",height);

                d3.json(url,function(error,root){
                    if( error ){
                        console.log(error);
                    }

                    if(root.nodes.length==0){
                        console.log("暂无图谱");
                        _this.$message({
                            type: 'success',
                            message: '暂无图谱',
                            showClose: true
                        })
                    }
                    var force = d3.layout.force()
                                    .nodes(root.nodes)
                                    .links(root.edges)
                                    .size([width,height])
                                    .linkDistance(200)
                                    .charge(-1500)
                                    .start();

                    function drag(){//拖拽函数
                        return force.drag()
                                    .on("dragstart",function(d){
                                        d3.event.sourceEvent.stopPropagation(); //取消默认事件
                                        d.fixed = true;    //拖拽开始后设定被拖拽对象为固定
                                    });
                         
                    }
                                    
                    var edges_line = svg.selectAll("line")
                                        .data(root.edges)
                                        .enter()
                                        .append("line")
                                        .style("stroke","#ccc")
                                        .style("stroke-width",1);
                                        
                                        
                    var edges_text = svg.selectAll(".linetext")
                                        .data(root.edges)
                                        .enter()
                                        .append("text")
                                        .attr("class","linetext")
                                        .style('font-size', '12px')
                                        .text(function(d){
                                            return d.type;
                                        });
                                       
                    
                                        
                    var nodes_img = svg.selectAll("image")
                                        .data(root.nodes)
                                        .enter()
                                        .append("image")
                                        .attr("width",img_w)
                                        .attr("height",img_h)
                                        .attr("xlink:href",function(d){
                                            switch(d.image.toLowerCase())
                                                {
                                                case "person.png":
                                                  return _this.person;
                                                  break;
                                                case "event.png":
                                                  return _this.event;
                                                  break;
                                                case "organization.png":
                                                   return _this.organization;
                                                   break;
                                                case "state_or_province.png":
                                                   return _this.state_or_province;
                                                   break;
                                                case "country.png":
                                                    return _this.country;
                                                    break;
                                                case "title.png":
                                                    return _this.title;
                                                    break;
                                                case "facility.png":
                                                    return _this.facility;
                                                    break;   
                                                default:
                                                  return _this.date;
                                                }

                                        }) 
                                        .call(drag());

                    if(svgdom=="#chart"){
                        nodes_img .on("dblclick",function(d,i){
                            _this.search = d.name;
                            _this.currentPage = 1;
                            _this.pagesize = 10;
                            _this.firstLoad = true;
                            _this.requestData();
                        });
                    }
                                       
                                      
                    
                    var text_dx = -20;
                    var text_dy = 20;
                    
                    var nodes_text = svg.selectAll(".nodetext")
                                        .data(root.nodes)
                                        .enter()
                                        .append("text")
                                        .attr("class","nodetext")
                                        .attr("dx",text_dx)
                                        .attr("dy",text_dy)
                                        .style('font-size', '12px')
                                        .text(function(d){
                                            return d.name;
                                        });
                    
                                        
                    force.on("tick", function(){
                        
                        //限制结点的边界
                        root.nodes.forEach(function(d,i){
                            d.x = d.x - img_w/2 < 0     ? img_w/2 : d.x ;
                            d.x = d.x + img_w/2 > width ? width - img_w/2 : d.x ;
                            d.y = d.y - img_h/2 < 0      ? img_h/2 : d.y ;
                            d.y = d.y + img_h/2 + text_dy > height ? height - img_h/2 - text_dy : d.y ;
                        });
                    
                        //更新连接线的位置
                         edges_line.attr("x1",function(d){ return d.source.x; });
                         edges_line.attr("y1",function(d){ return d.source.y; });
                         edges_line.attr("x2",function(d){ return d.target.x; });
                         edges_line.attr("y2",function(d){ return d.target.y; });
                         
                         //更新连接线上文字的位置
                         edges_text.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; });
                         edges_text.attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });
                         
                         
                         //更新结点图片和文字
                         nodes_img.attr("x",function(d){ return d.x - img_w/2; });
                         nodes_img.attr("y",function(d){ return d.y - img_h/2; });
                         
                         nodes_text.attr("x",function(d){ return d.x });
                         nodes_text.attr("y",function(d){ return d.y + img_w/2; });
                    });
                })
                .header("Content-Type","application/json")
                .send("POST", param);
            } ,
            returnPre(){
                sessionStorage.setItem('url','login');
                this.$router.push({
                    path: '/edit', 
                    name: 'Edit',
                })
            },
            searchEnter(e){
                if(e.keyCode==13){
                    this.searchRelation();
                 }
            },
            searchChart(eid,tit,event){
                /*
                const {href} = this.$router.resolve({
                                    path: "/showrelation",
                                    query: {
                                        search: this.search,
                                        eid: eid
                                    }
                                });
                window.open(href, '_blank');
                */

                var thisDom = event.currentTarget;
                $(thisDom).css("background","#F3F6FA")
                          .siblings("li")
                          .css("background","#FFFFFF");

                this.d3Init(this.basic_url+"/api/graph_search","chart",this.search,eid);
                this.newsDetail(eid);
                this.curComTit = tit;

                this.cur_commentList = [];

                this.cur_currentPage = 1;
                this.current_com();

                $("#relationTxt h4").text("");
                $("#relationTxt span").text("");
                $("#relationTxt p").text("");
                $("#relationTxt div").text("");
            },
            current_com(){
                var _this = this;
                axios.post(_this.basic_url+"/api/comment/title",{
                    "title": this.curComTit,
                    "page_index": this.cur_currentPage,
                    "page_size": this.cur_pagesize
                }).then((res) => {
                    this.cur_com_total = res.data.total;
                    if(this.cur_commentList.length>0){
                        this.cur_commentList = this.cur_commentList.concat(res.data.data);
                    }else{
                        this.cur_commentList = res.data.data;
                    }
                }).catch((err) => {
                    this.$message({
                        type: 'error',
                        message: '网络错误，请重试',
                        showClose: true
                    })
                })
            },
            newsDetail(eid){
                var _this = this;
                axios.post(_this.basic_url+"/api/news/detail",{
                    "eid": eid
                }).then((res) => {
                    $("#relationTxt h4").text(res.data.title);
                    $("#relationTxt p").html("信息链接地址：<a href='"+res.data.url+"' target='_blank'>"+res.data.url+" </a>");
                    $("#relationTxt span").text(res.data.create_date);
                    $("#relationTxt div").text(res.data.content);

                    //设置d3show的高度
                    var txtHeight = $("#relationTxt div").height()+400+this.d3Params.height;
                    $("#d3show").height(txtHeight+"px");

                }).catch((err) => {
                    this.$message({
                        type: 'error',
                        message: '网络错误，请重试',
                        showClose: true
                    })
                })
            },
            searchRelation(){
                this.currentPage = 1;
                this.firstLoad = true;
                this.requestData();
            },
            requestData(){
                var _this = this;
                var url = _this.basic_url+"/api/search/list";
                this.$axios.post(url,{
                            search_text: this.search,
                            userid: this.userid,
                            page_index: this.currentPage,
                            page_size: this.pagesize
                }).then((res) => {
                    if(res.data.total >0){
                        this.listData = res.data.data;
                        this.totalCount = res.data.total;
                        if(_this.firstLoad){
                            _this.d3Init(_this.basic_url+"/api/graph_search","chart",this.search,this.listData[0]['_source'].eid);
                            _this.newsDetail(this.listData[0]['_source'].eid);
                            _this.curComTit = this.listData[0]['_source'].title;
                            _this.current_com();
                            _this.firstLoad = false;

                            $(".searchResult").eq(0).find("li")
                                              .eq(0).css("background","#F3F6FA")
                                              .siblings("li").css("background","#FFFFFF");
                            console.log($(".searchResult").eq(0).find("li"));
                        }
                    }else{
                        this.$message({
                            type: 'success',
                            message: '暂无数据',
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
            handleSizeChange(val) {
                this.pagesize = val;
                this.requestData();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.requestData();
            },
            bookDir_handleSizeChange(val) {
                this.bookDir_pagesize = val;
                if(this.bookCat == "小说"){
                    this.requireDir();
                }else{
                    if(this.isRootDir){
                        this.requireRoot();
                    }else{
                        this.requireSonDir();
                    }
                }
                
            },
            bookDir_handleCurrentChange(val) {
                this.bookDir_currentPage = val;
                if(this.bookCat == "小说"){
                    this.requireDir();
                }else{
                    if(this.isRootDir){
                        this.requireRoot();
                    }else{
                        this.requireSonDir();
                    }
                }
            },
            handleSizeChange1(val) {
                this.pagesize1 = val;
                this.comSearch();
            },
            handleCurrentChange1(val) {
                this.currentPage1 = val;
                this.comSearch();
            },
            initchapter(url,queryParam){
                var _this = this;
                var width = $("#chapterchart").width();
                var height = 600;
                var img_w = 20;
                var img_h = 20;
                var _this = this;

                var svg = d3.select("#chapterchart").append("svg:svg")
                            .attr("width",width)
                            .attr("height",height);


                d3.json(url,function(error,root){
                    if( error ){
                        console.log(error);
                    }
                    if(root.edges.length == 0&&root.nodes.length == 0){
                        $(".noneMap").show();
                    }

                    linkClass(root.edges);

                    //区分节点之间是两条线还是一条线
                    function linkClass(links){
                        $.each(links,function(i,link){
                            if(!!!link.lineStyle){
                                for(var j=0; j<links.length; j++){
                                    if(link.source == links[j].target && link.target == links[j].source){
                                        link.lineStyle = "double";
                                        links[j].lineStyle = "double";
                                    }
                                }
                                if(!!!link.lineStyle){
                                    link.lineStyle = "single";
                                }
                            }
                        });
                    }

                    var force = d3.layout.force()
                                    .nodes(root.nodes)
                                    .links(root.edges)
                                    .size([width,height])
                                    .linkDistance(200)
                                    .charge(-1500)
                                    .on("tick", tick)
                                    .start();
                                    
                    function drag(){//拖拽函数
                        return force.drag()
                                    .on("dragstart",function(d){
                                        d3.event.sourceEvent.stopPropagation(); //取消默认事件
                                        d.fixed = true;    //拖拽开始后设定被拖拽对象为固定
                                    });
                         
                    }
                    svg.append("svg:defs")
                        .append("svg:marker")
                        .attr("id", "resolved")
                        .attr("viewBox", "0 -5 10 10")
                        .attr("refX", 34)
                        .attr("refY", -1.5)
                        .attr("markerWidth", 6)
                        .attr("markerHeight", 6)
                        .attr('fill','#ccc')
                        .attr("orient", "auto")
                        .append("svg:path")
                        .attr("d", "M0,-5L10,0L0,5");
                   
                   //曲线
                    var path = svg.append("g").selectAll("path")
                        .data(force.links().filter(function(d){
                            return d.lineStyle == "double";
                        }))
                        .enter()
                        .append("svg:path")
                        .style('fill','none')
                        .attr('stroke','#ccc')
                        .attr('stroke-width',2)
                        .attr("marker-end", "url(#resolved)");

                    //隐藏曲线
                    var hiddenPath = svg.append("g").selectAll("path")
                        .data(force.links().filter(function(d){
                            return d.lineStyle == "double";
                        }))
                        .enter()
                        .append("svg:path")
                        .style('fill','none')
                        .attr('id',function(d,i){
                            return "path-"+i;
                        });

                    //直线
                    var svg_edges = svg.selectAll("line")
                       .data(force.links().filter(function(d,i){
                          return d.lineStyle == "single";
                       }))
                       .enter()
                       .append("line")
                       .attr("stroke","#ccc")
                       .attr("stroke-width",2)
                       .attr("marker-end", "url(#resolved)");

                    //曲线文字    
                    var curveTxt = svg.append("svg:g").selectAll("text")
                        .data(force.links().filter(function(d){
                            return d.lineStyle == "double";
                        }))
                        .enter().append('svg:text')
                        .style('font-size', '12px')
                        .append('textPath')
                        .text(function(d) { return d.type; });

                    //直线文字    
                    var lineTxt = svg.append("svg:g").selectAll("text")
                        .data(force.links().filter(function(d){
                            return d.lineStyle == "single";
                        }))
                        .enter().append('svg:text')
                        .style('font-size', '12px')
                        .text(function(d) { return d.type; });

                    //节点
                    var nodes_img = svg.append("svg:g").selectAll("circle")
                                        .data(root.nodes)
                                        .enter()
                                        .append("circle")
                                        .attr("cx",function(d){ return d.dx; })
                                        .attr("cy",function(d){ return d.dy; })
                                        .attr("r",function(){
                                            return 30;
                                        })
                                        .style("fill","#6DCE9E")
                                        .on("dblclick",function(d,i){
                                            _this.peopleInfo = JSON.parse(JSON.stringify(d));
                                            var positionX = d.px-300;
                                            if(positionX<-90){
                                                positionX = -90;
                                            }
                                            $(".d3PeopleInfo").css("left",positionX);
                                            $(".d3PeopleInfo").css("top",d.py);
                                            _this.peopleInfoVisible = true;
                                        })
                                        .call(drag());

                    //节点文字
                    var nodeTxt = svg.append("svg:g").selectAll("text")
                        .data(force.nodes())
                        .enter()
                        .append("svg:text")
                        .style("text-anchor","middle")
                        .style("fill","#fff")
                        .style('font-size', '12px')
                        .text(function(d) { return d.name; })
                        .call(drag());
                     
                    function tick() {
                        root.nodes.forEach(function(d,i){
                            d.x = d.x - 30 < 0     ? 30 : d.x ;
                            d.x = d.x + 30 > width ? width - 30 : d.x ;
                            d.y = d.y - 30 < 0      ? 30 : d.y ;
                            d.y = d.y + 30 > height ? height - 30: d.y ;
                        });
                        path.attr("d", function(d) {
                            var dx = d.target.x - d.source.x,//增量
                                dy = d.target.y - d.source.y,
                                dr = Math.sqrt(dx * dx + dy * dy);
                            return "M" + d.source.x + "," 
                            + d.source.y + "A" + dr + "," 
                            + dr + " 0 0,1 " + d.target.x + "," 
                            + d.target.y;
                        });

                        hiddenPath.attr("d",function(d){
                            var dx = d.target.x - d.source.x,
                                dy = d.target.y - d.source.y,
                                dr = Math.sqrt(dx * dx + dy * dy);
                            if(dx < 0){
                                return "M" + d.target.x + "," + d.target.y + "A" + dr + "," + dr + " 0 0,0" + d.source.x + "," + d.source.y;
                            }else{
                                return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
                            }
                        });

                        svg_edges.attr("x1", function (d) {return d.source.x;})
                                 .attr("y1", function (d) {return d.source.y;})
                                 .attr("x2", function (d) {return d.target.x;})
                                 .attr("y2", function (d) {return d.target.y;});
                     
                        nodes_img.attr("transform", function(d) {
                            return "translate(" + d.x + "," + d.y + ")";
                        });

                        nodeTxt.attr("transform", function(d) {
                            return "translate(" + d.x + "," + d.y + ")";
                        });
                         
                        curveTxt.attr("xlink:href",function(d,i){
                                return "#path-"+i;
                            })
                            .attr("startOffset", "50%")
                            .style("text-anchor","middle");

                        lineTxt.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; })
                               .attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });
                    }
                })
                .header("Content-Type","application/json")
                .send("POST", JSON.stringify({eid: queryParam}));
            }
        },
        data () {
            return {

                bookCat: "",
                userid: 0,

                cur_com_total: 0,
                cur_commentList: [],
                cur_pagesize: 20,
                cur_currentPage: 1,
                isMask: false,
                curComTit: '',

                dirData:[],
                bookDir_currentPage: 1,
                bookDir_pagesize: 10,
                bookDir_totalCount: 0,
                isBookDir: false,

                isRootDir: false,
                dirRootData: [],
                selEpisodeid: '',

                commentSearch: "",
                currentPage1: 1,
                pagesize1: 10,
                totalCount1: 0 ,
                commentList: [],

                basic_url: Config.api,
                peopleInfoVisible: false,
                peopleInfo: {
                    name: '',
                    relationship: '',
                    character: '',
                    title: '',
                },
                person: require('../assets/img/person.png'),
                bookname: '',
                bookid: 1,
                isRelation: true,
                isSearch: true,
                firstLoad: true,
                chaptereid: '',
                country: require('../assets/img/country.png'),
                d3Params: {
                    width: 600,
                    height: 450,
                    img_w: 30,
                    img_h: 40
                },
                search: '',
                select: '',
                relationTxt:'',
                listData:[],
                eid: '',

                person: require('../assets/img/person.png'),
                event: require('../assets/img/event.png'),
                state_or_province: require('../assets/img/state_or_province.png'),
                organization: require('../assets/img/organization.png'),
                country: require('../assets/img/country.png'),
                date: require('../assets/img/date.png'),
                facility: require('../assets/img/facility.png'),
                title: require('../assets/img/title.png'),


                //page信息
                pagesize: 10,
                totalCount: 1,
                currentPage: 1,
            }        
        },
        mounted(){
            this.bookname = this.$route.query.bookname;
            this.bookid = this.$route.query.bookid;
            this.userid = sessionStorage.getItem('userid');
            this.chapterEid = this.$route.query.eid;

            this.getCat();

            $("#first").show();
            $("#second").hide();
            $("ul.tabList li:nth-child(1)").css("background","#fff");
            $("ul.tabList li:nth-child(2)").css("background","#F3F6FA");
        }
    }
</script>
<style scoped>

path.link {
  fill: none;
  stroke: #666;
  stroke-width: 1.5px;
}
circle {
  fill: #ccc;
  stroke: #333;
  stroke-width: 1.5px;
}
 
text {
  font: 10px sans-serif;
  pointer-events: none;
}
 
text.shadow {
  stroke: #fff;
  stroke-width: 3px;
  stroke-opacity: .8;
}
.nodetext {
    font-size: 12px ;
    font-family: SimSun;
    fill:#000000;
}
.linetext {
    font-size: 12px ;
    font-family: SimSun;
    fill:#0000FF;
    fill-opacity:1.0;
}
#chart{
    width: 100%;
    height:400;
    padding-bottom: 50px;
    margin: 0 auto;
}
.el-select .el-input {
    width: 130px;
}
.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
#relationTxt{
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    text-indent: 32px;
    width: 100%;
    float: left;
    text-align: left;
    margin-bottom: 50px;
    padding-bottom: 50px;
}
#relationTxt h4{
    text-align: center;
    font-size: 18px;
    font-weight: bold;
}
#relationTxt span{
    display: block;
    font-size: 12px;
    width: 100%;
    text-align: center;
}
#relationTxt p{
    display: block;
    font-size: 12px;
    width: 100%;
    text-align: center;
}
#relationTxt div{
    padding-bottom: 50px;
}
.navTxt{
    width: 100%;
    height: 65px;
    background:rgba(243,246,250,1);
    padding-left: 100px;
    box-sizing: border-box;
}
.navTxt .tabList,.navTxt .tit{
    display: block;
    float: left;
}
.navTxt .tit{
    height:25px;
    font-size:18px;
    color:rgba(170,178,192,1);
    line-height:25px;
    margin-top: 25px;
}
.navTxt .tabList{
    height: 40px;
    line-height: 40px;
    text-align: center;
    margin-top: 25px;
    margin-left: 50px;
}
.navTxt .tabList li{
    height: 40px;
    padding-left: 20px;
    padding-right: 20px;
    color: #000;
    display: block;
    float: left;
    backgound: #fff;
    font-size:15px;
    color:rgba(91,99,113,1);
    line-height: 40px;
    cursor: pointer;
    border-radius: 8px 8px 0px 0px;
}
.navTxt .tabList li:hover{
    color: #0083FF;
    background: #fff;
}
.navTxt .returnList,.navTxt i{
    display: block;
    float: right;
    color:rgba(0,186,252,1);
    font-size: 14px;
    margin-top: 38px;
    cursor: pointer;
}
.navTxt .returnList{
    margin-left: 5px;
    margin-right: 20px;
}
.tabContent{
    box-sizing: border-box;
    padding-left: 100px;
    padding-right: 100px;
    min-height: 500px;
}
.search-div{
    box-shadow:-3px 0px 5px 0px rgba(0,0,0,0.1);
    border:1px solid rgba(225,232,238,1);
    border-bottom: none;
    min-height: 600px;
    position: relative;
}
.search-div p{
    padding-left: 10px;
    padding-right: 10px;
    width: 100%;
    height: 65px;
    background:rgba(243,246,250,1);
    box-sizing: border-box;
    padding-top: 15px;
}
.searchResult ul li{
    padding-left: 5px;
    padding-right: 5px;
    height: 60px;
    line-height: 60px;
    font-size:15px;
    color:rgba(0,34,87,1);
    border-bottom: 1px solid #eee;
    cursor: pointer;
    white-space:nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.searchResult ul{
    padding-left: 15px;
    box-sizing: border-box;
    padding-right: 15px;
    margin-top: 20px;
    min-height: 400px;
    z-index: 4;
    margin-bottom: 40px;
}
.cirle{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #0064FF;
    display: block;
    position: absolute;
    top: 50%;
    right: 0;
    margin-top: -20px;
    margin-right: -20px;
    font-size: 24px;
    background: #fff;
    text-align: center;
    line-height: 40px;
    box-shadow:-3px 0px 5px 0px rgba(0,0,0,0.1);
    border:1px solid rgba(225,232,238,1);
    z-index: 3;
    border-top: none;
    border-right: none;
}
#chapterchart{
    width: 80%;
    height: 400px;
    margin: 0 auto;
}
.d3PeopleInfo{
    width: 350px;
    border: 2px solid #ccc;
    padding: 10px;
    padding-top: 30px;
    background: #fff;
    position: absolute;
}
.el-icon-close{
    float: right;
    display: block;
    margin-top: -20px;
    margin-bottom: 10px;
    cursor: pointer;
}
.comment{
    width: 50%;
    margin: 80px auto;
}
.commentResult p em{
    color: red;
    font-weight: bold;
}
.commentResult{
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
}
.commentResult p:nth-child(1){
    font-size: 14px;
    line-height: 24px;
}
.commentResult p:nth-child(2){
    padding-top: 5px;   
}
.item{
    float: right;
    margin-top: 10px;
}
.mask{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: #000;
    opacity:0.8;
    z-index: 10001;
    padding-top: 1px;
}
.cur_comment{
    width: 90%;
    height: 100%;
    max-height: 400px;
    margin: 0 auto;
    color: #000;
    overflow-y: scroll;
}
.loadMore{
    text-align: center;
    cursor: pointer;
    margin-top: 50px;
}
.closeMask{
    float: right;
    display: block;
    margin-top: -20px;
    margin-bottom: 10px;
    cursor: pointer;
    position: absolute;
    height: 50px;
    width: 50px;
    color: #fff;
    right: 50px;
    top: 50px;
    font-size: 24px;
}
#four #cur_chart{
    padding-top: 50px;
}
.search-div .search-box span{
    display: block;
    height: 65px;
    line-height: 65px;
    font-size: 14px;
    font-weight: bold;
    float: left;
}
.search-div .search-box span.returnList{
    font-weight: normal;
    float: right;
    color: rgba(0,186,252,1);
    cursor: pointer;
}
.search-div .search-box i{
    color: rgba(0,186,252,1);
    margin-top: 25px;
    margin-right: 4px;
    cursor: pointer;
    float: right;
}


.cur_comment::-webkit-scrollbar{
    width:4px;
    height:4px;
}
.cur_comment::-webkit-scrollbar-track{
    background: #f6f6f6;
    border-radius:2px;
}
.cur_comment::-webkit-scrollbar-thumb{
    background: #aaa;
    border-radius:2px;
}
.cur_comment::-webkit-scrollbar-thumb:hover{
    background: #747474;
}
.cur_comment::-webkit-scrollbar-corner{
    background: #f6f6f6;
}
li.selected{
    background: rgba(243,246,250,1);
}
</style>
