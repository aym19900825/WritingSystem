<template>
    <!--
    <div class="bookList">
        <template>
            <h4 class="bookTit">我的作品</h4>
            <el-row class="bookFront">    
                <span>当前作品共</span><span>{{totalCount}}</span><span>个</span>
                <el-button type="primary" class="btnRight" @click="returnPre" style="margin-left: 10px;" plain>返回</el-button>
                <el-button type="primary" class="btnRight" @click="dialogFormVisible = true">创建作品</el-button>
            </el-row>
            <el-table :data="books" style="width: 85%;margin: 0 auto;">
                <el-table-column label="书名" width="250" prop="bookname">
                </el-table-column>
                <el-table-column label="状态" width="180" prop="bookstatus"></el-table-column>
                <el-table-column label="创建时间" width="250">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.createtime }}</span>
                    </template>
                </el-table-column>
                 <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="addChapter(scope.$index, scope.row)">新增章节</el-button>
                        <el-button size="mini" @click="readStory(scope.$index, scope.row)">故事大纲</el-button>
                        <el-button size="mini" type="danger" @click="readBook(scope.$index, scope.row)">编辑图书信息</el-button>
                        <el-button size="mini" type="danger" @click="bookDirect(scope.$index, scope.row)">查看目录</el-button>
                    </template>
                </el-table-column>
          </el-table>
        </template>


        <el-dialog title="作品信息" :visible.sync="dialogFormVisible"  :before-close="handleCloseBookInfo">
            <el-form :model="newBook" :rules="rules" ref="bookinfoForm">
                <el-form-item label="作品名称" :label-width="formLabelWidth" prop="bookname">
                    <el-input v-model="newBook.bookname" auto-complete="off"></el-input>
                    <p class="inputTip">15字内，请勿添加特殊符号</p>
                </el-form-item>
                <el-form-item label="作品体裁" :label-width="formLabelWidth" prop="category">
                    <el-select v-model="newBook.category" placeholder="请选择作品体裁">
                        <el-option label="小说" value="fiction"></el-option>
                        <el-option label="剧本" value="scripts"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="作品标签" :label-width="formLabelWidth" prop="label">
                    <el-input auto-complete="off" v-model="newBook.label"></el-input>
                </el-form-item>
                <el-form-item label="作品简介" :label-width="formLabelWidth" prop="abstract">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}"  placeholder="请输入内容"  v-model="newBook.abstract">
                    </el-input>
                    <p class="inputTip">10~1000字</p>
                </el-form-item>
                <el-form-item label="作者寄语" :label-width="formLabelWidth" prop="writing">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}"  placeholder="请输入内容"  v-model="newBook.writing">
                    </el-input>
                    <p class="inputTip">0~500字</p>
                </el-form-item>
            </el-form>
            <el-dialog  width="30%"  title="创建成功" :visible.sync="innerVisible" :before-close="handleClose" append-to-body>
                <P class="congratulation">恭喜您！创建成功！</P>
                <el-button @click="returnList"  type="text">返回图书列表</el-button>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addBook" v-show="!upDateBook">创建作品</el-button>
                <el-button type="primary" @click="editBook" v-show="upDateBook">确定</el-button>
                <el-button @click="reset">取 消</el-button>
            </div>
        </el-dialog>
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
    -->


    <div id="booklist">
        <v-header></v-header>
        <p class="navTxt">
            我的作品
            <el-button type="primary" v-if="books.length != 0" @click="creatWork">创建作品</el-button>
        </p>
        <div class="emptyContent" v-if="books.length == 0" v-cloak>
            <img src="../assets/img/empty-bg.png" alt="">
            <p>对不起，您还没有创建任何的作品哦！</p>
            <el-button type="primary">创建作品</el-button>
        </div>
        <div class="bookList" v-else v-cloak>
            <el-table :data="books" style="width: 85%;margin: 0 auto;">
                <el-table-column label="书名" width="200" prop="bookname">
                </el-table-column>

                <!--
                <el-table-column label="最新章节" width="250">
                    <template slot-scope="scope">
                        <span style="display: block;color:#0064FF;">{{ scope.row.lastedChapter }}</span>
                        <el-button size="mini" @click="bookDirect(scope.$index, scope.row)" class="bookdirect">查看目录</el-button>
                    </template>
                </el-table-column>
                -->
                
                <el-table-column label="作品类别" width="100" prop="category">
                    <template slot-scope="scope">
                        <span v-text="scope.row.category=='fiction'?'小说':'剧本'"></span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100" prop="bookstatus">
                </el-table-column>
                <el-table-column label="创建时间" width="250">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.createtime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="addChapter(scope.$index, scope.row)" type="success">写新章节</el-button>
                        <el-button size="mini" @click="readStory(scope.$index, scope.row)">故事大纲</el-button>
                        <el-button size="mini" type="primary" @click="readBook(scope.$index, scope.row)">编辑作品</el-button>
                        <el-button size="mini" @click="bookDirect(scope.$index, scope.row)" class="bookdirect">查看目录</el-button>
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
    </div>
</template>

<script>
    import Header from './common/Header.vue'
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
        computed: {
            user () {
                return this.$store.state.user
            }
        },
        methods: {
            creatWork(){
                this.$router.push({
                    path: '/bookinfo', 
                    query: { 
                        bookid: '',
                        userid: this.user.userid
                    }
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
                this.$router.push({
                    path: '/edit', 
                    query: { 
                        bookid: row.bookid,
                        bookname: row.bookname,
                        isNew: true
                    }
                })
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
                this.$axios.post('http://203.93.173.179:8888/api/bookList',{
                    userid: this.user.userid,
                    page_index: this.currentPage,
                    page_size: this.pagesize
                }).then((res)=>{
                    if (res.data) {
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
   display: none;
}
</style>
