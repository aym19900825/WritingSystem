<template>
    <div id="d3show">
        <el-button class="returnPre el-icon-arrow-left el-icon--left" @click="returnPre">返回</el-button>
        <el-row>
            <el-col :span="12" :offset="6">
                <div style="margin-top: 15px;">
                    <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="searchRelation"></el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div id="chart"></div>
            <div id="relationTxt">
                <h4></h4>
                <span></span>
                <p></p>
                <div></div>
            </div>
            <p id="relationTxt" v-text="relationTxt"></p>
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
            returnPre(){
                sessionStorage.setItem('url','login');
                this.$router.push({
                    path: '/edit', 
                    name: 'Edit',
                })
            },
            searchRelation(){
                this.d3Init("http://192.168.1.168:8888/api/graph_search",this.search);
            },
            d3Init(url,queryParam){
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
                                            axios.post("http://192.168.1.168:8888/api/news/detail",{
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
                                            return "/static/"+d.image.toLowerCase();
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
                .send("POST", JSON.stringify({search_text: queryParam}));
           } 
        },
        data () {
            return {
                d3Params: {
                    width: 600,
                    height: 600,
                    img_w: 30,
                    img_h: 40
                },
                search: '',
                select: '',
                relationTxt:''
            }        
        },
        mounted(){
            this.d3Params.width = $("#d3show").width();
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
</style>
