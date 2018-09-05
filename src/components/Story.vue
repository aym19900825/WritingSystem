<template>
    <div class="main">
        <v-header></v-header>
        <p class="navTxt">
            <span class="tit">故事大纲</span>
            <ul class="tabList">
                <li @click="tabChang('first')">故事简介</li>
                <li @click="tabChang('second')">人物设定</li>
            </ul>
            <span class="returnList" @click="returnPre">返回我的作品</span>
            <i class="icon-back"></i>
        </p>
         <div class="tabContent">
            <div id="first">
               <div class="abstract">
                    <p>故事简介</p>
                    <textarea style="padding: 10px;" v-model="bookabstract"></textarea>
                    <el-button type="primary" style="margin: 0 auto;position: relative;left: 50%;margin-left: -100px;padding: 15px 50px;margin-top: 50px;" @click="addAbstract" v-if="abstracteid==''">保存</el-button>
                    <el-button type="primary" style="margin: 0 auto;position: relative;left: 50%;margin-left: -100px;padding: 15px 50px;margin-top: 50px;" @click="editAbstract" v-else>更新</el-button>
                </div>
            </div>
            <div id="second">
               <div class="person">
                    <el-button type="primary" style="float: right; margin-right: 100px;margin-top: 20px;margin-bottom: 20px;" @click="dialogFormVisible = true">+添加人物</el-button>
                    <el-table :data="peoples" style="width: 85%;margin: 0 auto;">
                        <el-table-column label="序号" width="100">
                            <template slot-scope="scope">
                                <span class="index-box">{{scope.$index+1}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="姓名/性格特点" width="250" >
                            <template slot-scope="scope">
                                <p class="title">{{ scope.row.name }}</p>
                                <p class="charact">{{ scope.row.characters }}</p>
                            </template>
                        </el-table-column>
                        <el-table-column label="身份特征" prop="titles"></el-table-column>
                        <el-table-column label="人物关系" width="180" prop="relationship"></el-table-column>
                        <el-table-column label="操作" width="180">
                            <template slot-scope="scope">
                                <el-button type="success" icon="edit" size="mini" @click="editPeople(scope.row,scope.$index)">编辑</el-button>
                                <el-button type="danger" icon="delete" size="mini" @click="delPeople(scope.row,scope.$index)">删除</el-button>
                            </template>
                         </el-table-column>
                   </el-table>
                   <el-row style="text-align: center;margin-top: 30px;position: relative;margin-bottom: 30px;">
                        <el-button type="primary" @click="addPeoples" v-if="peopleeid==''">保存</el-button>
                        <el-button type="primary" @click="editPeoples"  v-else>更新</el-button>
                        <el-button type="primary"  @click="characterMap" plain v-if="peopleeid!=''">人物图谱</el-button>

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
                   </el-row>
                   <el-row type="flex" justify="center" v-show="isShowRelation">
                        <div id="chart"></div>
                   </el-row>
                </div>
            </div>
        </div>
        <el-dialog title="人物信息" :visible.sync="dialogFormVisible"  :rules="rules" :before-close="handleClose" width="480px" id="peopleDialog">
            <el-form ref="peopleform" :model="newPeople" label-width="80px" label-position="top" style="border-top:1px solid rgba(233,235,242,1);">
                <el-form-item label="姓名" prop="name">
                     <el-input  v-model="newPeople.name"></el-input>
                 </el-form-item>
                <el-form-item label="身份特征" prop="titles">
                    <el-input type="textarea" :rows="2" v-model="newPeople.titles"  placeholder="请输入人物身份特征"></el-input>
                </el-form-item>
                <el-form-item label="性格特点" prop="characters">
                    <el-input type="textarea" :rows="2" v-model="newPeople.characters"  placeholder="请输入人物性格特点"></el-input>
                </el-form-item>
                <el-form-item label="人物关系">
                    <el-button type="primary" class="addRelation" size="mini" @click="addRelation">+增加</el-button>
                    <el-row :gutter="20" class="relationDiv" v-for="(item,index) in relationArr">
                        <el-col :span="10">
                            <label style="float:left;">人物：</label>
                            <el-input type="text"  placeholder="请输入人物" v-model="item.name"></el-input>
                        </el-col>
                        <el-col :span="10">
                            <label  style="float:left;">关系：</label>
                            <el-input type="text"  placeholder="请输入关系" v-model="item.relationShip"></el-input>
                        </el-col>
                        <el-button type="danger" size="mini" @click="delRelation(item)">删除</el-button>
                    </el-row>
                    <!--
                        <el-input type="textarea" :rows="2" v-model="newPeople.relationship"  placeholder="请输入人物关系"></el-input>
                        <p class="tip">人物关系示例如下：父亲，XXX；母亲，XXX；</p>
                    -->
                </el-form-item>
                <el-form-item class="btnGrounp">
                    <el-button type="primary" @click="addPeople" v-show="!isupdatePeople">添加</el-button>
                    <el-button type="primary" @click="updatePeople" v-show="isupdatePeople">更新</el-button>
                    <el-button @click="resetPeople" type="info">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>

<script>
    import Header from './common/Header.vue'
    import Config from '../config.js'
    import Vue from 'vue'
    export default {
        name: 'Story',
        methods: {
            addRelation(){
                var obj = {
                    name: '',
                    relationShip: ''
                };
                this.relationArr.push(obj);
            },
            delRelation(item){
                var index = this.relationArr.indexOf(item);
                if (index !== -1) {
                    this.relationArr.splice(index, 1)
                }
            },
            addPeoples(){
                var _this = this;
                var obj = {
                    people: []
                };
                var peoples = JSON.parse(JSON.stringify(this.peoples));
                for(var i=0;i<peoples.length;i++){
                    var arr = [];
                    var tmp =  peoples[i].relationship;
                    var tmparr = tmp.split("；");
                    for(var j=0;j<tmparr.length-1;j++){
                        var tmpObj = {};
                        tmpObj.realtion = tmparr[j].split("，")[0]
                        tmpObj.being = tmparr[j].split("，")[1]
                        arr.push(tmpObj);
                    }
                    peoples[i].relationship = arr;
                }
                obj.people = peoples;
                this.$axios.post(_this.basic_url+'/api/character/add',{
                    "bookid": _this.bookid,
                    "charactersetting": JSON.stringify(obj) 
                }).then((res) => {
                    if(res.data.code==1){
                        _this.peopleeid = res.data.eid;
                        this.$message({
                            type: 'success',
                            message: '保存成功',
                            showClose: true
                        })
                    }else{
                        this.$message({
                            type: 'error',
                            message: '保存失败',
                            showClose: true
                        })
                    }
                }).catch((err) => {
                    this.$message({
                        type: 'error',
                        message: '网络异常',
                        showClose: true
                    })
                })
            },
            editPeoples(){
                var _this = this;
                var obj = {
                    people: []
                };
                var peoples = JSON.parse(JSON.stringify(this.peoples));
                for(var i=0;i<peoples.length;i++){
                    var arr = [];
                    var tmp =  peoples[i].relationship;
                    var tmparr = tmp.split("；");
                    for(var j=0;j<tmparr.length-1;j++){
                        var tmpObj = {};
                        tmpObj.realtion = tmparr[j].split("，")[0]
                        tmpObj.being = tmparr[j].split("，")[1]
                        arr.push(tmpObj);
                    }
                    peoples[i].relationship = arr;
                }
                obj.people = peoples;
                this.$axios.post(_this.basic_url+'/api/character/edit',{
                    "bookid": this.bookid,
                    "charactersetting": JSON.stringify(obj),
                    "eid":  this.peopleeid
                } ).then((res) => {
                    if(res.data.code==1){
                        this.$message({
                            type: 'success',
                            message: '保存成功',
                            showClose: true
                        })
                    }else{
                        this.$message({
                            type: 'error',
                            message: '保存失败',
                            showClose: true
                        })
                    }
                }).catch((err) => {
                    this.$message({
                        type: 'error',
                        message: '网络异常',
                        showClose: true
                    })
                })
            },
            addAbstract(){
                var _this = this;
                this.$axios.post(_this.basic_url+'/api/info/add',{
                    "bookid": this.bookid,
                    "bookabstract": this.bookabstract,
                }).then((res) => {
                    if(res.data.code==1){
                        _this.abstracteid = res.data.eid;
                        this.$message({
                            type: 'success',
                            message: '保存成功',
                            showClose: true
                        })
                    }else{
                        this.$message({
                            type: 'error',
                            message: '保存失败',
                            showClose: true
                        })
                    }
                }).catch((err) => {
                    
                })
            },
            editAbstract(){
                var _this = this;
                this.$axios.post(_this.basic_url+'/api/info/edit',{
                    "bookid": _this.bookid,
                    "bookabstract": _this.bookabstract,
                    "eid": _this.abstracteid
                }).then((res) => {
                    if(res.data.code==1){
                        this.$message({
                            type: 'success',
                            message: '保存成功',
                            showClose: true
                        })
                    }else{
                        this.$message({
                            type: 'error',
                            message: '保存失败',
                            showClose: true
                        })
                    }
                }).catch((err) => {
                    
                })
            },
            tabChang(tabname){
                if(tabname=="first"){
                    $("#first").show();
                    $("#second").hide();
                    $("ul.tabList li:nth-child(1)").css("background","#fff");
                    $("ul.tabList li:nth-child(2)").css("background","#F3F6FA");
                }else{
                    $("#second").show();
                    $("#first").hide();
                    $("ul.tabList li:nth-child(1)").css("background","#F3F6FA");
                    $("ul.tabList li:nth-child(2)").css("background","#fff");
                }
            },
            handleCloseStory(){
                this.returnBookList();
            },
            handleClose(done){
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.resetPeople();
                        done();
                    })
                    .catch(_ => {});
               
            },
            resetStory(){
                this.bookabstract = '';
            },
            returnPre(){
                this.$router.replace('/booklist');
            },
            getParams () {
                let bookid = this.$route.query.bookid;
                this.bookid = bookid;
            },
            d3Init(url,queryParam){
                var _this = this;
                var width = $(".person").width();
                var height = 600;
                var img_w = 20;
                var img_h = 20;
                var _this = this;
                var white = d3.rgb(255,255,255);

                d3.select("svg").remove();

                var svg = d3.select("#chart").append("svg:svg")
                                .attr("width",width)
                                .attr("height",height);


                d3.json(url,function(error,root){
                    if( error ){
                        console.log(error);
                    }
                    
                    
                    linkClass(root.edges);

                    var force = d3.layout.force()
                                    .nodes(root.nodes)
                                    .links(root.edges)
                                    .size([width,height])
                                    .linkDistance(200)
                                    .charge(-1500)
                                    .on("tick", tick)
                                    .start();
                         
                    //拖拽函数                
                    function drag(){
                        return force.drag()
                                    .on("dragstart",function(d){
                                        d3.event.sourceEvent.stopPropagation(); //取消默认事件
                                        d.fixed = true;    //拖拽开始后设定被拖拽对象为固定
                                    });
                         
                    }

                    //定义箭头
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
                                            var positionX = d.px-400;
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
                        .style('font-size', '12px')
                        .style("fill",white)
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
                })
                .header("Content-Type","application/json")
                .send("POST", JSON.stringify({eid: queryParam}));
            },
            characterMap(){
                this.d3Init(this.basic_url+"/api/char_graph_search",this.peopleeid);
                this.isShowRelation = true;
            },
            returnBookList(){
                this.$router.push({
                    path: '/booklist', 
                })
            },
            update(){
                var _this = this;
                var obj = {
                    people: []
                };
                for(var i=0;i<this.peoples.length;i++){
                    var arr = [];
                    var tmp =  this.peoples[i].relationship;
                    var tmparr = tmp.split("；");
                    for(var j=0;j<tmparr.length-1;j++){
                        var tmpObj = {};
                        tmpObj.realtion = tmparr[j].split("，")[0]
                        tmpObj.being = tmparr[j].split("，")[1]
                        arr.push(tmpObj);
                    }
                    this.peoples[i].relationship = arr;
                }
                obj.people = this.peoples;
                this.$axios.post(_this.basic_url+'/api/info/edit',{
                    "bookid": this.bookid,
                    "chapterabstract": this.bookabstract,
                    "charactersetting": JSON.stringify(obj),
                    "eid":  this.eid
                } ).then((res) => {
                    _this.innerVisible = true;
                }).catch((err) => {
                
                })
            },
            addPeople(){
                var arr = this.relationArr;
                var newArr = [];
                $.each(arr,function(i,n){
                    newArr.push(n.name +" ，"+n.relationShip);
                });
                this.newPeople.relationship = newArr.join("；")+"；";
                Vue.set(this.peoples,this.peoples.length, JSON.parse(JSON.stringify(this.newPeople)));
                this.resetPeople()
            },
            updatePeople(){
                var arr = this.relationArr;
                var newArr = [];
                $.each(arr,function(i,n){
                    newArr.push(n.name +" ，"+n.relationShip);
                });
                this.newPeople.relationship = newArr.join("；")+"；";

                Vue.set(this.peoples,this.upDatePeopelIndex,JSON.parse(JSON.stringify(this.newPeople)));
                this.resetNewPeople();
                this.isupdatePeople = false;
                this.dialogFormVisible = false;
            },
            resetPeople(){
                this.resetNewPeople();
                this.dialogFormVisible = false;
                this.isupdatePeople = false;
            },
            editPeople(item,index){
                var _this = this;
                _this.upDatePeopelIndex = index;

                var arr = item.relationship.slice(0,-1).split("；");
                if(arr.length>0){
                    _this.relationArr.splice(0,1);
                    $.each(arr,function(i,n){
                        _this.relationArr.push({
                            name: n.split("，")[0],
                            relationShip: n.split("，")[1]
                        });
                    });
                }
                
                
                this.newPeople = JSON.parse(JSON.stringify(item));
                this.dialogFormVisible = true;
                this.isupdatePeople = true;
            },
            delPeople(item,index){
                this.peoples.splice(index,1);
            },
            resetNewPeople(){
                this.newPeople = {
                    name: '',
                    relationship: '',
                    characters: '',
                    titles: '',
                };
                this.relationArr = [
                    {
                        name: '',
                        relationShip: ''
                    }
                ],
                this.$refs["peopleform"].resetFields();
            },
            addSth(){
                Vue.set(this.things,this.things.length, JSON.parse(JSON.stringify(this.newSth)));
                this.resetSth();
            },
            resetSth(){
                this.$refs["sthForm"].resetFields();
                this.dialogSthVisible = false;
                this.isupdateSth = false;
            },
            editSth(item,index){
                this.upDateSthIndex = index;
                this.newSth = JSON.parse(JSON.stringify(item));
                this.dialogSthVisible = true;
                this.isupdateSth = true;
            },
            updateSth(){
                Vue.set(this.things,this.upDateSthIndex,JSON.parse(JSON.stringify(this.newSth)));
                this.resetSth();
                this.isupdatePeople = false;
            },
            delSth(item,index){
                this.things.splice(index,1);
            },
            finish(){
                var _this = this;
                var obj = {
                    people: []
                };
               for(var i=0;i<this.peoples.length;i++){
                    var arr = [];
                    var tmp =  this.peoples[i].relationship;
                    var tmparr = tmp.split("；");
                    for(var j=0;j<tmparr.length-1;j++){
                        var tmpObj = {};
                        tmpObj.realtion = tmparr[j].split("，")[0]
                        tmpObj.being = tmparr[j].split("，")[1]
                        arr.push(tmpObj);
                    }
                    this.peoples[i].relationship = arr;
                }
                obj.people = this.peoples;
                this.$axios.post(this.basic_url+'/api/info/add',{
                    "bookid": this.bookid,
                    "chapterabstract": this.bookabstract,
                    "charactersetting": JSON.stringify(obj) 
                }).then((res) => {
                    if(res.data.code==1){
                        //新增失败但是实际新增成功
                        _this.innerVisible = true;
                    }else{
                        _this.innerVisible = true;
                    }
                }).catch((err) => {
                    
                })
            },
            closePeople(){
                this.peopleInfoVisible = false;
            }
        },
        mounted(){
            $("#first").show();
            $("#second").hide();
            $("ul.tabList li:nth-child(1)").css("background","#fff");
            $("ul.tabList li:nth-child(2)").css("background","#F3F6FA");

            this.getParams();
            this.$axios.post(this.basic_url+'/api/info/query',{
                "bookid": this.bookid,
            } ).then((res) => {
                if(res.data.length>0){
                    this.bookabstract = res.data[0]._source.bookabstract;
                    this.abstracteid = res.data[0]._id;
                }
            }).catch((err) => {
            
            })
            this.$axios.post(this.basic_url+'/api/character/query',{
                "bookid": this.bookid,
            } ).then((res) => {
                if(res.data.length>0){
                    var jsonObj = eval('(' + res.data[0]._source.charactersetting + ')');
                    if(!jsonObj.people){
                        this.peoples = [];
                    }else{
                        for(var m=0;m<jsonObj.people.length;m++){
                            var relationStr = '';
                            var relation = jsonObj.people[m].relationship;
                            for(var n=0;n<relation.length;n++){
                                relationStr+=relation[n].realtion+"，"+relation[n].being+"；";
                            }
                            jsonObj.people[m].relationship = relationStr
                        }
                        this.peoples = jsonObj.people;
                    }
                    this.peopleeid = res.data[0]._id;
                }
            }).catch((err) => {
            
            })
        },
        data () {
            return {
                basic_url: Config.api,
                isShowRelation: false,
                abstracteid: '',
                peopleeid:'',
                //事件设定
                person: require('../assets/img/person.png'),
                dialogSthVisible: false,
                newSth:{
                    name:'',
                    times:'',
                    position:'',
                    people:''
                },
                things:[],
                isupdateSth: false,
                upDateSthIndex: 1,

                isupdatePeople: false,
                bookid: 1,
                updateBook: false,
                active: 0,
                activeName: 'first',
                eid: "",
                upDatePeopelIndex: 1,
                //故事大纲
                bookabstract: '',
                //人物设定
                peoples:[
                ],
                dialogFormVisible: false,
                innerVisible: false,
                peopleInfoVisible: false,
                peopleInfo: {
                    name: '',
                    relationship: '',
                    character: '',
                    title: '',
                },
                newPeople: {
                    name: '',
                    relationship: '',
                    characters: '',
                    titles: '',
                },

                relationArr:[
                    {
                        name: '',
                        relationShip: ''
                    }
                ],
                rules:{
                    name:[
                        { required: true, message: '必填', trigger: 'blur' },
                    ],
                }
            }
        },
        components: {
            'v-header': Header
        }
    }
