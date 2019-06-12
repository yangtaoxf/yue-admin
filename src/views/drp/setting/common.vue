<template> 
  <div class="setting-wrap">
    <el-form :model="drpSettingForm"
             ref="drpSettingForm"
             label-width="100px"
             label-position="left"
             class="demo-ruleForm">
      <div class="group">
        <div class="group-header">其他设置</div>
        <div class="group-body">
          <el-form-item label="佣金结算时间"
                        label-width="128px"
                        prop="settleTimeMode">
            <el-radio-group v-model="drpSettingForm.settleTimeMode">
              <el-radio :label="0">交易完成结算</el-radio>
              <el-radio :label="1">售后维权期结束结算</el-radio>
            </el-radio-group>
            <div class="info"
                 v-if="drpSettingForm.settleTimeMode==0">一般情况下发货后7天内（含7天）给分销员结算佣金
              <br>
              风险提醒：若您选择交易完成结算的方式，则交易完成后发生的维权退款不影响已结算的佣金，可能会造成佣金亏损</div>
            <div class="info"
                 v-else>交易完成后需要再等15天，直到不会产生售后退款或处理完售后退款再给分销员结算佣金</div>

          </el-form-item>
          <el-form-item label="商品设置"
                        label-width="128px"
                        prop="goodsDefault">
            <el-radio-group v-model="drpSettingForm.goodsDefault">
              <el-radio :label="1">创建商品后默认参与推广</el-radio>
              <el-radio :label="0">创建商品后默认不参与推广</el-radio>
            </el-radio-group>

          </el-form-item>
        </div>
      </div>
      <div class="group">

        <el-divider></el-divider>
        <div class="button">
          <el-form-item>
            <el-button type="primary"
                       @click="submitForm('drpSettingForm')">提交</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>

  </div>
</template>
<script>
let storeId = 1;
import { setting, updateSetting } from '@/api/drp'


export default {
  data () {
    return {
      listLoading: true,
      drpSettingForm: {
        id: 0,
        settleTimeMode: 0,
        goodsDefault: 1
      },
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      let than = this;
      than.listLoading = true;
      setting(storeId).then(response => {
        than.listLoading = false;
        let data = response.data;
        this.drpSettingForm = data;
      });
    },

    submitForm (formName) {
      let than = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateSetting(than.drpSettingForm.id, than.drpSettingForm).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000
            });
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    }, onChange () {

    }
  }
}
</script>
<style>
.setting-wrap {
  padding: 16px 0 48px 0;
}
.setting-wrap .group {
  margin: 0 8px;
}
.setting-wrap .group .button {
  margin-left: 80px;
}

.setting-wrap .group .group-body {
  padding: 0px 48px;
  position: relative;
}
.inline {
  display: inline-block;
  font-size: 14px;
}
.group-body .unit {
  padding: 0 8px 0 4px;
}
.view-link {
  width: 200px;
  display: inline-block;
  padding: 0 0 5px 0;
}
.view-link a {
  vertical-align: baseline !important;
}

.setting-wrap .group .group-header {
  border-left: 4px #1890ff solid;
  padding: 0 12px;
}
.verify-block,
.protection-block,
.second-level-block {
  background: #f9f9f9;
}
</style>

