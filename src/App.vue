<template>
  <div id="app">
    <el-container>
      <el-header class="header" height="100px">
        <h3>writing system</h3>
        <p>login module</p>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App'
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
</style>
    