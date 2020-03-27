<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/order' }" style="cursor:pointer">订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="order_detail-box-card">{{this.orderDetail}}</el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderDetail: "",
      filters: {
        id: ""
      }
    };
  },
  created() {
    this.id = this.$route.query.oid;
    this.getOrderDetailById(this.id);
    console.log(this.orderDetail);
  },
  methods: {
    async getOrderDetailById(id) {
      const res = await this.$http.post(
        "/admin/order/getOrderById",
        this.$qs.stringify({ id: id })
      );
      console.log(res);
      if (res.data.code !== 0) return this.$message.error("数据请求失败");
      this.orderDetail = res.data.data;
    }
  }
};
</script>
<style  >
.order_detail-box-card {
  margin-top: 15px;
}
</style>