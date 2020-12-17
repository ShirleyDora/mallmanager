<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <!-- 首页/用户管理/用户列表 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2.搜索 -->
    <el-row class="searchRow">
      <el-col>
        <el-input placeholder="请输入内容" v-model="query" class="inputSearch">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 3.表格 -->
    <el-table :data="tableData" style="width: 100%;">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="date" label="创建时间"></el-table-column>
      <el-table-column prop="status" label="用户状态"></el-table-column>
      <el-table-column prop="option" label="操作"></el-table-column>
    </el-table>
    <!-- 4.分页 -->
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 查询框
      query: '',
      pagenum: 1,
      pagesize: 2,
      // 表格绑定的数据
      tableData: [
        {
          name: '王小虎',
          email: '111@123.com',
          phone: '11111111111',
          date: '2016-05-02',
          status: 1,
          option: 1
        },
        {
          name: '王小虎',
          email: '111@123.com',
          phone: '11111111111',
          date: '2016-05-02',
          status: 1,
          option: 1
        }
      ]

    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表的请求
    async getUserList () {
      // query 查询参数 可以为空
      // pagenum 当前页面 不能为空
      // pagesize 每页显示条数 不能为空
      // 需要授权的API,必须在请求头中使用 Authorization 字段提供 token 令牌
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      console.log(this.query)
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      )
      console.log(res)
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.inputSearch {
  width: 300px;
}
.searchRow {
  margin-top: 20px;
}
</style>
