<template>
<el-card class="box-card">
    <!-- 1.面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 2.添加按钮 -->
    <el-row class="addRoleBtn">
      <el-col>
        <el-button type="info">添加角色</el-button>
      </el-col>
    </el-row>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      rolelist: []
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async getRoleList () {
      const res = await this.$http.get(`roles`)
      console.log(res)
      this.rolelist = res.data.data
    }
  }
}
</script>

<style scoped>
.box-card {
  height: 100%;
}
.addRoleBtn{
  margin-top:20px;
}
</style>
