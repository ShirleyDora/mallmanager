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
export default {
  data () {
    return {
      rightlist: []
    }
  },
  created () {
    this.getRightList()
  },
  methods: {
    async getRightList () {
      // 除了登录之外的所有请求，都需要设置头部
      const res = await this.$http.get(`rights/list`)
      console.log(res)
      this.rightlist = res.data.data
    }

  }
}
</script>

<style scoped>
.box-card {
  height: 100%;
}
</style>
