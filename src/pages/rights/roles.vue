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
    <!-- 3.表格展示 -->
    <el-table :data="rolelist" style="width: 100%;" max-height="600">
      <!-- 展开行 -->
      <el-table-column type="expand" width="150">
        <template slot-scope="scope">
          <el-row v-for="(item1, i) in scope.row.children" :key="i">
            <el-col :span="4">
              <!-- 传角色id和权限id -->
              <el-tag @close="deleteRight(scope.row, item1.id)" closable>{{
                item1.authName
              }}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2, i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    type="success"
                    @close="deleteRight(scope.row, item2.id)"
                    closable
                    >{{ item2.authName }}</el-tag
                  >
                  <i class="el-icon-arrow-right"></i
                ></el-col>
                <el-col :span="20"
                  ><el-tag
                    v-for="(item3, i) in item2.children"
                    :key="i"
                    type="warning"
                    @close="deleteRight(scope.row, item3.id)"
                    closable
                    >{{ item3.authName }}</el-tag
                  >
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 无权限的提示 -->
          <span v-if="scope.row.children.length === 0">未分配权限</span>
        </template>
      </el-table-column>
      <!-- 序号 -->
      <el-table-column type="index" label="#" width="150"></el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="200"
      ></el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="scope">
          <el-button
            @click="showSetRightDia(scope.row)"
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
    <!-- 修改权限的对话框 -->
    <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
      <!-- 树形结构
        data->数据源[]
        show-checkbox->选择框
        node-key每个节点的唯一标识，通常是data数据源中key名id
        default-expanded-keys默认展开[要展开的节点的id]
        default-checked-keys[要选择的节点的id]
        props配置项{label,children}
        label节点的文字标题和children节点的子节点
        值都来源于data绑定的数据源中的该数据的key名'label'和'children'
        :default-expanded-keys="arrexpand" arrexpand=[2,5]
        :default-checked-keys="[5]"
      -->
      <el-tree
        ref="tree"
        :data="treelist"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrcheck"
        :props="defaultProps"
      >
      </el-tree>
      <!-- 取消确定按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      rolelist: [],
      dialogFormVisibleRight: false,
      // 树形结构的数据
      treelist: [],
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      // arrexpand: [],
      arrcheck: [],
      currentRoleId: -1
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 修改权限-发送请求
    async setRoleRight () {
      // roleId 当前要修改权限的角色id
      // rids树形节点中所有全选和半选的label的id[]
      // 获取全选的id的数据arr1 getCheckedKeys()
      let arr1 = this.$refs.tree.getCheckedKeys()
      console.log(arr1)
      // 获取半选的id数据arr2 getHalfCheckedKeys()
      let arr2 = this.$refs.tree.getHalfCheckedKeys()
      console.log(arr2)
      // arr=arr1+arr2
      // arr1.concat(arr2)
      let arr = [...arr1, ...arr2]
      console.log(arr)
      const res = await this.$http.post(`roles/${this.currentRoleId}/rights`, {rids: arr.join(',')})
      console.log(res)
      // 对话框关闭
      this.dialogFormVisibleRight = false
      // 重新渲染视图
      this.getRoleList()
      // this.getRoleList()
      this.$message.success('修改权限成功')
      // el-tree标签的js方法
      // el-tree.get
      // div -> js方法/属性innerText
      // 1.获取div->DOM元素
      // 2.DOM.innerText
      // var div = document.getElementById('div')
      // div.innerText
      // el-tree->js方法getCheckedKeys
      // 1.给要操作的dom元素设置ref属性值 input ref="txt"
      // 2.this.$refs.ref属性值.js方法名() this.$refs.txt.focus()
    },
    // 获取树形结构的权限数据
    async getSetRightList (role) {
      const res = await this.$http.get(`rights/tree`)
      console.log(res)
      this.treelist = res.data.data
      // 默认全部展开
      // var arrtemp1 = []
      // this.treelist.forEach(item1 => {
      //   arrtemp1.push(item1.id)
      //   item1.children.forEach(item2 => {
      //     arrtemp1.push(item2.id)
      //     item2.children.forEach(item3 => {
      //       arrtemp1.push(item3.id)
      //     })
      //   })
      // })
      // console.log(arrtemp1)
      // this.arrexpand = arrtemp1
      // 获取当前角色role的权限id
      let arrtemp2 = []
      role.children.forEach((item1) => {
        // arrtemp2.push(item1.id)
        item1.children.forEach((item2) => {
          // arrtemp2.push(item2.id)
          item2.children.forEach((item3) => {
            arrtemp2.push(item3.id)
          })
        })
      })
      console.log(arrtemp2)
      this.arrcheck = arrtemp2
    },

    // 修改/分配权限
    // 修改/分配权限-打开对话框
    showSetRightDia (role) {
      console.log(role)
      this.dialogFormVisibleRight = true
      this.getSetRightList(role)
      this.currentRoleId = role.id
    },
    // 取消权限
    async deleteRight (role, rightId) {
      // roles/:roleId/rights/:rightId
      // roleId当前角色的id
      // rightId要删除的权限id
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      // 重新渲染视图
      role.children = res.data.data
      // this.getRoleList()
      this.$message.success('取消权限成功')
    },
    // 获取列表数据
    async getRoleList () {
      const res = await this.$http.get(`roles`)
      // console.log(res)
      this.rolelist = res.data.data
      console.log(this.rolelist)
    }
  }
}
</script>
<style scoped>
.box-card {
  height: 100%;
}
.addRoleBtn {
  margin-top: 20px;
}
</style>
