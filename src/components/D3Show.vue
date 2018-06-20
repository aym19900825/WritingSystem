<template>
    <div>
        <topNav></topNav>
        <el-row>
            <el-col :span="12" :offset="6">
                <div style="margin-top: 15px;">
                    <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
                        <el-select v-model="select" slot="prepend" placeholder="请选择">
                            <el-option label="人物" value="person"></el-option>
                            <el-option label="事件" value="event"></el-option>
                        </el-select>
                        <el-button slot="append" icon="el-icon-search" @click="searchRelation"></el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="18" :offset="6">
                <div id="chart"></div>
            </el-col>
        </el-row>
        
    </div>
</template>
<script>
    import topNav from '@/components/common/TopNav'
    export default {
        name: 'D3Show',
        components:{
            topNav
        },
        methods: {
            searchRelation(){
                this.d3Init("/api/relation1");
            },
            d3Init(url){
                var width = 600;
                var height = 500;
                var img_w = 45;
                var img_h = 60;
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
                                            return d.relation;
                                        });
                    
                                        
                    var nodes_img = svg.selectAll("image")
                                        .data(root.nodes)
                                        .enter()
                                        .append("image")
                                        .attr("width",img_w)
                                        .attr("height",img_h)
                                        .attr("xlink:href",function(d){
                                            return d.image;
                                        })
                                        .on("mouseover",function(d,i){
                                            //显示连接线上的文字
                                            edges_text.style("fill-opacity",function(edge){
                                                if( edge.source === d || edge.target === d ){
                                                    return 1.0;
                                                }
                                            });
                                        })
                                        .on("mouseout",function(d,i){
                                            //隐去连接线上的文字
                                            edges_text.style("fill-opacity",function(edge){
                                                if( edge.source === d || edge.target === d ){
                                                    return 0.0;
                                                }
                                            });
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
                });
           } 
        },
        data () {
            return {
                d3Params: {
                    width: 600,
                    height: 600,
                    img_w: 77,
                    img_h: 90
                },
                search: '',
                select: ''
            }        
        },
        mounted() {
            this.d3Init("/api/relation");
        }
    }
</script>
<style scoped>
.nodetext {
    font-size: 12px ;
    font-family: SimSun;
    fill:#000000;
}

.linetext {
    font-size: 12px ;
    font-family: SimSun;
    fill:#0000FF;
    fill-opacity:0.0;
}
#chart{
    width: 100%;
    height:500px;
    padding-top: 50px;
    padding-bottom: 50px;
}
.el-select .el-input {
    width: 130px;
}
.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
</style>