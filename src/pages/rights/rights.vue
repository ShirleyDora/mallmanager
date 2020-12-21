<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <!-- 2.表格 -->
  </el-card>
</template>

<script>
export default {}
</script>

<style scoped>
.box-card {
  height: 100%;
}
</style>
