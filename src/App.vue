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
    width: 100%;
    background:  url('./assets/bg-pattern.png') repeat; 
  }
  .el-main{
    min-height: 650px;
    padding:0px;
  }
</style>
    