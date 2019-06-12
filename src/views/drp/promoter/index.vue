<template> 

  <div>

    <el-tabs v-model="activeName"
             type="card"
             @tab-click="handleClick">
      <el-tab-pane label="分销员"
                   name="promoter-list"></el-tab-pane>
      <el-tab-pane label="审核信息"
                   name="promoter-review"></el-tab-pane>

    </el-tabs>
    <router-view />
  </div>
</template>
<script>
export default {
  data () {
    return {
      activeName: 'promoter-list'
    };
  },
  methods: {
    handleClick (tab, event) {
      this.$router.push({ name: tab.name });
    }
  }, mounted () {
    console.log("parmoter mounted|---------" + this.activeName);
    this.$router.push({ name: this.activeName });
  }, created: function () {
    console.log("mounted|---------" + this.activeName);
  },
  updated: function () {
    console.log("parmoter updated|---------" + this.activeName);
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

