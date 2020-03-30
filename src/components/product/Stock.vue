<template>
  <div>
    <el-row :gutter="12">
      <el-col :span="12">
        <el-card shadow="hover">
          <el-form
            ref="addSKUFormRef"
            :model="addSKUFrom"
            :rules="addSKUFormRules"
            label-width="80px"
          >
            <el-form-item label="属性" prop="title">
              <el-input v-model="addSKUFrom.title" placeholder="请输入商品名称" style="width:30%"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
              <el-input v-model="addSKUFrom.desc" placeholder="请输入商品名称" style="width:30%"></el-input>
            </el-form-item>
            <el-form-item label="库存" prop="num">
              <el-input-number
                v-model="addSKUFrom.num"
                @change="handleChange"
                :min="1"
                :max="10"
                label="描述文字"
              ></el-input-number>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <el-form
            ref="addSKUFormRef"
            :model="addSKUFrom"
            :rules="addSKUFormRules"
            label-width="80px"
          >
            <el-form-item label="属性" prop="title">
              <el-input v-model="addSKUFrom.title" placeholder="请输入商品名称" style="width:30%"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
              <el-input v-model="addSKUFrom.desc" placeholder="请输入商品名称" style="width:30%"></el-input>
            </el-form-item>
            <el-form-item label="库存" prop="num">
              <el-input-number
                v-model="addSKUFrom.num"
                @change="handleChange"
                :min="1"
                :max="10"
                label="描述文字"
              ></el-input-number>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addSKUFrom: { title: "", desc: "", num: 1 },
      addSKUFormRules: {},
      productId: "",
      input: ""
    };
  },
  created() {
    this.getId();
  },
  methods: {
    getId() {
      this.productId = this.$route.query.id;
    },

    handleChange(value) {
      console.log(value);
    }
  }
};
</script>
<style  >
.stock-box-card1 {
  margin-top: 15px;
  width: 40%;
}
.stock-box-card2 {
  margin-top: 15px;
  width: 40%;
}
</style>