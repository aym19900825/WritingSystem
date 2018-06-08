<template>
    <div>
        <span v-if="user"> {{user.name}}
            <el-button type="warning"  @click="login">注销</el-button>
        </span>
        <el-button v-else type="success" @click="login">点击登录</el-button>
        <h4 class="tit">进行中</h4>
        <el-row>
            <el-col :span="3" v-for="(item,index) in imgs" :key="item" :offset="index > 0 ? 1 : 0">
                <el-card :body-style="{ padding: '0px' }">
                    <img :src="item.imgUrl" class="image" @click="edit">
                    <div style="padding-top: 14px;padding-bottom:14px;text-align:center;">
                        <span>{{item.tit}}</span>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="3" :offset="1">
                <el-card :body-style="{ padding: '0px' }">
                    <div style="width: 100%;height: 280px;font-size: 50px;font-weight: normal;color: #ccc;text-align: center;line-height: 280px;">
                        +
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <h4 class="tit">已完成</h4>
        <el-row>
            <el-col :span="3" v-for="(item,index) in imgs" :key="item" :offset="index > 0 ? 1 : 0">
                <el-card :body-style="{ padding: '0px' }">
                    <img :src="item.imgUrl" class="image">
                    <div style="padding-top: 14px;padding-bottom:14px;text-align:center;">
                        <span>{{item.tit}}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                imgs:[
                    {
                        imgUrl:"https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike272%2C5%2C5%2C272%2C90/sign=6325c5397e0e0cf3b4fa46a96b2f997a/37d3d539b6003af3c9f0b44b392ac65c1038b657.jpg",
                        tit:"何以笙萧默"
                    },
                    {
                        imgUrl:"https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike272%2C5%2C5%2C272%2C90/sign=6325c5397e0e0cf3b4fa46a96b2f997a/37d3d539b6003af3c9f0b44b392ac65c1038b657.jpg",
                        tit:"何以笙萧默"
                    },
                    {
                        imgUrl:"https://gss3.bdstatic.com/-Po3dSag_xI4khGkpoWK1HF6hhy/baike/c0%3Dbaike272%2C5%2C5%2C272%2C90/sign=6325c5397e0e0cf3b4fa46a96b2f997a/37d3d539b6003af3c9f0b44b392ac65c1038b657.jpg",
                        tit:"何以笙萧默"
                    }
                ]
            }
        },
        methods: {
            login () {
                this.$router.replace('/login')
            },
            logout () {
                this.$store.dispatch('logout').then(() => {
                    this.$router.replace('/login')
                })
            },
            edit () {
                this.$router.replace('/edit')
            }
        },
        computed: {
            user () {
                return this.$store.state.user
            }
        }
    }
</script>
<style scoped>
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
</style>

