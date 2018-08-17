<template>
    <div id="bookdirectory">
        <v-header></v-header>
        <p class="navTxt">
            场次目录----第{{episodenumber}}集
            <span class="returnList" @click="returnRoot" style="color: #00BAFC;font-size: 13px;cursor: pointer;">返回集数</span>
            <i class="icon-back" @click="returnPre"></i>
        </p>
        <div class="bookinfo">
            <img src="../assets/img/img-book01.png" alt=""/>
            <div class="bookinfoTxt">
                <h4>{{bookname}}</h4>
                <p :title="bookdesc">作品简介：{{bookdesc}}</p>
            </div>
        </div>
        <el-row>
            <el-button type="success" class="newChapter" @click="addChapter">写新场次</el-button>
        </el-row>
        <el-table :data="tableData" style="width: 85%;margin: 0 auto;">
            <el-table-column label="场次" width="80">
                <template slot-scope="scope">
                    <span>第{{ scope.row.scenenumber }}场</span>
                </template>
            </el-table-column>
            <el-table-column prop="scenename" label="名称" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="sceneabstract" label="场次大纲" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="完成时间" width="200">
                <template slot-scope="scope">
                    <span>{{ scope.row.edit_date }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template scope="scope">
                <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
        </el-table>
       
        <div align="right" class="pagecontrol">
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
    </div>
</template>

<script>
    import Config from '../config.js'
    import Header from './common/Header.vue'
    export default {
        name: 'BookDirectory',
        methods: {
            returnPre(){
                sessionStorage.setItem('url','login');
                this.$router.push({
                    path: '/edit', 
                    name: 'Edit',
                })
            },

            //加载数据
            loadData(pageNum, pageSize){                    
                alert("数据加载中...");       
            },

            //每页显示数据量变更
            handleSizeChange(val){
                this.pagesize = val;
                this.loadData(this.currentPage, this.pagesize);
            },

            //页码变更
            handleCurrentChange(val){
                this.currentPage = val;
                this.loadData( this.currentPage, this.pagesize);
            },

            //编辑
            handleEdit(index,row){
                sessionStorage.setItem('url','bookdirectory');
                this.$router.push({
                    path: '/editsoap', 
                    name: 'EditSoap',
                    query: { 
                        bookid: this.bookid,
                        bookname: this.bookname,
                        episodeid: this.episodeid,
                        eid: row.eid,
                        isNew: true
                    }
                })
            },

            //删除章节
            handleDelete(index,row){
                var url = this.basic_url+'/api/scene/delete';
                this.$confirm('确定删除此场次吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({ value }) => {
                        this.$axios.post(url,{
                            eid: row.eid
                        }).then((res)=>{
                            if(res.data.code==1){
                                setTimeout(()=>{
                                    this.init();
                                },3000);
                                
                            }
                            else{
                                this.$message({
                                    type: 'error',
                                    message: '网络错误，请重试',
                                    showClose: true
                                })
                            }
                            
                        }).catch((err)=>{
                            
                        })
                        
                    }).catch(() => {

                });
            }, 
            addChapter(){
                sessionStorage.setItem('url','booklist');
                console.log(this.episodeid);
                this.$router.push({
                    path: '/editsoap', 
                    name: 'EditSoap',
                    query: { 
                        bookid: this.bookid,
                        bookname: this.bookname,
                        episodeid: this.episodeid,
                        isNew: true
                    }
                })
            },
            getParams () {
                let bookid = this.$route.query.bookid;
                let bookname = this.$route.query.bookname;
                let episodeid = this.$route.query.episodeid;
                let episodenumber = this.$route.query.episodenumber;

                console.log(episodenumber);

                this.bookid = bookid;
                this.bookname = bookname;
                this.episodeid = episodeid;
                this.episodenumber = episodenumber;
            },
            returnRoot(){
                this.$router.push({
                    path: '/bookrootdir', 
                    name: 'BookRootDir',
                    query: { 
                        bookid: this.bookid,
                        bookname: this.bookname
                    }
                })
            },
            init(){
                var url = this.basic_url + '/api/scene/list';
                this.$axios.post(url,{
                    bookid: this.bookid,
                    page_index: this.currentPage,
                    page_size: this.pagesize,
                    episodeid: this.episodeid
                }).then((res)=>{
                    if(res.data.total>0){
                        this.totalCount = res.data.total;
                        var arr = [];
                        var tmpData = res.data.data;
                        var tmpObj = {};
                        for(let i=0,len=tmpData.length;i<len;i++){
                            tmpObj = tmpData[i]._source;
                            tmpObj.eid = tmpData[i]._id;
                            arr.push(tmpObj);
                        }
                        this.tableData = arr;
                        this.bookdesc = res.data.description;
                    }else{
                        this.tableData = [];
                        this.totalCount = 0;
                        this.bookdesc = res.data.description;
                    }
                }).catch((err)=>{
                    
                })
            },
            handleSizeChange(val) {
                this.pagesize = val;
                this.init();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.init();
            }
        },
        data () {
            return{
                bookid:1,
                tableData: [],
                bookname:"",
                bookdesc:"",
                basic_url: Config.api,

                //page信息
                pagesize: 10,
                totalCount: 100,
                currentPage: 1,

                episodenumber: 1

            }
        },
        created(){
            this.getParams();
            this.init();
        },
        components: {
            'v-header': Header
        }
    }
</script>
<style scoped>
.navTxt{
    height: 56px;
    line-height: 65px;
    padding: 0px 100px;
    background:rgba(243,246,250,1);
    font-size: 18px;
    color:rgba(170,178,192,1);
    text-align: left;
}
.navTxt button{
    float: right;
    margin-top: 10px;
}
.navTxt i{
    width: 13px;
    height: 13px;
    float: right;
    margin-top: 23px;
    color: #00BAFC;
    margin-right: 10px;
    cursor: pointer;
}
.infoContent{
    padding: 0px 100px;
}
.infoContent h2{
    font-size:27px;
    height: 100px;
    line-height: 100px;
    color:rgba(55,57,76,1);
}
p.inputTip{
    text-align: right;
    color: #AAB2C0;
    font-size:13px;
}
.dialog-footer button{
    float: right;
    width: 180px;
    height: 40px;
    margin-bottom: 40px;
}
.returnList{
    display: block;
    float: right;
}
.returnList a{
    color: #00BAFC;
    font-size: 13px;
    cursor: pointer;
}
.bookinfo{
    height: 98px;
    margin-top: 10px;
    padding: 0px 100px;
}
.bookinfo img,.bookinfo .bookinfoTxt{
    display: block;
    float: left;
}
.bookinfo .bookinfoTxt{
   margin-left: 20px; 
}
.bookinfo img{
    width: 70px;
    height: 95px;
}
.bookinfo h4{
    height:38px;
    font-size:27px;
    font-family:PingFangSC-Light;
    color:rgba(55,57,76,1);
    line-height:38px;
    font-weight:normal;
}
.bookinfo .bookinfoTxt p{
    width:380px;
    height:40px;
    font-size:14px;
    color:rgba(116,125,140,1);
    line-height:20px;
    margin-top: 10px;
    text-align: left;
}
.newChapter{
    margin-right: 100px;
    display: block;
    float: right;
    margin-bottom: 10px;
}
.pagecontrol{
    padding-bottom: 100px;
    padding-top: 20px;
}
.bookinfoTxt p{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis; 
}
</style>