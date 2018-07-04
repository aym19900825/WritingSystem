<template>
    <div id="d3show">
        <el-button class="returnPre el-icon-arrow-left el-icon--left" @click="returnPre">返回</el-button>
        <el-row>
            <el-col :span="12" :offset="6">
                <div style="margin-top: 15px;">
                    <el-input placeholder="请输入内容" v-model="search" class="input-with-select" @keydown="searchEnter($event)">
                        <el-button slot="append" icon="el-icon-search" @click="searchRelation"></el-button>
                    </el-input>
                </div>
            </el-col>
        </el-row>
        <el-row>
            <div >
                <ul>
                    <li @click="searchChart(item._source.eid)" v-for="item in listData">{{item._source.title}}</li>
                </ul>
            </div>
        </el-row>
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
    import axios  from 'axios' 
    import topNav from '@/components/common/TopNav';
    export default {
        name: 'D3Show',
        components:{
            topNav
        },
        methods: {
            returnPre(){
                sessionStorage.setItem('url','login');
                this.$router.push({
                    path: '/edit', 
                    name: 'Edit',
                })
            },
            searchEnter(e){
                if(e.keyCode==13){
                    this.searchRelation();
                 }
            },
            searchChart(eid){
                const {href} = this.$router.resolve({
                                    path: "/showrelation",
                                    query: {
                                        search: this.search,
                                        eid: eid
                                    }
                                });
                window.open(href, '_blank');
            },
            searchRelation(){
                this.requestData();
            },
            requestData(){
                var url = "http://192.168.1.168:8888/api/search/list";
                this.$axios.post(url,{
                            search_text: this.search,
                            page_index: this.currentPage,
                            page_size: this.pagesize
                }).then((res) => {
                    this.listData = res.data.data;
                    this.totalCount = res.data.total;
                }).catch((err) => {
                    this.$message({
                        type: 'error',
                        message: '网络错误，请重试',
                        showClose: true
                    })
                })
            },
            handleSizeChange(val) {
                this.pagesize = val;
                this.initBookList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.initBookList();
                console.log(val);
            }
        },
        data () {
            return {
                d3Params: {
                    width: 600,
                    height: 600,
                    img_w: 30,
                    img_h: 40
                },
                search: '',
                select: '',
                relationTxt:'',
                listData:[],

                //page信息
                pagesize: 20,
                totalCount: 1,
                currentPage: 1,
            }        
        }
    }
</script>
<style scoped>
#d3show{
    width: 90%;
    margin: 0 auto;
    min-height: 600px;
}
.nodetext {
    font-size: 12px ;
    font-family: SimSun;
    fill:#000000;
}

.linetext {
    font-size: 12px ;
    font-family: SimSun;
    fill:#0000FF;
    fill-opacity:1.0;
}
#chart{
    width: 100%;
    height:600;
    padding-top: 50px;
    padding-bottom: 50px;
    margin: 0 auto;
}
.el-select .el-input {
    width: 130px;
}
.input-with-select .el-input-group__prepend {
    background-color: #fff;
}
#relationTxt{
    font-size: 16px;
    height: 30px;
    line-height: 30px;
    text-indent: 32px;
    width: 100%;
    float: left;
    text-align: left;
    margin-bottom: 50px;
    padding-bottom: 50px;
}
#relationTxt h4{
    text-align: center;
    font-size: 18px;
    font-weight: bold;
}
#relationTxt span{
    display: block;
    font-size: 12px;
    width: 100%;
    text-align: center;
}
#relationTxt p{
    display: block;
    font-size: 12px;
    width: 100%;
    text-align: center;
}
ul{
    margin-top: 50px;
    min-height: 350px;
}
ul li{
    line-height: 30px;
    height: 30px;
    font-size: 16px;
    font-weight: bold;
    padding-left: 15%;
    text-decoration: underline;
    cursor: pointer;
}
</style>
