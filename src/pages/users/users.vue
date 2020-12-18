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
        <el-input
          @clear="loadUserList()"
          clearable
          placeholder="请输入内容"
          v-model="query"
          class="inputSearch"
        >
          <el-button
            @click="searchUser()"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-button @click="showAddUserDia()" type="success">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 3.表格 -->
    <el-table :data="userlist" style="width: 100%;">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="id" label="工号"></el-table-column>
      <el-table-column prop="role_name" label="管理权限"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="创建时间">
        <!-- {{create_time|fmtdate}} -->
        <!-- 如果单元格的显示的内容不是字符串(文本)，需要给被现实的内容外层包裹一个template -->
        <!-- template内部要用数据，设置slot-scope属性，该属性的值是要用create_time的数据源userlist -->
        <!-- slot-scope的值userlist其实就是el-table绑定的数据userlist,
        user-list.row->数组中的每个对象 -->
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtdate }}
        </template>
      </el-table-column>
      <el-table-column prop="mg_state" label="用户状态">
        <template slot-scope="scope">
          <el-switch
            @change="changeMgState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" width="140">
        <template slot-scope="scope">
          <el-button
            @click="showEditUserDia(scope.row)"
            class="edit"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="showDeleteUserMsgBox(scope.row.id)"
            class="delete"
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
          <el-button
            @click="showSetUserRoleDia(scope.row)"
            class="check"
            size="mini"
            plain
            type="success"
            icon="el-icon-user"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 4.分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 5.对话框 -->
    <!-- 5.1添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="formUser">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="formUser.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input
            v-model="formUser.password"
            autocomplete="off"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="formUser.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="formUser.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 5.2编辑用户的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="formUser">
        <el-form-item label="用户名" label-width="100px">
          <el-input
            disabled
            v-model="formUser.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px">
          <el-input v-model="formUser.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="100px">
          <el-input v-model="formUser.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 5.3分配用户角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="formUser">
        <el-form-item label="用户名" label-width="100px">
          {{ "当前用户的用户名" }}
        </el-form-item>
        <el-form-item label="角色" label-width="100px">
          <!-- 如果select的绑定的数据的值和option的value一样，就会显示该option的label值 -->
          {{currentRoleId}}
          <el-select v-model="currentRoleId">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option :label="item" :value="i" v-for="(item,i) in 5" :key="i"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleRole = false"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 查询框
      query: '',
      // 表格绑定的数据
      // create_time: (...)
      // email: (...)
      // id: (...)
      // mg_state: (...)
      // mobile: (...)
      // role_name: (...)
      // username: (...)
      userlist: [
        {
          id: 1,
          username: '',
          mobile: '',
          type: 1,
          email: '',
          create_time: '',
          mg_state: true,
          role_name: ''
        }
      ],
      // 分页相关数据
      total: -1,
      pagenum: 1,
      pagesize: 2,
      // 添加对话框的属性
      dialogFormVisibleAdd: false,
      // 添加用户的表单数据
      // username 用户名称 不能为空
      // password 用户密码 不能为空
      // email 邮箱 可以为空
      // mobile 手机号 可以为空
      formUser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑对话框的属性
      dialogFormVisibleEdit: false,
      // 分配角色的属性
      dialogFormVisibleRole: false,
      // 下拉选择框
      currentRoleId: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 搜索用户
    loadUserList () {
      // 清空搜索框
      this.getUserList()
    },
    searchUser () {
      // 按照input绑定的query参数,发请求
      this.getUserList()
    },
    // 添加用户
    // 添加用户-打开对话框
    showAddUserDia () {
      // 清空对话框
      this.formUser = {}
      this.dialogFormVisibleAdd = true
    },
    // 添加用户-发送请求
    async addUser () {
      // 2.关闭对话框
      this.dialogFormVisibleAdd = false
      const res = await this.$http.post(`users`, this.formUser)
      console.log(res)
      const {
        meta: { msg, status }
      } = res.data
      if (status === 201) {
        // 1.提示成功
        this.$message.success(msg)
        // 3.更新视图
        this.getUserList()
        // 4.清空文本框
        this.formUser = {}
      } else {
        this.$message.warning(msg)
      }
    },
    // 修改用户状态
    async changeMgState (user) {
      // 发送请求
      // eslint-disable-next-line no-unused-vars
      const res = await this.$http.put(
        // 1.mg_state=false
        // 2.点开关->mg_state=true
        `users/${user.id}/state/${user.mg_state}`
      )
      // console.log(res)
    },
    // 编辑用户
    // 编辑用户-打开对话框
    showEditUserDia (user) {
      // 获取用户数据
      this.formUser = user
      this.dialogFormVisibleEdit = true
    },
    // 编辑用户-发送请求
    async editUser () {
      // users/:id
      // eslint-disable-next-line no-unused-vars
      const res = await this.$http.put(
        `users/${this.formUser.id}`,
        this.formUser
      )
      console.log(res)
      // 1.关闭对话框
      this.dialogFormVisibleEdit = false
      // 2.更新视图
      this.getUserList()
    },
    // 删除用户
    // 删除用户-打开消息盒子弹框
    showDeleteUserMsgBox (userId) {
      this.$confirm('删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发送删除的请求 :id----->用户id
          // 1.data中找userId
          // 2.把userId以showDeleteUserMsgBox参数形式传进来
          const res = await this.$http.delete(`users/${userId}`)
          console.log(res)
          if (res.data.meta.status === 200) {
            this.pagenum = 1
            // 更新视图
            this.getUserList()
            // 提示
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 分配角色
    // 分配角色-打开对话框
    showSetUserRoleDia (user) {
      this.dialogFormVisibleRole = true
    },
    // 分页相关的方法
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
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
      const {
        meta: { status, msg },
        data: { users, total }
      } = res.data
      if (status === 200) {
        // 1.给表格数据赋值
        this.userlist = users
        // 2.给total赋值
        this.total = total
        // 3.提示
        this.$message.success(msg)
      } else {
        // 提示
        this.$message.warning(msg)
      }
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
