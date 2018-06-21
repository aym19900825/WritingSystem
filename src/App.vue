<template>
  <div id="app">
    <el-container>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import topNav from '@/components/common/TopNav'
export default {
  name: 'App',
  components:{
    topNav
  },
  created () {
    this.$router.push('/login'); // 页面加载时跳转
  }
}
</script>

<style>
  .header{
    background-color: #409EFF;
    color: white;
  }
  .header h3,p{
    text-align:center;
  }
  #app{
    background: url(./assets/bg-pattern.png) repeat;
    width: 100%;
  }
  .el-main{
    padding-top: 10px;
    min-height: 650px;
  }
</style>
    