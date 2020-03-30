<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="product-box-card">
      <el-row :gutter="5">
        <el-col :span="4">
          <el-select v-model="parent" placeholder="请选择" @change="getChildCategory">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="child" placeholder="请选择" @change="getProductListByCategory">
            <el-option
              v-for="item1 in childCategoryList"
              :key="item1.id"
              :label="item1.name"
              :value="item1.id"
            ></el-option>
          </el-select>
        </el-col>

        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="searchContent">
            <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addNewProduct">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="productList"
        style="width: 100%;margin-bottom: 20px;margin-top:15px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="title" label="商品名称"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" @change="changStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
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
            <el-tooltip class="item" effect="dark" content="SKU" placement="top" :enterable="false">
              <el-button type="info" icon="el-icon-setting" circle @click="addSku(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 新增商品 -->
      <el-dialog title="添加商品" :visible.sync="dialogFormVisible">
        <el-form
          ref="addProductFormRef"
          :model="addProductFrom"
          :rules="addProductFormRules"
          label-width="80px"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="addProductFrom.title" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="副标题" prop="subtitle">
            <el-input v-model="addProductFrom.subTitle" placeholder="请输入商品副标题"></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="categoryId">
            <el-select v-model="addParent " placeholder="请选择" @change="getAddChildCategory">
              <el-option
                v-for="item in addCategoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select v-model="addChild " placeholder="请选择" @change="getCategoryId">
              <el-option
                v-for="item in addChildCategoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="addProductFrom.price" placeholder="请输入价格"></el-input>
          </el-form-item>
          <el-form-item label="库存" prop="stock">
            <el-input v-model="addProductFrom.stock" placeholder="请输入库存数"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="detail">
            <el-input v-model="addProductFrom.detail" placeholder="请输入商品描述"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <template slot-scope="scope">
              <el-switch v-model="addProductFrom.status"></el-switch>
            </template>
          </el-form-item>

          <el-form-item label="主图">
            <el-upload
              action="http://127.0.0.1:8081/admin/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="setImageList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="addProductFrom.mainImage" alt />
            </el-dialog>
          </el-form-item>
          <el-form-item label="详细图片">
            <el-upload
              action="http://127.0.0.1:8081/admin/upload"
              list-type="picture-card"
              :on-preview="detailHandlePictureCardPreview"
              :on-remove="detailHandleRemove"
              :on-success="setDetailImageList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="detailDialogVisible">
              <img width="100%" :src="addProductFrom.subImage" alt />
            </el-dialog>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveProduct()">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 编辑商品 -->
      <el-dialog title="编辑商品" :visible.sync="editDialogFormVisible">
        <el-form
          ref="editProductFormRef"
          :model="editProductFrom"
          :rules="addProductFormRules"
          label-width="80px"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="editProductFrom.title" placeholder="请输入商品名称"></el-input>
          </el-form-item>
          <el-form-item label="副标题" prop="subTitle">
            <el-input v-model="editProductFrom.subTitle" placeholder="请输入商品副标题"></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="categoryId">
            <el-select v-model="editParent " placeholder="请选择" @change="getAddChildCategory">
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select v-model="editChild " placeholder="请选择" @change="getCategoryId">
              <el-option
                v-for="item in childCategoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="editProductFrom.price" placeholder="请输入价格"></el-input>
          </el-form-item>
          <el-form-item label="库存" prop="stock">
            <el-input v-model="editProductFrom.stock" placeholder="请输入库存数"></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="detail">
            <el-input v-model="editProductFrom.detail" placeholder="请输入商品描述"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <template slot-scope="scope">
              <el-switch v-model="editProductFrom.status"></el-switch>
            </template>
          </el-form-item>

          <el-form-item label="主图">
            <el-upload
              action="http://127.0.0.1:8081/admin/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="setImageList"
              :file-list="editProductFrom.mainFileList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="editDialogVisible">
              <img width="100%" :src="editProductFrom.mainImageList" alt />
            </el-dialog>
          </el-form-item>
          <el-form-item label="详细图片">
            <el-upload
              action="http://127.0.0.1:8081/admin/upload"
              list-type="picture-card"
              :on-preview="detailHandlePictureCardPreview"
              :on-remove="detailHandleRemove"
              :on-success="setDetailImageList"
              :file-list="editProductFrom.detailFileList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="editDetailDialogVisible">
              <img width="100%" :src="editProductFrom.subImageList[0]" alt />
            </el-dialog>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateProduct()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: [],
      parent: "",
      child: "",
      productList: [],
      categoryList: [],
      childCategoryList: [],
      searchContent: "",
      dialogFormVisible: false,
      dialogImageUrl: "",
      dialogVisible: false,
      editDialogVisible: false,
      detailDialogImageUrl: "",
      detailDialogVisible: false,
      editDetailDialogVisible: false,
      addProductFrom: {
        title: "",
        subTitle: "",
        categoryId: "",
        status: true,
        price: "",
        stock: "",
        detail: "",
        mainImageList: [],
        subImageList: []
      },

      addCategoryList: "",
      addChildCategoryList: "",
      addParent: "",
      addChild: "",

      editParent: "",
      editChild: "",

      editDialogFormVisible: false,
      editProductFrom: {
        title: "",
        subTitle: "",
        categoryId: "",
        status: true,
        price: "",
        stock: "",
        detail: "",
        mainImageList: [],
        subImageList: [],

        detailFileList: [],
        mainFileList: []
      },

      addProductFormRules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 6 个字符", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getProductList();
    this.getCategoryList();
  },
  methods: {
    addSku(id) {
      this.$router.push({
        path: "/stock", //跳转路由
        query: {
          //参数对象
          id: id
        }
      });
    },

    async update(p) {
      var id = p.id;
      this.editDialogFormVisible = true;
      const res = await this.$http.post(
        "/admin/product/getById",
        this.$qs.stringify({ id: id })
      );
      console.log(res.data.data);
      this.editProductFrom = res.data.data;
      var arr = this.editProductFrom.subImageList;
      var arrImage = [];
      arr.forEach(function(e) {
        arrImage.push({
          url: e,
          name: e
        });
      });
      this.editProductFrom.detailFileList = arrImage;

      var arr1 = this.editProductFrom.mainImageList;
      var arrImage1 = [];
      arr1.forEach(function(e) {
        arrImage1.push({
          url: e,
          name: e
        });
      });
      this.editProductFrom.mainFileList = arrImage1;
      const res1 = await this.$http.post(
        "/admin/category/findParentById",
        this.$qs.stringify({ id: id })
      );

      if (res1.data.code !== 0) {
        return this.$message.error("获取分类数据失败！");
      }

      this.editParent = res1.data.data;
      this.editChild = p.categoryId;
      this.getChildCategory(res1.data.data);
    },

    //重置表单
    resetField() {
      this.$refs.addProductFrom.resetFields();
    },
    async saveProduct() {
      const res = await this.$http.post(
        "/admin/product/add",
        this.$qs.stringify(this.addProductFrom)
      );
      if (res.data.code !== 0) {
        return this.$message.error("添加失败！");
      }
      this.dialogFormVisible = false;
      this.options = res.data.data;
      this.getProductList();
      this.resetField();
    },

    setDetailImageList(response, file, fileList) {
      this.addProductFrom.subImageList.push(response);
    },
    setImageList(response, file, fileList) {
      this.addProductFrom.mainImageList.push(response);
    },

    handleRemove(file, fileList) {
      var a = this.addProductFrom.mainImageList.indexOf(file);
      this.addProductFrom.mainImageList.splice(a, 1);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url.blob;
      this.dialogVisible = true;
    },
    detailHandleRemove(file, fileList) {
      console.log(fileList);
      var a = this.addProductFrom.subImageList.indexOf(file);
      this.addProductFrom.subImageList.splice(a, 1);
    },
    detailHandlePictureCardPreview(file) {
      console.log(file.url);
      this.detailDialogImageUrl = file.url;
      this.detailDialogVisible = true;
    },
    async getProductList() {
      const res = await this.$http.get("/admin/product/list");
      if (res.data.code !== 0) return this.$message.error("获取数据失败");
      this.productList = res.data.data;
    },
    async getCategoryList() {
      const res = await this.$http.get("/admin/category/list");
      if (res.data.code !== 0) {
        return this.$message.error("获取分类数据失败！");
      }
      // console.log(res);
      this.categoryList = res.data.data;
      this.childCategoryList = [];
    },
    async getChildCategory(e) {
      console.log(e);
      const res = await this.$http.post(
        "/admin/category/allchildren",
        this.$qs.stringify({ pid: e })
      );
      if (res.data.code !== 0) {
        return this.$message.error("获取分类数据失败！");
      }
      this.childCategoryList = res.data.data;
    },
    async getProductListByCategory(e) {
      const res = await this.$http.post(
        "/admin/product/productByCategoryId",
        this.$qs.stringify({ id: e })
      );
      if (res.data.code !== 0) {
        return this.$message.error("获取分类数据失败！");
      }
      this.productList = res.data.data;
    },
    async search() {
      const res = await this.$http.post(
        "/admin/product/search",
        this.$qs.stringify({ content: this.searchContent })
      );
      if (res.data.code !== 0) {
        return this.$message.error("获取分类数据失败！");
      }
      this.productList = res.data.data;
    },
    async changStatus(product) {
      const res = await this.$http.post(
        "/admin/product/changeStatus",
        this.$qs.stringify({ id: product.id, status: product.status ? 1 : 0 })
      );
      console.log(res);
      if (res.data.code !== 0) return this.$message.error("操作失败");
      this.getCategoryList();
      if (product.status === true) return this.$message.success("商品已启用");
      return this.$message.error("商品已停用");
    },
    deleteCategoryOpen(id) {
      console.log(id);
      this.$confirm("是否删除此商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$http.post(
            "/admin/product/delete",
            this.$qs.stringify({ id: id })
          );
          if (res.data.code !== 0) return this.$message.error("删除失败");
          this.getProductList();
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
    async addNewProduct() {
      this.dialogFormVisible = true;
      const res = await this.$http.get("/admin/category/list");
      if (res.data.code !== 0) {
        return this.$message.error("获取分类数据失败！");
      }
      // console.log(res);
      this.addCategoryList = res.data.data;
    },
    async getAddChildCategory(e) {
      const res = await this.$http.post(
        "/admin/category/allchildren",
        this.$qs.stringify({ pid: e })
      );
      if (res.data.code !== 0) {
        return this.$message.error("获取分类数据失败！");
      }

      this.addChildCategoryList = res.data.data;
    },
    getCategoryId(e) {
      this.addProductFrom.categoryId = e;
    }
  }
};
</script>
<style >
.product-box-card {
  margin-top: 15px;
}
</style>