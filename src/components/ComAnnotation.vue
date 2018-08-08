<template>
    <div class="commentAnno">
        <div class="content">
            <ul>
                <li v-for="(item,index) in listData" v-show="index==showIndex">
                    <p class="tit">事件：{{item._source.title}}</p>
                    <p class="comContent">评论：{{item._source.content}}</p>
                </li>
            </ul>
        </div>
        <div class="commentBtn">
            <el-row>
                <el-button type="primary" @click="annotation('1')">正向</el-button>
                <el-button type="danger" @click="annotation('0')">负向</el-button>
                <el-button type="info" @click="annotation('')">暂不标注</el-button>
            </el-row>
        </div>
    </div>
</template>

<script>
    import Config from '../config.js'
    export default {
        name: 'ComAnnotation',
        methods: {
            requestData(){
                var url = '/api/comment/batch';
                this.$axios.get(this.basic_url+url).then((res) => {
                    var tmpArr = res.data.data;
                    if(this.showIndex==20){
                        this.showIndex=0;

                        this.listData.splice(0,this.listData.length,tmpArr[0],tmpArr[1],tmpArr[2],
                        tmpArr[3],tmpArr[4],tmpArr[5],tmpArr[6],tmpArr[7],tmpArr[8],tmpArr[9],tmpArr[10],
                        tmpArr[11],tmpArr[12],tmpArr[13],tmpArr[14],tmpArr[15],tmpArr[16],tmpArr[17],tmpArr[18],tmpArr[19]);
                    }else{
                        this.listData = res.data.data;
                    }
                }).catch((err) => {
                    this.$message({
                        type: 'error',
                        message: '网络错误，请重试',
                        showClose: true
                    })
                })
            },
            annotation(emotion){
                var index = this.showIndex;
                var submitData = this.listData[index];
                if(emotion!=""){
                    this.$axios.post(this.basic_url+"/api/comment/edit",{
                        "eid": submitData._id,
                        "create_date": submitData._source.create_date,
                        "title": submitData._source.title,
                        "content": submitData._source.content,
                        "emotion": emotion,
                    }).then((res) => {
                        
                    }).catch((err) => {
                        
                    })
                }
                this.showIndex++;
                console.log(this.showIndex);
                if(this.showIndex==20){
                    this.requestData();
                }
            }
        },
        mounted(){
            this.requestData();
        },
        data () {
            return {
                basic_url: Config.api,
                listData: [],
                showIndex: 0
            }
        }
    }
</script>
<style scoped>
.content{
    height: 400px;
    width: 80%;
    margin: 0 auto;
    padding-top: 1px;
}
p.tit{
    padding-bottom: 40px;
}
.content ul li{
    font-size: 24px;
    line-height: 34px;
    margin-top: 150px;
}
.commentBtn{
    text-align: center;
}
</style>