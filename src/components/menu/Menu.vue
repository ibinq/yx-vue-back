<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基本信息</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="menu-box-card">
      <el-row :gutter="5">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="openAddPage">添加菜单</el-button>
        </el-col>
      </el-row>
      <el-table class="menu-table-list" :data="menuList" :stripe="true" :border="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="名称" prop="name"></el-table-column>
        <!-- <el-table-column label="权限" prop="permission"></el-table-column> -->
        <el-table-column label="路径" prop="url"></el-table-column>
        <el-table-column label="图标" prop="icon"></el-table-column>
        <el-table-column label="排序" prop="orderNum"></el-table-column>

        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="changStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="editMenu(scope.row)"></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle @click="open(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="user-page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="添加菜单" :visible.sync="dialogFormVisible">
      <el-form
        ref="addMenuFormRef"
        :model="addMenuForm"
        :rules="addMenuFormRules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="addMenuForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="addMenuForm.parentId " placeholder="请选择" @change="changeParentId">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="权限" prop="permission">
          <el-input v-model="addMenuForm.permission" placeholder="请输入权限"></el-input>
        </el-form-item>-->
        <el-form-item label="地址" prop="url">
          <el-input v-model="addMenuForm.url" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="addMenuForm.icon" placeholder="请输入图标"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="addMenuForm.orderNum" placeholder="请输入排序"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMenu()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑菜单 -->
    <el-dialog title="编辑菜单" :visible.sync="editDialogFormVisible">
      <el-form
        ref="editMenuFormRef"
        :model="editMenuFrom"
        :rules="addMenuFormRules"
        label-width="80px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="editMenuFrom.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="editMenuFrom.parentId " placeholder="请选择" @change="changeParentId">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="权限" prop="permission">
          <el-input v-model="editMenuFrom.permission" placeholder="请输入权限"></el-input>
        </el-form-item>-->
        <el-form-item label="地址" prop="url">
          <el-input v-model="editMenuFrom.url" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="editMenuFrom.icon" placeholder="请输入图标"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="orderNum">
          <el-input v-model="editMenuFrom.orderNum" placeholder="请输入排序"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditMenu()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      total: 0,
      dialogFormVisible: false,
      editDialogFormVisible: false,
      queryInfo: {
        query: "",
        pageSize: 5,
        pageNum: 1
      },
      addMenuForm: {
        name: "",
        parentId: "",
        // permission: "",
        url: "",
        icon: "",
        orderNum: ""
      },
      editMenuFrom: {
        name: "",
        parentId: "",
        // permission: "",
        url: "",
        icon: "",
        orderNum: ""
      },
      addMenuFormRules: {},
      editMenuFormRules: {},
      options: [{}]
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    async saveEditMenu() {
      this.editDialogFormVisible = false;
      const res = await this.$http.post(
        "/admin/menu/update",
        this.editMenuFrom
      );
    },
    editMenu(res) {
      this.editDialogFormVisible = true;
      this.editMenuFrom = res;
      this.getParentMenuList();
    },
    open(id) {
      this.$confirm("是否删除此菜单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(
            "/admin/menu/" + id
            //this.$qs.stringify({ id: id })
          );
          if (res.data.code !== 0) return this.$message.error("删除失败");
          this.getUserList();
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
    async changStatus(menu) {
      const res = await this.$http.post(
        "/admin/menu/changeStatus",
        this.$qs.stringify({ id: menu.id, status: menu.status ? 1 : 0 })
      );
      if (res.data.code !== 0) return this.$message.error("操作失败");
      this.getMenuList();
      if (menu.status === true) return this.$message.success("分类已启用");
      return this.$message.error("分类已停用");
    },
    async openAddPage() {
      this.getParentMenuList();
      this.dialogFormVisible = true;
    },
    async getParentMenuList() {
      const res = await this.$http.get("/admin/menu/parents");
      this.options = res.data.data;
    },
    changeParentId(res) {
      console.log(res);
      this.addMenuForm.parentId = res;
    },
    async getMenuList() {
      const res = await this.$http.get("/admin/menu/menus", {
        params: this.queryInfo
      });
      this.menuList = res.data.data.menus;
      this.total = res.data.data.total;
    },
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize;
      this.getMenuList();
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNum = newPageNum;
      this.getMenuList();
    },
    async saveMenu() {
      const res = await this.$http.post(
        "/admin/menu/save",
        //{ params: this.addMenuForm }
        this.addMenuForm
      );
      console.log(res);
    },
    search() {
      this.getMenuList();
    }
  }
};
</script>
<style >
.menu-box-card {
  margin-top: 15px;
}
.menu-table-list {
  margin-top: 15px;
}
</style>