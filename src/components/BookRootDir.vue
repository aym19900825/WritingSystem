<template>
    <div id="bookdirectory">
        <v-header></v-header>
        <p class="navTxt">
            剧集目录
            <span class="returnList"><router-link :to="{path:'/booklist'}">返回我的作品</router-link></span>
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
            <!--
                <el-button type="success" class="newChapter" @click="addChapter">写新场次</el-button>
            -->
            <el-button type="success" class="newChapter" @click="showAddEpisode">写新的集</el-button>
        </el-row>
        <el-table :data="tableData" style="width: 85%;margin: 0 auto;">
            <el-table-column label="剧集" width="80">
                <template slot-scope="scope">
                    <span>第{{ scope.row.episodenumber }}集</span>
                </template>
            </el-table-column>
            <el-table-column prop="episodename" label="名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" width="300">
              <template scope="scope">
                <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">查看场次</el-button>
                <el-button size="small" type="primary" @click="showUpdate(scope.$index, scope.row)">编辑</el-button>
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


         <el-dialog title="集信息" :visible.sync="episodeDialogVisible" width="35%" id="episodeDialog" :before-close="resetEpisode">
            <el-form ref="form" :model="newEpisode" label-width="80px" label-position="top" style="border-top:1px solid rgba(233,235,242,1);">
                <el-form-item label="序列号" prop="episodenumber">
                     <el-input  v-model="newEpisode.episodenumber"></el-input>
                 </el-form-item>
                <el-form-item label="名称" prop="episodename">
                    <el-input v-model="newEpisode.episodename"  placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item class="btnGrounp">
                    <el-button type="primary" @click="addEpisode" v-show="!isupdateEpisode">添加</el-button>
                    <el-button type="primary" @click="updateEpisode" v-show="isupdateEpisode">更新</el-button>
                    <el-button @click="resetEpisode" type="info">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
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
                this.$router.push({
                    path: '/bookdir', 
                    name: 'BookDir',
                    query: { 
                        bookid: row.bookid,
                        episodeid: row.episodeid,
                        bookname: this.bookname,
                        episodenumber: row.episodenumber
                    }
                })
            },

            //删除章节
            handleDelete(index,row){
                var url = this.basic_url+'/api/episode/delete';
                this.$confirm('确定删除此集吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({ value }) => {
                        this.$axios.post(url,{
                            episodeid: row.episodeid
                        }).then((res)=>{
                            this.init();
                        }).catch((err)=>{
                            this.$message({
                                type: 'error',
                                message: '网络错误，请重试',
                                showClose: true
                            })
                        })
                        
                    }).catch(() => {

                });
            }, 
            //修改章节号码
            editNum(index,row){
                console.log(row);
            },

            addChapter(){
                sessionStorage.setItem('url','booklist');
                this.$router.push({
                    path: '/edit', 
                    name: 'Edit',
                    query: { 
                        bookid: this.bookid,
                        bookname: this.bookname,
                        isNew: true
                    }
                })
            },
            getParams () {
                let bookid = this.$route.query.bookid;
                let bookname = this.$route.query.bookname;
                this.bookid = bookid;
                this.bookname = bookname;
            },
            init(){
                var url = this.basic_url + '/api/episode/list';
                this.$axios.post(url,{
                    bookid: this.bookid,
                    page_index: this.currentPage,
                    page_size: this.pagesize
                }).then((res)=>{
                    if(res.data.total > 0){
                        this.tableData = res.data.episodes;
                        this.bookdesc = res.data.description;
                    }else{
                        this.tableData = [];
                        this.bookdesc = res.data.description;
                    }
                    this.totalCount = res.data.total;
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
            },

            showAddEpisode(){
                var url = this.basic_url + '/api/episode/count';
                this.$axios.post(url,{
                    "bookid": this.bookid
                }).then((res) => {
                    if(res.data.code == 1){
                         this.newEpisode.episodenumber = res.data.next_episode;
                    }
                    this.isupdateEpisode = false;
                    this.episodeDialogVisible = true;
                }).catch((err) => {
                    this.$message({
                        type: 'error',
                        message: '网络错误，请重试',
                        showClose: true
                    })
                })

            },

            addEpisode(){
                var url = this.basic_url + '/api/episode/add';
                console.log(url);
                this.$axios.post(url,{
                    "episodename": this.newEpisode.episodename,
                    "episodenumber": this.newEpisode.episodenumber,
                    "bookid": this.bookid
                }).then((res) => {
                    if(res.data.code != 1){
                        this.$message({
                            type: 'error',
                            message: '新增失败',
                            showClose: true
                        })
                    }
                    this.resetEpisode();
                    this.init();
                }).catch((err) => {
                    this.$message({
                        type: 'error',
                        message: '网络错误，请重试',
                        showClose: true
                    })
                })
            },

            showUpdate(index,row){
                this.updateid = row.episodeid;
                this.newEpisode = JSON.parse(JSON.stringify(row));
                this.isupdateEpisode = true;
                this.episodeDialogVisible = true;
            },

            updateEpisode(){
                var url = this.basic_url + '/api/episode/edit';
                this.$axios.post(url,{
                    "episodename": this.newEpisode.episodename,
                    "episodenumber": this.newEpisode.episodenumber,
                    "episodeid": this.updateid
                }).then((res) => {
                    if(res.data.code != 1){
                        this.$message({
                            type: 'error',
                            message: '新增失败',
                            showClose: true
                        })
                    }
                    this.resetEpisode();
                    this.init();
                }).catch((err) => {
                    this.$message({
                        type: 'error',
                        message: '网络错误，请重试',
                        showClose: true
                    })
                })
            },

            resetEpisode(){
                this.episodeDialogVisible = false;
                this.newEpisode = {
                    episodenumber: 1,
                    episodename: ""
                };
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

                updateid: 1,
                isupdateEpisode: false,
                episodeDialogVisible: false,
                newEpisode:{
                    episodenumber: 1,
                    episodename: ""
                },

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
.btnGrounp{
    text-align: center;
}
.btnGrounp button{
    padding-left: 87px;
    padding-right: 87px;
}
</style>