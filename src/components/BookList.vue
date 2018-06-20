<template>
    <div class="bookList">
        <template>
            <h4 class="bookTit">我的作品</h4>
            <el-row class="bookFront">    
                <span>当前作品共</span><span>{{books.length}}</span><span>个</span>
                <el-button type="primary" class="btnRight" @click="dialogFormVisible = true">创建作品</el-button>
            </el-row>
            <el-table :data="books" style="width: 100%">
                <el-table-column label="书名" width="180" prop="bookname">
                </el-table-column>
                <el-table-column label="状态" width="180" prop="bookstatus"></el-table-column>
                <el-table-column label="创建时间" width="180" prop="createtime"></el-table-column>
                 <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="addChapter(scope.$index, scope.row)">增加新的章节</el-button>
                        <el-button size="mini" type="danger" @click="readBook(scope.$index, scope.row)">编辑图书信息</el-button>
                        <el-button size="mini" type="danger" @click="bookDirect(scope.$index, scope.row)">查看目录</el-button>
                    </template>
                </el-table-column>
          </el-table>
        </template>


        <el-dialog title="作品信息" :visible.sync="dialogFormVisible">
            <el-form :model="newBook" :rules="rules">
                <el-form-item label="作品名称" :label-width="formLabelWidth" prop="tit">
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
                    <p class="inputTip">10~300字</p>
                </el-form-item>
                <el-form-item label="作者寄语" :label-width="formLabelWidth" prop="writing">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}"  placeholder="请输入内容"  v-model="newBook.writing">
                    </el-input>
                    <p class="inputTip">0~30字</p>
                </el-form-item>
            </el-form>
            <el-dialog  width="30%"  title="创建成功" :visible.sync="innerVisible"  append-to-body>
                <P class="congratulation">恭喜您！创建成功！</P>
                <el-button type="primary" @click="creatWorks" style="margin-left: 80px;">上传章节</el-button>
                <el-button @click="returnList"  type="text">返回图书列表</el-button>
            </el-dialog>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addBook" v-show="!upDateBook">创建作品</el-button>
                <el-button type="primary" @click="editBook" v-show="upDateBook">确定</el-button>
                <el-button @click="reset">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data(){
            return{
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
                    tit:[
                        {
                            required: true,
                            message: '必填信息',
                            trigger: 'blur',
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
            edit(item) {
                this.$router.push({
                    path: '/edit', 
                    name: 'Edit',
                    query: { 
                        bookid: item.bookid,
                        isNew: true
                    }
                })
            },
            readBook(index,row){
                this.newBook.bookname = row.bookname;
                this.upDateBook = true;
                this.upDateBookId = row.bookid;
                this.dialogFormVisible = true;
            },
            editBook(){
                this.$axios.post('/api/api/editBook',{
                    bookid: this.upDateBookId,
                    bookname: this.newBook.bookname,
                    bookstatus: 0
                }).then((res)=>{
                    if(res.data.code==1){
                        this.$message({
                          type: 'success',
                          message: '修改成功',
                          showClose: true
                        }) 
                        this.initBookList();
                        this.reset();
                    }else{
                        this.$message({
                          type: 'error',
                          message: '修改失败',
                          showClose: true
                        }) 
                    }
                }).catch((err)=>{
                    
                })
            },
            addBook() {
                this.$axios.post('/api/api/addBook',{
                    bookname: this.newBook.bookname,
                    userid: this.user.userid
                }).then((res)=>{
                    if(res.data.code==1){
                        this.innerVisible = true;
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.data.message,
                            showClose: true
                        })
                    }
                }).catch((err)=>{
                    
                })
            },
            addChapter(index,row){
                this.$router.push({
                    path: '/edit', 
                    name: 'Edit',
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
                    name: 'BookDirectory',
                    query: { 
                        bookid: row.bookid,
                        bookname: row.bookname
                    }
                })
            },
            returnList(){
                this.innerVisible = false;
                this.dialogFormVisible = false;
                this.reset();
                this.initBookList();
            },
            reset(){
                this.newBook.bookname = '';
                this.newBook.category = '';
                this.newBook.label = '';
                this.newBook.abstract = '';
                this.newBook.writing = '';
                this.dialogFormVisible = false;
                //更新完图书基本信息后reset
                this.upDateBook = false;
                this.upDateBookId = 1;
            },
            initBookList(){
                this.$axios.post('/api/api/bookList',{
                    userid: this.user.userid
                }).then((res)=>{
                    if (res.data) {
                        this.doingWorks  = res.data.books["0"];
                        this.doneWorks  = res.data.books["1"];
                        this.books = res.data.books["0"].concat(res.data.books["1"]);
                        console.log(books);
                    }else {
                        this.$message({
                            type: 'error',
                            message: '暂时没有数据',
                            showClose: true
                        })
                    }
                }).catch((err)=>{
                    
                })
            }
        },
        created(){
           this.initBookList();
        }
    }
</script>
<style scoped>
.bookList{
    width:90%;
    margin: 0 auto;
}
.bookTit{
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 18px;
}
.btnRight{
    float: right;
}
.bookFront span{
    display: block;
    float: left;
    height: 45px;
    line-height: 45px;
}
.time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height: 160px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
  h4.tit{
    margin-bottom:20px;
    border-bottom:1px solid #ccc;
    padding-bottom:10px;

  }
  .inputTip{
    font-size:12px;
    color:#ccc;
    height:18px;
    line-height:18px;
    text-align:left;
    padding-top:5px;
  }
  p.congratulation{
    font-size:18px;
    color:red;
    height:48px;
    padding-top:0px;
    padding-bottom:30px;
  }
  .dialog-footer{
    text-align:center;
  }
  table.el-table__body tbody tr td:nth-child(1){
    cursor: pointer;
  }
</style>

