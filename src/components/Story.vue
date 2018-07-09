<template>
    <div class="main">
        <v-header></v-header>
        <div class="tabBox">
            <el-tabs type="border-card" v-model="activeName">
                <el-tab-pane label="故事大纲" disabled style="font-size:24px;" name="title">故事大纲</el-tab-pane>
                <el-tab-pane label="故事简介" name="abstract">
                    <div class="abstract">
                        <p>故事简介</p>
                        <textarea></textarea>
                        <el-button type="primary" style="margin: 0 auto;position: relative;left: 50%;margin-left: -100px;padding: 15px 50px;margin-top: 50px;">保存</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="人物设定" name="person">
                    <div class="person">
                        <el-button type="primary" style="float: right; margin-right: 100px;margin-top: 20px;margin-bottom: 20px;">添加人物</el-button>
                        <el-table :data="peoples" style="width: 85%;margin: 0 auto;"  :row-class-name="tableRowClassName">
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
                                    <el-button type="success" icon="edit" size="mini" @click="editPeople(item,index)">编辑</el-button>
                                    <el-button type="danger" icon="delete" size="mini" @click="delPeople(item,index)">删除</el-button>
                                </template>
                             </el-table-column>
                       </el-table>
                       <el-row style="text-align: center;margin-top: 30px;">
                            <el-button type="primary">保存</el-button>
                            <el-button type="primary" plain>人物图谱</el-button>
                       </el-row>

                    </div>
                </el-tab-pane>
                <el-tab-pane label="事件设定" name="sth">事件设定</el-tab-pane>
            </el-tabs>
            <el-dialog title="人物信息" :visible.sync="dialogFormVisible"  :rules="rules" :before-close="handleClose" width="35%">
                <el-form ref="form" :model="newPeople" label-width="80px" label-position="top" style="border-top:1px solid rgba(233,235,242,1);">
                    <el-form-item label="姓名" prop="name">
                         <el-input  v-model="newPeople.name"></el-input>
                     </el-form-item>
                    <el-form-item label="身份特征" prop="titles">
                        <el-input type="textarea" :rows="2" v-model="newPeople.titles"  placeholder="请输入人物身份特征"></el-input>
                    </el-form-item>
                    <el-form-item label="性格特点" prop="characters">
                        <el-input type="textarea" :rows="2" v-model="newPeople.characters"  placeholder="请输入人物性格特点"></el-input>
                    </el-form-item>
                    <el-form-item label="人物关系" prop="relationship">
                        <el-input type="textarea" :rows="2" v-model="newPeople.relationship"  placeholder="请输入人物关系"></el-input>
                         <p class="tip">人物关系格式如下：父亲，XXX；母亲，XXX；</p>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addPeople" v-show="!isupdatePeople">立即创建</el-button>
                        <el-button type="primary" @click="updatePeople" v-show="isupdatePeople">更新</el-button>
                        <el-button @click="resetPeople">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    import Header from './common/Header.vue'
    import Vue from 'vue'
    export default {
        name: 'Story',
        methods: {
            handleCloseStory(){
                this.returnBookList();
            },
            handleClose(){
                this.resetPeople();
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
                var width = 700;
                var height = 400;
                var img_w = 20;
                var img_h = 20;
                var _this = this;
                d3.select("svg").remove();

                var svg = d3.select("#chart").append("svg:svg")
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
                                            console.log(d);
                                            console.log(i);
                                            _this.peopleInfo = JSON.parse(JSON.stringify(d));
                                            $(".d3PeopleInfo").offset({top: d.py+400, left: d.px+60})
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
            },
            characterMap(){
                this.d3Init("http://203.93.173.179:8888/api/char_graph_search",this.eid);
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
                this.$axios.post('http://203.93.173.179:8888/api/info/edit',{
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
                Vue.set(this.peoples,this.peoples.length, JSON.parse(JSON.stringify(this.newPeople)));
                this.resetPeople()
            },
            updatePeople(){
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
                this.upDatePeopelIndex = index;
                this.newPeople = JSON.parse(JSON.stringify(item));
                this.dialogFormVisible = true;
                this.isupdatePeople = true;
            },
            delPeople(item,index){
                this.peoples.splice(index,1);
            },
            resetNewPeople(){
                this.$refs["form"].resetFields();
            },
            addSth(){
                Vue.set(this.things,this.things.length, JSON.parse(JSON.stringify(this.newSth)));
                console.log("addSth");
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
                this.$axios.post('http://203.93.173.179:8888/api/info/add',{
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
            handleClick(tab, event) {
                console.log(tab, event);
            },
            next() {
                if (this.active++ > 2) this.active = 0;
                switch(this.active)
                    {
                    case 0:
                        this.activeName = 'first';
                        this.peopleInfoVisible = false;
                        break;
                    case 1:
                        this.activeName = 'second';
                        this.peopleInfoVisible = false;
                        break;
                    default:
                        this.activeName = 'third';
                        this.peopleInfoVisible = false;
                    }
            },
            pre() {
                this.active = this.active-1;
                if ( this.active < 0 ) this.active = 0;
                switch(this.active)
                    {
                    case 0:
                        this.activeName = 'first';
                        this.peopleInfoVisible = false;
                        break;
                    case 1:
                        this.activeName = 'second';
                        this.peopleInfoVisible = false;
                        break;
                    default:
                        this.activeName = 'third';
                        this.peopleInfoVisible = false;
                    }
            },
            closePeople(){
                this.peopleInfoVisible = false;
            }
        },
        mounted(){
            $(".el-tabs__nav-wrap").css("paddingTop","20px");
            $(".el-tabs__nav-wrap").css("paddingLeft","100px");
            $(".el-tabs__nav-wrap").css("paddingRight","100px");
            $(".el-tabs__nav-wrap").css("boxSizing","boxBorder");
            this.getParams();
            this.$axios.post('http://203.93.173.179:8888/api/info/query',{
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

                    $(".el-tabs__nav-wrap").attr("padd");
                }else{
                    this.updateBook = false;
                }
            }).catch((err) => {
            
            })
        },
        data () {
            return {
                activeName:'abstract',
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
                dialogFormVisible: true,
                innerVisible: false,
                peopleInfoVisible: true,
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
</style>