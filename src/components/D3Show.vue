<template>
    <div id="d3show">
        <el-button class="returnPre el-icon-arrow-left el-icon--left" @click="returnPre">返回</el-button>
        <el-row>
            <el-col :span="12" :offset="6">
                <div style="margin-top: 15px;">
                    <el-input placeholder="请输入内容" v-model="search" class="input-with-select" @keydown="searchEnter($event)">
                        <el-button slot="append" icon="el-icon-search" @click="searchRelation"></el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div id="d3show">
                    <el-row>
                        <div id="chart"></div>
                        <p id="relationTxt" v-text="relationTxt"></p>
                    </el-row>
                </div>
            </el-col>
            <el-col :span="12">
                <div >
                    <ul>
                        <li @click="searchChart(item._source.eid)" v-for="item in listData">{{item._source.title}}</li>
                    </ul>
                </div>
                <div align="right">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount">
                    </el-pagination>
                </div>
            </el-col>
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
</template>
<script>
    import axios  from 'axios' 
    import topNav from '@/components/common/TopNav';
    export default {
        name: 'D3Show',
        components:{
            topNav
        },
        methods: {
            d3Init(url,queryParam1,queryParam2){
                var _this = this;
                var width = this.d3Params.width;
                var height = this.d3Params.height;
                var img_w = this.d3Params.img_w;
                var img_h = this.d3Params.img_h;
                var _this = this;
                d3.select("svg").remove();

                var svg = d3.select("#chart").append("svg")
                                .attr("width",width)
                                .attr("height",height);

                d3.json(url,function(error,root){
                    if( error ){
                        console.log(error);
                    }
                    console.log(root);
                    
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
                                            console.log(d.eid);
                                            axios.post("http://203.93.173.179:8888/api/news/detail",{
                                                "eid": d.eid
                                            }).then((res) => {
                                                $("#relationTxt h4").text(res.data.title);
                                                $("#relationTxt p").html("信息链接地址：<a href='"+res.data.url+"' target='_blank'>"+res.data.url+" </a>");
                                                $("#relationTxt span").text(res.data.create_date);
                                                $("#relationTxt div").text(res.data.content);
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
                                            console.log(d.image.toLowerCase());
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
                .send("POST", JSON.stringify({search_text: queryParam1,eid:queryParam2}));
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
               
               this.d3Init("http://203.93.173.179:8888/api/graph_search",this.search,eid);

            },
            searchRelation(){
                this.requestData();
            },
            requestData(){
                var url = "http://203.93.173.179:8888/api/search/list";
                this.$axios.post(url,{
                            search_text: this.search,
                            page_index: this.currentPage,
                            page_size: this.pagesize
                }).then((res) => {
                    this.listData = res.data.data;
                    this.totalCount = res.data.total;
                    this.d3Init("http://203.93.173.179:8888/api/graph_search",this.search,this.listData[0]['_source'].eid);
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
                this.initBookList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.initBookList();
                console.log(val);
            }
        },
        data () {
            return {
                country: require('../assets/img/country.png'),
                d3Params: {
                    width: 600,
                    height: 600,
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
                pagesize: 20,
                totalCount: 1,
                currentPage: 1,
            }        
        }
    }
</script>
<style scoped>
#d3show{
    width: 90%;
    margin: 0 auto;
    min-height: 600px;
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
    height:600;
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
ul{
    margin-top: 50px;
    min-height: 350px;
}
ul li{
    line-height: 30px;
    height: 30px;
    font-size: 16px;
    font-weight: bold;
    padding-left: 15%;
    text-decoration: underline;
    cursor: pointer;
}
#relationTxt div{
    padding-bottom: 50px;
}
</style>
