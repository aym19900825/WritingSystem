<template>
    <div class="bookdirectory">
        
        <h2>{{bookname}}</h2>
        <el-row class="bookFront">    
            <h3>目录</h3>
            <el-button type="primary" class="btnRight" @click="returnPre" plain style="margin-left:10px;">返回</el-button>
            <el-button type="primary" class="btnRight" @click="addChapter">新增章节</el-button>
        </el-row>
        <el-table :data="tableData" style="width: 85%;margin: 0 auto;">
            <el-table-column prop="chapternumber" label="章节" width="80"></el-table-column>
            <el-table-column prop="chaptername" label="标题" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="chapterabstract" label="章节大纲" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="完成时间" width="200">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.edit_date }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template scope="scope">
                <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
                    bookid: this.bookid,
                    page_index: this.currentPage,
                    page_size: this.pagesize
                }).then((res)=>{
                    if(res.data.total>0){
                        this.totalCount = res.data.total;
                        var arr = [];
                        var tmpData = res.data.data;
                        console.log(res.data);
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

                //page信息
                pagesize: 10,
                totalCount: 100,
                currentPage: 1,
            }
        },
        created(){
            this.getParams();
            this.init();
        }
    }
</script>
<style scoped>
.bookdirectory{
    width: 100%;
    background: #fff;
    min-height: 600px;
}
h2,h3{
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 16px;
    border-bottom: 1px solid #e6e6e6;
}
h3{
    float: left;
    width: 30%;
    border: none;
}
.bookFront{
    height: 47px;
    line-height: 47px;
    width: 85%;
    border-bottom: 1px solid #e6e6e6;
    margin: 0 auto;
}
.returnPre{
    float: left;
}
.btnRight{
    float: right;
    margin-top: 3px;
    margin-bottom: 5px;
}
</style>