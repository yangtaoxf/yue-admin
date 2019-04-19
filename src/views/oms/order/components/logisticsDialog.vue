<template> 
  <el-dialog title="订单跟踪"
             :visible.sync="visible"
             :before-close="handleClose"
             width="40%">
    <el-steps direction="vertical"
              :active="6"
              finish-status="success"
              space="50px">
      <el-step v-for="item in logisticsList"
               :key="item.no"
               :title="item.name"
               :description="item.time"></el-step>
    </el-steps>
  </el-dialog>
</template>
<script>
import { tracking } from '@/api/express'

export default {
  name: 'logisticsDialog',
  props: {
    value: Boolean
  },
  computed: {
    visible: {
      get () {
        return this.value;
      },
      set (visible) {
        this.value = visible;
      }
    }
  },
  data () {
    return {
      logisticsList: []
    }
  },
  methods: {
    emitInput (val) {
      this.$emit('input', val)
    },
    handleClose () {
      this.emitInput(false);
    },
    loadTracking (companyId, expNo) {
      var data = {
        companyId: companyId,
        sn: expNo
      }
      tracking(data).then(response => {
        var list = response.data.Traces;
        var len = list.length;
        for (var i = len - 1; i >= 0; i--) {
          var item = {
            no: i,
            name: list[i].acceptStation,
            time: list[i].acceptTime,
          }
          this.logisticsList.push(item);
        }
      }).catch(error => {
        this.logisticsList = [];
      });;
    }

  }
}
</script>
<style></style>


