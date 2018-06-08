<template>
    <div class="app-container">
      <el-row :gutter="20">
        <el-col :span="24">
          <tinymce id="d1" v-model="data" :other_options="options"></tinymce>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <tinymce id="d1" v-model="data" :other_options="options"></tinymce>
        </el-col>
      </el-row>
    </div>
</template>

<script>
export default{
    data(){
        return {
            tableData: [{
              date: '第一章',
              name: '重逢'
            }, {
              date: '第二章',
              name: '转身'
            }, {
              date: '第三章',
              name: '靠近'
            }, {
              date: '第四章',
              name: '命运'
            }, {
              date: '第五章',
              name: '命运'
            }, {
              date: '第六章',
              name: '命运'
            }, {
              date: '第七章',
              name: '命运'
            }, {
              date: '第八章',
              name: '命运'
            }, {
              date: '第九章',
              name: '命运'
            }, {
              date: '第十章',
              name: '命运'
            }
            ],
            options: {
                language_url: "../../static/tinymce/zh_CN.js",
                height: 500
            }
        };
    }
} 
</script>
<style scoped>
h5{
  text-align:center;
}
</style>

