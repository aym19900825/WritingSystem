<template>
    <div>
        <el-button class="returnPre el-icon-arrow-left el-icon--left" @click="returnPre">返回章节</el-button>
        <h2>{{bookname}}</h2>
        <h3>目录</h3>
        <el-button type="primary" class="btnRight" @click="addChapter" style="float: right;">新增章节</el-button>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column label="章节" width="80">
                <template scope="scope">
                    <el-input v-model="scope.row.chapternumber" :disabled="true"></el-input>
                </template>
            </el-table-column>
            <el-table-column prop="chaptername" label="标题" width="280"></el-table-column>
            <el-table-column prop="chapterabstract" label="章节大纲"></el-table-column>
            <el-table-column prop="edit_date" label="完成时间" width="120"></el-table-column>
            <el-table-column label="操作" width="270">
              <template scope="scope">
                <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                <el-button size="small" type="danger" @click="editNum(scope.$index, scope.row)">修改章节号</el-button>
              </template>
            </el-table-column>
        </el-table>
        <!--
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
        -->
    </div>
</template>

<script>
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
                    path: '/edit', 
                    name: 'Edit',
                    query: { 
                        eid: row.eid,
                        bookid: row.bookid,
                        bookname: row.bookname,
                        isNew: false
                    }
                })
            },

            //删除章节
            handleDelete(index,row){
                this.$confirm('确定删除此章节吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                    }).then(({ value }) => {
                        this.$axios.post('http://192.168.1.168:8888/api/chapter/delete',{
                            eid: row.eid
                        }).then((res)=>{
                            if(res.data.code==1){
                                alert("删除成功");
                                this.init();
                            }
                        }).catch((err)=>{
                            
                        })
                        
                    }).catch(() => {

                });
            }, 
            //修改章节号码
            editNum(index,row){
                console.log(row);
            },

            //增加分卷
            addPart(){

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
                console.log(bookid);
                console.log(bookname);
            },
            init(){
                this.$axios.post('http://192.168.1.168:8888/api/chapter/list',{
                    bookid: this.bookid
                }).then((res)=>{
                    if(res.data.length>0){
                        var arr = [];
                        var tmpData = res.data;
                        var tmpObj = {};
                        for(let i=0,len=tmpData.length;i<len;i++){
                            tmpObj = tmpData[i]._source;
                            tmpObj.eid = tmpData[i]._id;
                            arr.push(tmpObj);
                        }
                        this.tableData = arr;
                    }else{
                        this.tableData = [];
                    }
                }).catch((err)=>{
                    
                })
            }
        },
        data () {
            return{
                bookid:1,
                tableData: [],
                bookname:"",
                pagesize: 10,
                totalCount: 1000,
                currentPage: 1,
                start: 1
            }
        },
        created(){
            this.getParams();
            this.init();
        }
    }
</script>
<style scoped>
h2,h3{
    text-align:center;
}
h2{
    font-size: 20px;
    height: 32px;
    line-height: 32px;
}
h3{
    font-size: 18px;
    height: 32px;
    line-height: 32px;
    color: #666;
}
.returnPre{
    float: left;
}
.el-button--primary{
    color: #fff;
    background-color: #409EFF;
    border-color: #409EFF;
    margin-bottom: 5px;
}
</style>