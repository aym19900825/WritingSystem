<template>
    <div class="top-nav">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
            <el-submenu index="2">
                <template slot="title">速本</template>
                <el-menu-item index="2-1"><router-link to="/d3show">人物图谱</router-link></el-menu-item>
                <el-menu-item index="2-2"><router-link to="/d3show">事件图谱</router-link></el-menu-item>
                <el-menu-item index="2-3"><router-link to="/d3show">小说人物图谱</router-link></el-menu-item>
                <el-menu-item index="2-3"><router-link to="/d3show">小说事件图谱</router-link></el-menu-item>
            </el-submenu>
            <el-menu-item index="3"><router-link to="/booklist">切换图书</router-link></el-menu-item>
            <el-menu-item index="4"><router-link to="/">AI智能写作</router-link></el-menu-item>
            <el-menu-item index="4"><router-link to="/edit">更新文章</router-link></el-menu-item>
        </el-menu>
        <div class="line"></div>
    </div>
</template>

<script>
    export default {
        name: 'TopNav',
        methods: {
            
        },
        data () {
            
        }
    }
</script>
<style scoped>

</style>