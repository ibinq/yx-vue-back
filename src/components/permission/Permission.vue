<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基本信息</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="product-box-card">
      <el-row :gutter="5">
        <el-col :span="4">
          <el-button type="primary" @click="addPerm">添加菜单</el-button>
        </el-col>
      </el-row>
      <el-container style="height: 500px; border: 1px solid #eee;margin-top:15px">
        <el-aside width="200px" style="margin-top:15px;">
          <el-tree :data="menuTree" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-aside>

        <el-container>
          <template>
            <el-table
              :data="permissionList"
              style="width: 100%;margin-left:15px"
              :row-class-name="tableRowClassName"
            >
              <el-table-column prop="name" label="名称"></el-table-column>
              <el-table-column prop="value" label="权限"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="编辑"
                    placement="top"
                    :enterable="false"
                  >
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      circle
                      @click="editPerm(scope.row)"
                    ></el-button>
                  </el-tooltip>

                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="删除"
                    placement="top"
                    :enterable="false"
                  >
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      circle
                      @click="open(scope.row.id)"
                    ></el-button>
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-container>
      </el-container>
    </el-card>
    <el-dialog title="添加菜单" :visible.sync="dialogFormVisible">
      <el-form
        ref="addPermFormRef"
        :model="addPermForm"
        :rules="addPermFormRules"
        label-width="80px"
      >
        <el-form-item label="上级菜单" prop="menuId">
          <el-select v-model="addPermForm.menuId " placeholder="请选择" @change="changeParentId">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="addPermForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="value">
          <el-input v-model="addPermForm.value" placeholder="请输入地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="savePerm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑菜单" :visible.sync="editDialogFormVisible">
      <el-form
        ref="editPermFormRef"
        :model="editPermFrom"
        :rules="addPermFormRules"
        label-width="80px"
      >
        <el-form-item label="上级菜单" prop="menuId">
          <el-select v-model="editPermFrom.menuId " placeholder="请选择" @change="changeParentId">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="editPermFrom.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="value">
          <el-input v-model="editPermFrom.value" placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditPerm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchContent: "",
      menuTree: [],
      addPermForm: {
        name: "",
        value: "",
        menuId: ""
      },
      editPermFrom: {
        name: "",
        value: "",
        menuId: ""
      },
      addPermFormRules: {},
      options: [],
      dialogFormVisible: false,
      editDialogFormVisible: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      permissionList: []
    };
  },
  created() {
    this.getMenuTree();
  },
  methods: {
    async saveEditPerm() {
      this.editDialogFormVisible = false;
      const res = await this.$http.post(
        "/admin/permission/update",
        this.editPermFrom
      );
    },
    changeParentId(res) {
      console.log(res);
      this.addPermForm.menuId = res;
    },
    async editPerm(res) {
      this.editDialogFormVisible = true;
      this.editPermFrom = res;
      const res1 = await this.$http.get("/admin/menu/childMenu");
      this.options = res1.data.data;
    },
    open(id) {
      this.$confirm("是否删除此数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete("/admin/permission/" + id);
          if (res.data.code !== 0) return this.$message.error("删除失败");
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async addPerm() {
      this.dialogFormVisible = true;
      const res = await this.$http.get("/admin/menu/childMenu");
      this.options = res.data.data;
    },
    async savePerm() {
      const res = await this.$http.post(
        "/admin/permission/add",
        this.addPermForm
      );
      this.dialogFormVisible = false;
      resetField();
    },
    resetField() {
      this.$refs.addPermFormRef.resetFields();
    },
    async getMenuTree() {
      const res = await this.$http.get("/admin/menu/menuTree");
      this.menuTree = res.data.data;
    },

    async handleNodeClick(data) {
      const res = await this.$http.get("/admin/permission/" + data.id);
      this.permissionList = res.data.data;
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    }
  }
};
</script>
<style >
.product-box-card {
  margin-top: 15px;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>