</script>
<style scoped>
.bookAbstract{
    display: block;
    font-size: 18px;
    height: 50px;
    line-height: 50px;
}
.btndiv{
    width: 100%;
    padding-top: 25px;
    text-align: center;
}
.btndiv button{
    margin-left: 20px;
    margin-right: 20px;
    letter-space: 2em;
}
.relationInput{
    width: 120px;
}
.peopleInfo{
    width: 100%;
    background: #fff;
    margin-top: 20px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 5px;
    padding-right: 5px;
}
.tip{
    text-align: left;
    font-size: 8px;
    margin-top: -10px;
}

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
.d3PeopleInfo{
    width: 350px;
    border: 2px solid #ccc;
    padding: 10px;
    padding-top: 30px;
    background: #fff;
    position: absolute;
    z-index: 1000;
}
.el-icon-close{
    float: right;
    display: block;
    margin-top: -20px;
    margin-bottom: 10px;
    cursor: pointer;
}
.itembtn{
    float: right;
}
.itembtn i{
    font-size: 18px;
    coursor: pointer;
}
.tabBox{
    width: 100%;
}
.tabBox .el-tabs__nav-wrap{
    padding-left: 100px; 
    padding-top: 30px; 
    padding-right: 100px; 
    box-sizing: box-border; 
}
.abstract{
    padding-left: 100px;
    padding-right: 100px;
    box-sizing: box-border;
}
.abstract p{
    text-align: left;
    height:22px;
    font-size:13px;
    color:rgba(151,163,180,1);
    line-height:22px;
    margin-top: 60px;
    margin-bottom: 20px;
}
.abstract textarea{
    width: 100%;
    height: 300px;
    margin: 0 auto;
}
.person{
    min-height: 500px;
}
.index-box{
    width: 32px;
    height: 32px;
    border: 1px solid #0064FF;
    text-align: center;
    color: #0064FF;
    font-size: 15px;
    display: block;
    line-height: 32px;
}
p.title{
    height:20px;
    font-size:15px;
    color:rgba(0,34,87,1);
    line-height:21px;
    text-align: left;
}
p.charact{
    height:20px;
    font-size:13px;
    color:rgba(151,163,180,1);
    line-height:22px;
    text-align: left;
}
.btnGrounp{
    text-align: center;
}
.btnGrounp button{
    width: 45%;
}
.navTxt{
    width: 100%;
    height: 65px;
    background:rgba(243,246,250,1);
    padding-left: 100px;
    padding-right: 100px;
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
.relationDiv{
    padding-bottom: 10px;
}
.relationDiv label{
    display: block;
    float: left;   
}
.relationDiv .el-input{
    width: 120px;
}
.relationDiv .el-input__inner{
    width: 100%;
}
.addRelation{
    position: absolute;
    top: -50px;
    right: 0px;
}
</style>