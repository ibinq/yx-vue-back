<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基本信息</el-breadcrumb-item>
      <el-breadcrumb-item>账户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="user-box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <el-table class="user-table-list" :data="userList" :stripe="true" :border="true">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="changStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle @click="editUser(scope.row)"></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle @click="open(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" circle></el-button>
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

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form
        ref="addUserFormRef"
        :model="addUserFrom"
        :rules="addUserFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserFrom.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserFrom.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserFrom.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addUserFrom.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:8081/admin/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addUserFrom.avatar" :src="addUserFrom.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form
        ref="editUserFormRef"
        :model="editUserFrom"
        :rules="addUserFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserFrom.username" placeholder="请输入用户名"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserFrom.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="editUserFrom.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:8081/admin/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editUserFrom.avatar" :src="editUserFrom.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditUser()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };

    return {
      queryInfo: {
        query: "",
        pageSize: 5,
        pageNum: 1
      },
      userList: [],
      total: 0,
      dialogFormVisible: false,
      editDialogFormVisible: false,
      addUserFrom: {
        username: "",
        email: "",
        phone: "",
        avatar: ""
      },
      editUserFrom: {
        username: "",
        password: "",
        email: "",
        phone: "",
        avatar: ""
      },
      // imageUrl: '',

      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "change" },
          { min: 3, max: 16, message: "长度在 3 到 16 个字符", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            message: "请输入正确的邮箱地址",
            trigger: "change"
          },
          { validator: checkEmail, trigger: "blur" }
        ],
        phone: [
          {
            required: true,
            message: "请输入正确的手机号码",
            trigger: "change"
          },
          { validator: checkMobile, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    search() {
      this.getUserList();
    },
    open(id) {
      this.$confirm("是否删除此用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.delete(
            "/admin/" + id
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
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize;
      this.getUserList();
    },
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNum = newPageNum;
      this.getUserList();
    },

    async changStatus(admin) {
      const res = await this.$http.post("admin/update", admin);
      if (res.data.code !== 0) return this.$message.error("操作失败");
      if (admin.status === true) return this.$message.success("账户已启用");
      return this.$message.error("账户已停用");

      //console.log(res);
    },
    async getUserList() {
      const res = await this.$http.get("/admin/list", {
        params: this.queryInfo
      });
      if (res.data.code !== 0) {
        return this.$message.error("获取用户数据失败！");
      }
      console.log(res.data);
      this.userList = res.data.data.admins;
      this.total = res.data.data.total;
    },
    handleAvatarSuccess(res, file) {
      this.addUserFrom.avatar = res;
      this.editUserFrom.avatar = res;
      //this.imageUrl = URL.createObjectURL(file.raw);
      console.log(res);
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
    async saveUser() {
      this.dialogFormVisible = false;
      const res = await this.$http.post(
        "/admin/insertOrUpdate",
        this.$qs.stringify(this.addUserFrom)
      );
      console.log(res);
      if (res.data.code !== 0) return this.$message.error("操作失败");
      this.resetField();
      this.getUserList();
      return this.$message.success("保存成功");
    },
    //重置表单
    resetField() {
      this.$refs.addUserFormRef.resetFields();
    },
    resetEditField() {
      this.$refs.editUserFormRef.resetFields();
    },
    editUser(res) {
      this.editDialogFormVisible = true;
      this.editUserFrom = res;
      // console.log(res)
    },
    async saveEditUser() {
      this.editDialogFormVisible = false;
      const res = await this.$http.post(
        "/admin/update",
        this.editUserFrom
        //this.$qs.stringify(this.editUserFrom)
      );
      console.log(res);
      this.resetEditField();
      this.getUserList();
      if (res.data.code !== 0) return this.$message.error("操作失败");
      return this.$message.success("保存成功");
    }
  }
};
</script>

<style   scoped>
.user-page {
  margin-top: 15px;
}
.user-table-list {
  margin-top: 15px;
}
.user-box-card {
  margin-top: 15px;
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
</style>