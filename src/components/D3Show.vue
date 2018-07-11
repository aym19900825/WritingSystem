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
                    </ul>
                    <span class="returnList" @click="returnPre">返回</span>
                    <i class="icon-back"></i>
                </p>
                <div class="tabContent">
                    <div id="first">
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
                    <div id="second" style="position: relative;">
                       <div v-show="chaptereid==''">
                            <p style="width:100%;font-size:24px;text-align:center;margin-top:200px;">您还没有人物图谱</p>
                       </div>
                       <div id="chapterchart" v-show="chaptereid!=''"></div>
                        <!--图谱点击的人物卡-->
                        <div class="d3PeopleInfo" v-show="peopleInfoVisible">
                            <i class="el-icon-close" @click="closePeople"></i>
                            <el-form ref="form" :model="peopleInfo" label-width="80px">
                              <el-form-item label="姓名" prop="name">
                                <el-input  v-model="peopleInfo.name" placeholder="暂无信息"></el-input>
                              </el-form-item>
                              <el-form-item label="身份特征" prop="titles">
                                <el-input type="textarea" :rows="2" v-model="peopleInfo.title"  placeholder="暂无信息"></el-input>
                              </el-form-item>
                              <el-form-item label="性格特点" prop="characters">
                                <el-input type="textarea" :rows="2" v-model="peopleInfo.character"  placeholder="暂无信息"></el-input>
                              </el-form-item>
                            </el-form>
                        </div>
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
                           <li @click="searchChart(item._source.eid)" v-for="item in listData" :title="item._source.title">{{item._source.title}}</li>
                        </ul>
                    </div>
                    <div align="right">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :pager-count="3"
                            :page-size="pagesize"
                            layout="total, prev, pager, next"
                            :total="totalCount">
                        </el-pagination>
                    </div>
                </div>
            </el-col>
        </el-row>

    </div>
