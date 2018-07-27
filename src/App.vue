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
    height: 100%;
  }
  .el-main{
    min-height: 650px;
    padding:0px;
  }
  [v-cloak] {
    display: none;
  }
</style>
    