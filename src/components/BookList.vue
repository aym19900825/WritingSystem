<template v-cloak>
    <div id="booklist">
        <v-header></v-header>
        <p class="navTxt">
            我的作品
            <el-button type="primary" v-if="books" @click="creatWork">创建作品</el-button>
        </p>
        <div class="emptyContent" style="display:none;">
            <img src="../assets/img/empty-bg.png" alt="">
            <p>对不起，您还没有创建任何的作品哦！</p>
            <el-button type="primary" @click="creatWork">创建作品</el-button>
        </div>
        <div class="bookList" v-if="books.length > 0">
            <el-table :data="books" style="width: 85%;margin: 0 auto;">
                <el-table-column label="书名" width="200" prop="bookname" :show-overflow-tooltip="true">
                </el-table-column>
                <el-table-column label="作品类别" width="100">
                    <template slot-scope="scope">
                        <span v-text="scope.row.category"></span>
                    </template>
                </el-table-column>
                <el-table-column label="最新编辑章节/场次" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span style='color: #409EFF;cursor: pointer;'' v-if="scope.row.scenenumber&&scope.row.category=='电视剧剧本'"  @click="editNew(scope.$index, scope.row)">第{{scope.row.episodenumber}}第{{scope.row.scenenumber}}场：{{scope.row.currentedit}}
                        </span>
                        <span style='color: #409EFF;cursor: pointer;' v-if="scope.row.scenenumber&&scope.row.category=='小说'" @click="editNew(scope.$index, scope.row)">第{{scope.row.scenenumber}}章：{{scope.row.currentedit}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="80" prop="bookstatus">
                </el-table-column>
                <el-table-column label="创建时间" width="180">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createtime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="480">
                    <template slot-scope="scope">
                        <!--
                            <el-button size="mini" @click="addChapter(scope.$index, scope.row)" type="success" v-if="scope.row.category=='小说'">写新章节</el-button>
                        -->
                        <!--
                            <el-button size="mini" @click="addChapter(scope.$index, scope.row)" type="success" v-if="scope.row.category!='小说'">写新场次</el-button>
                        -->
                        <el-button size="mini" @click="readStory(scope.$index, scope.row)">故事大纲</el-button>
                        <el-button size="mini" type="primary" @click="readBook(scope.$index, scope.row)">编辑作品</el-button>
                        <el-button size="mini" @click="bookDirect(scope.$index, scope.row)" class="bookdirect" v-if="scope.row.category=='小说'">查看目录</el-button>
                        <el-button size="mini" @click="soapDirect(scope.$index, scope.row)" class="bookdirect" v-if="scope.row.category!='小说'">查看目录</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
        </div>
        <el-dialog title="提示" :visible.sync="dialogPerson" width="30%"
          :before-close="handleClosePerson">
            <p class="warn">您的个人信息尚未完善，无法创建作品</p>
            <p class="tip"><router-link :to="{path:'/personinfo'}">马上完善个人信息</router-link></p>
        </el-dialog>
    </div>
</template>

<script>
    import Header from './common/Header.vue'
    import Config from '../config.js'
    export default {
        data(){
            var validateWriting = (rule, value, callback) => {
                if(value.length >1000){
                    callback(new Error('长度在 0 到 1000个字符'));
                }else {
                  callback();
                }
            };
            var validateAbstract = (rule, value, callback) => {
                if(value.length <= 0){
                    callback(new Error('必填'));
                }else if(value.length > 1000){
                    callback(new Error('长度在 0 到 1000个字符'));
                }else{
                    callback();
                }
            };
            return{
                dialogPerson: false,

                userid: 0,
                loading: false,
                basic_url: Config.api,

                //page信息
                pagesize: 10,
                totalCount: 100,
                currentPage: 1,

                books: [],
                dialogFormVisible:false,
                innerVisible:false,
                formLabelWidth: '120px',
                upDateBook: false,
                upDateBookId: 1,

                //新增图书信息
                newBook: {
                  bookname: '',
                  category: '',
                  label: '',
                  abstract: '',
                  writing: '',
                },
                doingWorks:[
                    
                ],
                doneWorks:[
                   
                ],
                rules:  {
                    bookname:[
                        {
                            required: true,
                            message: '必填信息',
                            trigger: 'blur',
                        },
                        { min: 1,
                          max: 15, 
                          message: '15个字符内', 
                          trigger: 'blur' 
                        }
                    ],
                    writing:[
                        {
                            validator: validateWriting, 
                            trigger: 'blur'
                        }
                    ],
                    abstract:[
                        {
                            validator: validateAbstract, 
                            trigger: 'blur'
                        }
                    ]

                }

            }
        },
        methods: {
            handleClosePerson(){
                this.dialogPerson = false;
            },
            editNew(index,row){
                sessionStorage.setItem('url','bookdirectory');
                if(row.category=='小说'){
                    this.$router.push({
                        path: '/edit', 
                        name: 'Edit',
                        query: { 
                            bookid: row.bookid,
                            bookname: row.bookname,
                            eid: row.eid
                        }
                    })
                }else{
                    this.$router.push({
                        path: '/editsoap', 
                        name: 'EditSoap',
                        query: { 
                            bookid: row.bookid,
                            bookname: row.bookname,
                            eid: row.eid
                        }
                    })
                }
                
                
            },

            handleDelete(index,row){
                this.$confirm('确定删除此作品吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({ value }) => {
                        var url = this.basic_url+'/api/deleteBook';
                        this.$axios.post(url,{
                            bookid: row.bookid
                        }).then((res)=>{
                           this.initBookList();
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
            creatWork(){
                var url = this.basic_url+'/api/validUser';
                this.$axios.post(url,{
                    userid: this.userid
                }).then((res)=>{
                    if(res.data.code==1){
                        this.$router.push({
                            path: '/bookinfo', 
                            query: { 
                                bookid: '',
                                userid: this.userid
                            }
                        })
                    }
                    if(res.data.code==0){
                        this.dialogPerson = true;
                    }
                }).catch((err)=>{
                    this.$message({
                        type: 'error',
                        message: '网络错误，请重试',
                        showClose: true
                    })
                })

                
            },
            handleCloseBookInfo(){
                this.reset();
            },
            returnPre(){
                sessionStorage.setItem('url','login');
                this.$router.push({
                    path: '/edit', 
                })
            },
            readStory(index,row){
               this.$router.push({
                    path: '/story', 
                    query: { 
                        bookid: row.bookid,
                    }
                })
            },
            edit(item) {
                sessionStorage.setItem('url','booklist');
                this.$router.push({
                    path: '/edit', 
                    query: { 
                        bookid: item.bookid,
                        bookname: item.bookname,
                        isNew: true
                    }
                })
            },
            readBook(index,row){
                this.$router.push({
                    path: '/bookinfo', 
                    query: { 
                        bookid: row.bookid,
                        bookInfo: row
                    }
                })
            },
            addChapter(index,row){
                sessionStorage.setItem('url','booklist');
                if(row.category=="小说"){
                    this.$router.push({
                        path: '/edit', 
                        query: { 
                            bookid: row.bookid,
                            bookname: row.bookname,
                            isNew: true
                        }
                    })
                }else{
                    this.$router.push({
                        path: '/editsoap', 
                        query: { 
                            bookid: row.bookid,
                            bookname: row.bookname,
                            isNew: true
                        }
                    })
                }
                
            },
            bookDirect(index,row){
                this.$router.push({
                    path: '/bookdirectory', 
                    query: { 
                        bookid: row.bookid,
                        bookname: row.bookname,
                    }
                })
            },
            soapDirect(index,row){
                this.$router.push({
                    path: '/bookrootdir', 
                    query: { 
                        bookid: row.bookid,
                        bookname: row.bookname,
                    }
                })
            },
            handleClose(){
                this.returnList();
            },
            returnList(){
                this.innerVisible = false;
                this.dialogFormVisible = false;
                this.reset();
                this.initBookList();
            },
            reset(){
                this.$refs["bookinfoForm"].resetFields();
                this.dialogFormVisible = false;
                //更新完图书基本信息后reset
                this.upDateBook = false;
                this.upDateBookId = 1;
            },
            initBookList(){
                var url = this.basic_url+'/api/bookList';
                this.$axios.post(url,{
                    userid: this.userid,
                    page_index: this.currentPage,
                    page_size: this.pagesize
                }).then((res)=>{
                    if (res.data) {
                        if(res.data.total>0){
                            this.doingWorks  = res.data.books["未完成"];
                            this.doneWorks  = res.data.books["已完成"];
                            if(this.doneWorks ==undefined){
                                this.books = res.data.books["未完成"];
                            }else if(this.doingWorks ==undefined){
                                this.books = res.data.books["已完成"];
                            }else{
                                this.books = res.data.books["已完成"].concat(res.data.books["未完成"]);
                            }
                            this.totalCount = res.data.total;
                            this.loading = true;
                        }else{
                            this.books = [];
                            $(".emptyContent").show();
                        }
                        
                    }else {
                        this.$message({
                            type: 'error',
                            message: '暂时没有数据',
                            showClose: true
                        })
                    }
                }).catch((err)=>{
                    
                })
            },
            handleSizeChange(val) {
                this.pagesize = val;
                this.initBookList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.initBookList();
            }
        },
        created(){
           this.userid = sessionStorage.getItem('userid')
           this.initBookList();
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
.emptyContent{
    padding-top: 100px;
}
.emptyContent img{
    width: 127px;
    height: 135px;
    position: absolute;
    left: 50%;
    margin-left: -64px;
}
.emptyContent p{
    width: 100%;
    height: 22px;
    font-size: 16px;
    color: rgba(170,178,192,1);
    line-height: 22px;
    text-align: center;
    margin-top: 160px;
}
.emptyContent button{
    width:200px;
    height:40px;
    background:rgba(17,175,248,1);
    border-radius:4px;
    font-size:14px;
    color:rgba(255,255,255,1);
    position: absolute;
    left: 50%;
    margin-left: -100px;
    margin-top: 40px;
}
.bookdirect{
    border:1px solid rgba(104,133,206,1);
    color:rgba(104,133,206,1);
}
[v-cloak] {
  display: none !important;
}
p.warn{
    font-size: 16px;
}
.tip{
    margin-top: 20px;
    font-size: 14px;
    text-align: right;
}
.tip a{
    color: rgb(64, 158, 255);
}
</style>
