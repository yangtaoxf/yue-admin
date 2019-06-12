<template>
  <el-dialog title="设置链接页面"
             :visible.sync="selectDialogVisible"
             width="50%">
    <el-form ref="form"
             :model="form"
             label-width="80px">

      <el-form-item label="跳转类型">
        <el-select v-model="form.openType"
                   placeholder="请选择跳转类型">
          <el-option label="保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面"
                     value="navigateTo"></el-option>
          <el-option label="打开另一个小程序"
                     value="navigateToMiniProgram"></el-option>
          <el-option label="关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面"
                     value="redirectTo"></el-option>
          <el-option label="跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面"
                     value="switchTab"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="具体参数">
        <el-input type="textarea"
                  :rows=10
                  v-model="form.parameterJSON"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {

  data () {
    return {
      selectDialogVisible: false,
      form: {
        type: 'wxLink',
        openType: '',
        parameterJSON: '',
        parameter: {}
      }
    }
  }, methods: {
    show () {
      this.selectDialogVisible = true;

    },

    onSubmit () {
      var parameterObj = Object.assign({}, this.form);
      parameterObj.parameter = JSON.parse(parameterObj.parameterJSON.replace(/[\n\r]/g, ""));
      delete parameterObj.parameterJSON

      this.$emit('selectdLink', parameterObj);
      this.selectDialogVisible = false;
    }
  }
}

</script>