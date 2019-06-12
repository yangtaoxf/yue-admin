<template> 

  <div class="drp-page">
    <div class="body-inner">
      <el-tabs v-model="activeName"
               type="card"
               @tab-click="handleClick">
        <el-tab-pane label="分销员"
                     name="drp-promoter"></el-tab-pane>
        <el-tab-pane label="商品列表"
                     name="drp-goods"></el-tab-pane>
        <el-tab-pane label="推广效果"
                     name="drp-effect"></el-tab-pane>
        <el-tab-pane label="业绩统计"
                     name="drp-count"></el-tab-pane>
        <el-tab-pane label="设置"
                     name="drp-setting"></el-tab-pane>
        <el-tab-pane label="招募计划"
                     name="drp-plan"></el-tab-pane>
        <el-tab-pane label="提现审核"
                     name="drp-cashout"></el-tab-pane>

      </el-tabs>
      <router-view />
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeName: 'drp-promoter'
    };
  },
  methods: {
    handleClick (tab, event) {
      this.$router.push({ name: tab.name });
    }
  }, mounted () {
    console.log("mounted|---------" + this.activeName);
    this.$router.push({ name: this.activeName });
  }, created: function () {

  },
  updated: function () {
    console.log("updated|---------" + this.activeName);
    if ("drp" == this.$router.currentRoute.name) {
      this.$router.push({ name: this.activeName });
    } else {
      this.$router.push({ name: this.$router.currentRoute.name });
    }

  }
};
</script>
<style>
.drp-header {
  height: 48px;
  line-height: 48px;
}
.drp-page {
  background: #f2f2f2;
  padding: 15px;
  position: relative;
}
.body-inner {
  background: #fff;
}
</style>

