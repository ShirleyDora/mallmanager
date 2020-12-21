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
            class="edit"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            class="delete"
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
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
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
      -->
      <el-tree
        :data="treelist"
        show-checkbox
        node-key="id"
        :props="defaultProps"
      >
      </el-tree>
      <!-- 取消确定按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisibleRight = false"
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
      rolelist: [],
      dialogFormVisibleRight: false,
      // 树形结构的数据
      treelist: [],
      defaultProps: {
        label: 'authName',
        children: 'children'
      }
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    // 获取树形结构的权限数据
    async getSetRightList () {
      const res = await this.$http.get(`rights/tree`)
      console.log(res)
      this.treelist = res.data.data
    },

    // 修改/分配权限
    // 修改/分配权限-打开对话框
    showSetRightDia (role) {
      this.dialogFormVisibleRight = true
      this.getSetRightList()
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
