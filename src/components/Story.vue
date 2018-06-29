<template>
    <div class="main">
        <el-button class="returnPre el-icon-arrow-left el-icon--left" @click="returnPre">返回图书列表</el-button>
        <el-steps :active="active" finish-status="success">
            <el-step title="故事大纲"></el-step>
            <el-step title="人物设定"></el-step>
            <el-step title="事件设定"></el-step>
        </el-steps>
        <el-tabs v-model="activeName"  @tab-click="handleClick">
            <el-tab-pane name="first">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="16">
                        <span class="bookAbstract">故事大纲：</span>
                        <textarea rows="20" cols="120" v-model="bookabstract">
                            在w3school，你可以找到你所需要的所有的网站建设教程。
                        </textarea>
                        <el-footer class="btndiv">
                            <el-button type="primary" size="medium" @click="next">下一步</el-button>
                            <el-button size="medium">重置</el-button>
                        </el-footer>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane name="second">
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="24">
                        <el-card :body-style="{ padding: '0px' }">
                            <div style="width: 100%;height: 40px;font-size: 20px;font-weight: normal;color: #ccc;text-align: center;line-height: 40px;" @click="dialogFormVisible = true">
                                +
                            </div>
                            <el-button type="primary" size="medium" @click="characterMap"  v-show="updateBook">人物图谱</el-button>
                            <div id="chart"></div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg" justify="center" v-for="(item,index) in peoples" :key="item">
                    <div class="peopleInfo" @click="editPeople(item)">{{item.name}},{{item.titles}},{{item.characters}},({{item.relationship}})</div> 
                </el-row>
                <el-footer class="btndiv">
                    <el-button type="primary" size="medium" @click="next">下一步</el-button>
                    <el-button size="medium" @click="pre">上一步</el-button>
                </el-footer>
            </el-tab-pane>
            <el-tab-pane name="third">
                <el-footer class="btndiv">
                    <el-button type="primary" size="medium" @click="finish" v-show="!updateBook">完成</el-button>
                    <el-button type="primary" size="medium" @click="update" v-show="updateBook">更新</el-button>
                    <el-button size="medium" @click="pre">上一步</el-button>
                </el-footer>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="人物信息" :visible.sync="dialogFormVisible">
            <el-form ref="form" :model="newPeople"  label-width="80px">
              <el-form-item label="姓名">
                <el-input  v-model="newPeople.name"></el-input>
              </el-form-item>
              <el-form-item label="身份特征">
                <el-input type="textarea" :rows="2" v-model="newPeople.titles"  placeholder="请输入人物身份特征"></el-input>
              </el-form-item>
              <el-form-item label="性格特点">
                <el-input type="textarea" :rows="2" v-model="newPeople.characters"  placeholder="请输入人物性格特点"></el-input>
              </el-form-item>
              <el-form-item label="人物关系">
                <el-input type="textarea" :rows="2" v-model="newPeople.relationship"  placeholder="请输入人物关系"></el-input>
                <p class="tip">人物关系格式如下：父亲，XXX；母亲，XXX;</p>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="addPeople" v-show="!isupdatePeople">立即创建</el-button>
                <el-button type="primary" @click="updatePeople" v-show="isupdatePeople">更新</el-button>
                <el-button @click="resetPeople">取消</el-button>
              </el-form-item>
            </el-form>
        </el-dialog>
        <el-dialog  width="30%"  title="创建成功" :visible.sync="innerVisible"  append-to-body>
            <P class="congratulation" v-show="!updateBook">恭喜您！创建成功！</P>
            <P class="congratulation" v-show="updateBook">恭喜您！更新成功！</P>
            <el-button type="primary" @click="returnEdit" style="margin-left: 130px;margin-top: 20px;">返回编辑章节</el-button>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: 'Story',
        methods: {
            returnPre(){
                this.$router.replace('/booklist');
            },
            getParams () {
                let bookid = this.$route.query.bookid;
                this.bookid = bookid;
            },
            d3Init(url,queryParam){
                var width = 400;
                var height = 400;
                var img_w = 20;
                var img_h = 20;
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
                .send("POST", JSON.stringify({eid: queryParam}));
            },
            characterMap(){
                this.d3Init("http://192.168.1.168:8888/api/char_graph_search","u5F6QGQBEBnYWdPIqZUv");
            },
            returnEdit(){
                this.$router.push({
                    path: '/edit', 
                    name: 'Edit',
                    query: { 
                        bookid: this.bookid,
                        isNew: true
                    }
                })
            },
            update(){
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
                this.$axios.post('http://192.168.1.168:8888/api/info/edit',{
                    "bookid": this.bookid,
                    "chapterabstract": this.bookabstract,
                    "charactersetting": JSON.stringify(obj),
                    "eid":  this.eid
                } ).then((res) => {
                    this.innerVisible = true;
                }).catch((err) => {
                
                })
            },
            addPeople(){
                Vue.set(this.peoples,this.peoples.length, this.newPeople);
                this.dialogFormVisible = false;
                this.resetNewPeople();
            },
            updatePeople(){
                var index = 1;
                for(var i=0;i<this.peoples.length;i++){
                    if(this.peoples[i].name == this.newPeople.name){
                        index=i;
                    }
                }
                Vue.set(this.peoples,index,this.newPeople);
                this.resetNewPeople();
                this.isupdatePeople = false;
                this.dialogFormVisible = false;
            },
            resetPeople(){
                this.resetNewPeople();
                this.dialogFormVisible = false;
                this.isupdatePeople = false;
            },
            editPeople(item){
                this.newPeople.name = item.name;
                this.newPeople.relationship = item.relationship;
                this.newPeople.characters = item.characters;
                this.newPeople.titles = item.titles;
                this.dialogFormVisible = true;
                this.isupdatePeople = true;
            },
            resetNewPeople(){
                this.newPeople = {
                    name: '',
                    relationship: '',
                    characters: '',
                    titles: ''
                }
            },
            finish(){
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
                console.log(obj.people);
                this.$axios.post('http://192.168.1.168:8888/api/info/add',{
                    "bookid": this.bookid,
                    "chapterabstract": this.bookabstract,
                    "charactersetting": JSON.stringify(obj) 
                }).then((res) => {
                    if(res.data.code==1){
                        this.innerVisible = true;
                    }else{

                    }
                }).catch((err) => {
                    
                })
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            next() {
                if (this.active++ > 2) this.active = 0;
                switch(this.active)
                    {
                    case 0:
                        this.activeName = 'first';
                        break;
                    case 1:
                        this.activeName = 'second';
                        break;
                    default:
                        this.activeName = 'third';
                    }
            },
            pre() {
                this.active = this.active-1;
                if ( this.active < 0 ) this.active = 0;
                switch(this.active)
                    {
                    case 0:
                        this.activeName = 'first';
                        break;
                    case 1:
                        this.activeName = 'second';
                        break;
                    default:
                        this.activeName = 'third';
                    }
            },
        },
        mounted(){
            this.getParams();
            this.$axios.post('http://192.168.1.168:8888/api/info/query',{
                "bookid": this.bookid,
            } ).then((res) => {
                if(res.data.length>0){
                    this.bookabstract = res.data[0]._source.chapterabstract;
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
                    this.eid = res.data[0]._id;
                    this.updateBook = true;
                    console.log(this.updateBook);
                }else{
                    this.updateBook = false;
                }
            }).catch((err) => {
            
            })
        },
        data () {
            return {
                isupdatePeople: false,
                bookid: 1,
                updateBook: false,
                active: 0,
                activeName: 'first',
                eid: "",
                //故事大纲
                bookabstract: '',
                //人物设定
                peoples:[
                ],
                dialogFormVisible: false,
                innerVisible: false,
                newPeople: {
                    name: '',
                    relationship: '',
                    characters: '',
                    titles: '',
                }
            }
        }
    }
</script>
<style scoped>
#chart{
    width: 500px;
    height: 500px;
}
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
.main{
    width: 85%;
    margin: 0 auto;
}
.tip{
    text-align: left;
    font-size: 8px;
    margin-top: -10px;
}
</style>