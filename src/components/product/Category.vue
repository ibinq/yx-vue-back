<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="category-box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="searchContent">
            <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogFormVisible = true">添加分类</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;margin-top:15px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="类名"></el-table-column>

        <el-table-column prop="img" label="图标">
          <template slot-scope="scope">
            <el-image style="width: 60px; height: 60px" :src="scope.row.img" fit="fill"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="changStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序">... to do ...</el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="update(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteCategoryOpen(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增分类 -->
      <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
        <el-form
          ref="addCategoryFormRef"
          :model="addCategoryFrom"
          :rules="addCategoryFormRules"
          label-width="80px"
        >
          <el-form-item label="分类名" prop="name">
            <el-input v-model="addCategoryFrom.name" placeholder="请输入分类名"></el-input>
          </el-form-item>
          <el-form-item label="所属类" prop="parentId">
            <el-select
              v-model="addCategoryFrom.parentId "
              placeholder="请选择"
              @change="changeParentId"
            >
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <template slot-scope="scope">
              <el-switch v-model="addCategoryFrom.status" @click="changeStatus"></el-switch>
            </template>
          </el-form-item>

          <el-form-item label="图片">
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:8081/admin/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="addCategoryFrom.img" :src="addCategoryFrom.img" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveCategory()">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑分类 -->
      <el-dialog title="修改分类" :visible.sync="editDialogFormVisible">
        <el-form
          ref="editCategoryFormRef"
          :model="editCategoryFrom"
          :rules="addCategoryFormRules"
          label-width="80px"
        >
          <el-form-item label="分类名" prop="name">
            <el-input v-model="editCategoryFrom.name" placeholder="请输入分类名"></el-input>
          </el-form-item>
          <el-form-item label="所属类" prop="parentId">
            <el-select
              v-model="editCategoryFrom.parentId "
              placeholder="请选择"
              @change="changeParentId"
            >
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <template slot-scope="scope">
              <el-switch v-model="editCategoryFrom.status" @click="changeStatus"></el-switch>
            </template>
          </el-form-item>

          <el-form-item label="图片">
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:8081/admin/upload"
              :show-file-list="false"
              :on-success="editHandleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="editCategoryFrom.img" :src="editCategoryFrom.img" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateCategory()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      editDialogFormVisible: false,
      addCategoryFrom: {
        name: "",
        parentId: "",
        status: true,
        img: ""
      },
      editCategoryFrom: {
        name: "",
        parentId: "",
        status: true,
        img: ""
      },
      searchContent: "",
      options: [{}],
      value: "",
      addCategoryFormRules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getCategoryList();
    this.getCategoryParentsList();
  },
  methods: {
    async updateCategory() {
      const res = await this.$http.post(
        "/admin/category/update",
        this.$qs.stringify(this.editCategoryFrom)
      );

      if (res.data.code !== 0) {
        return this.$message.error("修改失败！");
      }
      this.editDialogFormVisible = false;
      this.options = res.data.data;
      this.getCategoryList();
    },
    update(e) {
      //console.log(e);
      this.editDialogFormVisible = true;
      this.editCategoryFrom = e;
      //console.log(this.editCategoryFrom);
    },

    async search() {
      const res = await this.$http.post(
        "/admin/category/search",
        this.$qs.stringify({ content: this.searchContent })
      );
      if (res.data.code !== 0) return this.$message.error("查询失败");
      this.tableData = res.data.data;
    },
    changeStatus() {
      this.addCategoryFrom.status = !this.addCategoryFrom.status;
    },
    changeParentId(res) {
      console.log(res);
      this.addCategoryFrom.parentId = res;
    },
    async saveCategory() {
      const res = await this.$http.post(
        "/admin/category/add",
        this.$qs.stringify(this.addCategoryFrom)
      );

      if (res.data.code !== 0) {
        return this.$message.error("添加失败！");
      }
      this.dialogFormVisible = false;
      this.options = res.data.data;
      this.getCategoryList();
    },

    async getCategoryParentsList() {
      const res = await this.$http.get("/admin/category/allParents");
      console.log(res);
      if (res.data.code !== 0) {
        return this.$message.error("获取数据失败！");
      }
      // console.log(res);
      this.options = res.data.data;
    },

    async getCategoryList() {
      const res = await this.$http.get("/admin/category/list");
      if (res.data.code !== 0) {
        return this.$message.error("获取分类数据失败！");
      }
      // console.log(res);
      this.tableData = res.data.data;
    },
    async changStatus(category) {
      const res = await this.$http.post(
        "/admin/category/changeStatus",
        this.$qs.stringify({ id: category.id, status: category.status ? 1 : 0 })
      );
      if (res.data.code !== 0) return this.$message.error("操作失败");
      this.getCategoryList();
      if (category.status === true) return this.$message.success("分类已启用");
      return this.$message.error("分类已停用");
    },
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize;
      this.getUserList();
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNum = newPageNum;
      this.getUserList();
    },
    handleAvatarSuccess(res, file) {
      this.addCategoryFrom.img = res;
      //this.editUserFrom.avatar = res;
      //this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res);
    },
    editHandleAvatarSuccess(res, file) {
      this.editCategoryFrom.img = res;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    deleteCategoryOpen(id) {
      console.log(id);
      this.$confirm("是否删除此用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.post(
            "/admin/category/delete",
            this.$qs.stringify({ cid: id })
          );
          if (res.data.code !== 0) return this.$message.error("删除失败");
          this.getCategoryList();
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
    }
  }
};
</script>

<style   scoped>
.category-box-card {
  margin-top: 15px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
/* 头像 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
</style>