<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="order-box-card">
      <el-row :gutter="5">
        <el-col :span="12">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" stripe style="width: 100%;margin-top :15px;" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="orderNo" label="订单号"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="payment" label="金额"></el-table-column>
        <el-table-column prop="paymentTime" label="日期"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <router-link
              :to="{path:  '/order_detail', query:{oid:scope.row.id}}"
              exact
              title="查看详情"
            >
              <el-button type="info" round>查看详情</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      orderList: []
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const res = await this.$http.get("/admin/order/list");
      console.log(res);
      if (res.data.code !== 0) return this.$message.error("数据请求失败");
      this.orderList = res.data.data;
    }
  }
};
</script>
<style  >
.order-box-card {
  margin-top: 15px;
}
</style>