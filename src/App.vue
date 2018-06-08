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
    