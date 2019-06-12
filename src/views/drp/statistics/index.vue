<template> 
  <div>
    <el-tabs v-model="activeName"
             type="card"
             @tab-click="handleClick">
      <el-tab-pane label="业绩统计"
                   name="count-performance"></el-tab-pane>
      <el-tab-pane label="佣金统计"
                   name="count-statistics"></el-tab-pane>
    </el-tabs>
    <router-view />
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeName: 'count-performance'
    };
  },
  methods: {
    handleClick (tab, event) {
      this.$router.push({ name: tab.name });
    }
  }, mounted () {
    this.$router.push({ name: this.activeName });
  }, created: function () {

  },
  updated: function () {
    this.$router.push({ name: this.activeName });
  },

};
</script>
<style>
.drp-header {
  height: 48px;
  line-height: 48px;
}
</style>

