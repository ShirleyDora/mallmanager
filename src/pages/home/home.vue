<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4">
          <div class="logo">
            <img class="logo-img" src="@/assets/logo.png" alt="无法显示图片" />
          </div>
        </el-col>
        <el-col :span="18" class="middle">
          <h3>电商后台管理系统</h3>
        </el-col>
        <el-col :span="2">
          <div>
            <a class="loginout" href="#" @click.prevent="handleSignout()"
              >退出</a
            >
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 侧边栏导航 -->
      <el-aside class="aside" width="200px">
        <!-- 开启路由导航，侧边栏只保持一个子菜单的展开 -->
        <el-menu :unique-opened="true" :router="true">
          <!-- 动态获取菜单数据 -->
          <el-submenu :index="item1.order.toString()" v-for="(item1,index) in menus" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="(item2,index) in item1.children" :key="index">
              <i class="el-icon-circle-check"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
          <!-- 用户管理 -->
          <!-- <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-circle-check"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu> -->
          <!-- 权限管理 -->
          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="role">
              <i class="el-icon-location"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="rights">
              <i class="el-icon-location"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu> -->
          <!-- 商品管理 -->
          <!-- <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>导航1.1</span>
            </el-menu-item>
          </el-submenu> -->
          <!-- 订单管理 -->
          <!-- <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>导航1.1</span>
            </el-menu-item>
          </el-submenu> -->
          <!-- 数据统计 -->
          <!-- <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              <span>导航1.1</span>
            </el-menu-item>
          </el-submenu> -->
        </el-menu>
      </el-aside>
      <!-- 导航内容区域 -->
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // // newVue之前自动触发
  // beforeCreate () {
  //   // 获取token
  //   const token = localStorage.getItem('token')
  //   if (!token) {
  //     // token 没有 -》登录
  //     this.$router.push({ name: 'login' })
  //     this.$message.warning('您还没有登录，请先登录！')
  //   }
  //   // if token 有 -》继续渲染组件
  // },
  data () {
    return {
      menus: []
    }
  },
  created () {
    this.getMenus()
  },
  methods: {
    // 获取导航数据
    async getMenus () {
      const res = await this.$http.get(`menus`)
      console.log(res)
      this.menus = res.data.data
    },
    // 退出功能
    handleSignout () {
      // 清除token
      localStorage.clear()
      // 提示
      this.$message.success('退出成功')
      // 来到login页面
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
}
.main {
  background-color: #e9eef3;
  height: 100%;
  overflow-y:hidden;
}
/* 头部样式 */
.logo {
  height: 60px;
}
.logo-img {
  width: 100%;
  height: 100%;
}
.middle {
  text-align: center;
}
.loginout {
  text-decoration: none;
  line-height: 60px;
}
</style>