</template>
<script>
    import Header from './common/Header.vue'
    import axios  from 'axios' 
    import topNav from '@/components/common/TopNav';
    export default {
        name: 'D3Show',
        components: {
            'v-header': Header
        },
        methods: {
            closePeople(){
                this.peopleInfoVisible = false;
            },
            showHide(){
                if(this.isSearch){
                    $(".main").width("100%");
                    $(".cirle").removeClass("icon-arrow2-right");
                    $(".cirle").addClass("icon-arrow2-left");
                }else{
                    $(".main").width("66.66%");
                    $(".cirle").removeClass("icon-arrow2-left");
                    $(".cirle").addClass("icon-arrow2-right");
                }
                this.isSearch = !this.isSearch;
            },
            tabChang(tabname){
                if(tabname=="first"){
                    $("#first").show();
                    $("#second").hide();
                    $("ul.tabList li:nth-child(1)").css("background","#fff");
                    $("ul.tabList li:nth-child(2)").css("background","#F3F6FA");

                    //人物图谱样式设置
                    this.isRelation = true;
                    this.isSearch = true;
                    $(".main").width("66.66%");
                    $(".cirle").removeClass("icon-arrow2-left");
                    $(".cirle").addClass("icon-arrow2-right");
                }else{
                    $("#second").show();
                    $("#first").hide();
                    $("ul.tabList li:nth-child(1)").css("background","#F3F6FA");
                    $("ul.tabList li:nth-child(2)").css("background","#fff");

                    //人物图谱样式设置
                    this.isRelation = false;
                    this.isSearch = false;
                    $(".main").width("100%");

                    //首次点击人物图谱加载数据
                    if(this.chaptereid==""){
                        this.initChaptereid();
                    }
                }
            },
            initChaptereid(){
                this.chaptereid = "1V04h2QB7mI_3iJyuFO3";
                this.initchapter("http://203.93.173.179:8888/api/char_graph_search","1V04h2QB7mI_3iJyuFO3");
            },
            d3Init(url,svgdom,queryParam1,queryParam2){
                var _this = this;
                var width = this.d3Params.width;
                var height = this.d3Params.height;
                var img_w = this.d3Params.img_w;
                var img_h = this.d3Params.img_h;
                var _this = this;
                d3.select("svg").remove();
                var svgdom = '#'+svgdom;
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
                    var force = d3.layout.force()
                                    .nodes(root.nodes)
                                    .links(root.edges)
                                    .size([width,height])
                                    .linkDistance(200)
                                    .charge(-1500)
                                    .start();
                                    
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
                                        .text(function(d){
                                            return d.type;
                                        })
                                        .on("click",function(d,i){
                                            axios.post("http://203.93.173.179:8888/api/news/detail",{
                                                "eid": d.eid
                                            }).then((res) => {
                                                $("#relationTxt h4").text(res.data.title);
                                                $("#relationTxt p").html("信息链接地址：<a href='"+res.data.url+"' target='_blank'>"+res.data.url+" </a>");
                                                $("#relationTxt span").text(res.data.create_date);
                                                $("#relationTxt div").text(res.data.content);

                                                //设置d3show的高度
                                                var txtHeight = $("#relationTxt div").height()+700;
                                                console.log(txtHeight);
                                                $("#d3show").height(txtHeight+"px");

                                            }).catch((err) => {
                                                this.$message({
                                                    type: 'error',
                                                    message: '网络错误，请重试',
                                                    showClose: true
                                                })
                                            })
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
                                        .call(force.drag);
                    
                    var text_dx = -20;
                    var text_dy = 20;
                    
                    var nodes_text = svg.selectAll(".nodetext")
                                        .data(root.nodes)
                                        .enter()
                                        .append("text")
                                        .attr("class","nodetext")
                                        .attr("dx",text_dx)
                                        .attr("dy",text_dy)
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
            searchChart(eid){
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
               
               this.d3Init("http://203.93.173.179:8888/api/graph_search","chart",this.search,eid);
               $("#relationTxt h4").text("");
               $("#relationTxt span").text("");
               $("#relationTxt p").text("");
               $("#relationTxt div").text("");
            },
            searchRelation(){
                this.requestData();
            },
            requestData(){
                var _this = this;
                var url = "http://203.93.173.179:8888/api/search/list";
                this.$axios.post(url,{
                            search_text: this.search,
                            page_index: this.currentPage,
                            page_size: this.pagesize
                }).then((res) => {
                    this.listData = res.data.data;
                    this.totalCount = res.data.total;
                    if(_this.firstLoad){
                        this.d3Init("http://203.93.173.179:8888/api/graph_search","chart",this.search,this.listData[0]['_source'].eid);
                        _this.firstLoad = false;
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
            initchapter(url,queryParam){
                var _this = this;
                var width = 600;
                var height = 400;
                var img_w = 20;
                var img_h = 20;
                var _this = this;
                d3.select("svg").remove();

                var svg = d3.select("#chapterchart").append("svg:svg")
                                .attr("width",width)
                                .attr("height",height);


                d3.json(url,function(error,root){
                    if( error ){
                        console.log(error);
                    }
                    var force = d3.layout.force()
                                    .nodes(root.nodes)
                                    .links(root.edges)
                                    .size([width,height])
                                    .linkDistance(200)
                                    .charge(-1500)
                                    .on("tick", tick)
                                    .start();
                                    
                    
                    svg.append("svg:defs")
                        .append("svg:marker")
                        .attr("id", "resolved")
                        .attr("viewBox", "0 -5 10 10")
                        .attr("refX", 15)
                        .attr("refY", -1.5)
                        .attr("markerWidth", 6)
                        .attr("markerHeight", 6)
                        .attr('fill','#ccc')
                        .attr("orient", "auto")
                        .append("svg:path")
                        .attr("d", "M0,-5L10,0L0,5");
                    //(2)根据连线类型引用上面创建的标记
                    var path = svg.append("svg:g").selectAll("path")
                        .data(root.edges)
                        .enter().append("svg:path")
                        .attr('fill','none')
                        .attr('stroke','#ccc')
                        .attr('stroke-width',2)
                        .attr("marker-end", "url(#resolved)");

                    var nodes_img = svg.append("svg:g").selectAll("image")
                                        .data(root.nodes)
                                        .enter()
                                        .append("image")
                                        .attr("width",img_w)
                                        .attr("height",img_h)
                                        .attr("xlink:href",function(d){
                                            return _this.person;
                                        })
                                        .on("click",function(d,i){
                                            _this.peopleInfo = JSON.parse(JSON.stringify(d));
                                            $(".d3PeopleInfo").css("left",d.px-100);
                                            $(".d3PeopleInfo").css("top",d.py);
                                            _this.peopleInfoVisible = true;
                                        })
                                        .call(force.drag);
                     
                    var text = svg.append("svg:g").selectAll("g")
                        .data(root.nodes)
                        .enter().append("svg:g");

                    var text_dx = -40;
                    var text_dy = 20;
                     
                    // A copy of the text with a thick white stroke for legibility.
                    text.append("svg:text")
                        .attr("x", text_dx)
                        .attr("y", text_dy)
                        .attr("class", "shadow")
                        .text(function(d) { return d.name; });
                     
                    text.append("svg:text")
                        .attr("x", text_dx)
                        .attr("y", text_dy)
                        .text(function(d) { return d.name; });
                     
                    function tick() {
                      path.attr("d", function(d) {
                        var dx = d.target.x - d.source.x,//增量
                            dy = d.target.y - d.source.y,
                            dr = Math.sqrt(dx * dx + dy * dy);
                        return "M" + d.source.x + "," 
                        + d.source.y + "A" + dr + "," 
                        + dr + " 0 0,1 " + d.target.x + "," 
                        + d.target.y;
                      });
                     
                      nodes_img.attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")";
                      });
                     
                      text.attr("transform", function(d) {
                        return "translate(" + d.x + "," + d.y + ")";
                      });
                    }
                })
                .header("Content-Type","application/json")
                .send("POST", JSON.stringify({eid: queryParam}));
            }
        },
        data () {
            return {
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
                    height: 300,
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
    padding-top: 50px;
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
    min-height: 700px;
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
    width: 600px;
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
</style>
