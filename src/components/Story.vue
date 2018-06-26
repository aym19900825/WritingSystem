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
                        </el-card>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg" justify="center" v-for="(item,index) in peoples" :key="item">
                    <div class="peopleInfo">{{item.name}},{{item.position}},{{item.character}}</div> 
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
                <el-input type="textarea" :rows="2" v-model="newPeople.position"  placeholder="请输入人物身份特征"></el-input>
              </el-form-item>
              <el-form-item label="性格特点">
                <el-input type="textarea" :rows="2" v-model="newPeople.character"  placeholder="请输入人物性格特点"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="addPeople">立即创建</el-button>
                <el-button>取消</el-button>
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
            resetNewPeople(){
                this.newPeople = {
                    name: '',
                    relation: '',
                    character: '',
                    position: ''
                }
            },
            finish(){
                var obj = {
                    people: []
                };
                obj.people = this.peoples;
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
                    this.peoples = jsonObj.people;
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
                bookid: 1,
                updateBook: false,
                active: 0,
                activeName: 'first',
                eid: "",
                //故事大纲
                bookabstract: '',
                //人物设定
                peoples:[
                     {
                        name: '张柏芝',
                        relation: 'aaaaaaa',
                        character: '性格暴躁',
                        position: '河东狮吼'
                    }
                ],
                dialogFormVisible: false,
                innerVisible: false,
                newPeople: {
                    name: '',
                    relation: '',
                    character: '',
                    position: '',
                    relation1People1: '',
                    relation1People2: '',
                    relation1: ''
                }
            }
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
.main{
    width: 85%;
    margin: 0 auto;
}
</style>