<template>
  <div id="drp-plan-warp">
    <div class="planContent">
      <div class="bg">
        <div class="header">

          <div class="title">{{data.title}}</div>

        </div>

        <div class="body"
             v-html="data.content"></div>
      </div>
      <div style="width:600px;float:left">
        <a-form @submit="handleSubmit">
          <a-form-item label="页面标题"
                       :validate-status="msg.title.validateStatus"
                       :help="msg.title.errorMsg || msg.title.tips">
            <a-input v-model="data.title"
                     @change="handleChange" />
          </a-form-item>
          <a-form-item :validate-status="msg.content.validateStatus"
                       :help="msg.content.errorMsg || msg.content.tips">
            <tinymce :height="300"
                     :width="600"
                     v-model="data.content">
              ></tinymce>
          </a-form-item>

          <a-form-item>
            <a-button type="primary"
                      html-type="submit">
              保存
            </a-button>
          </a-form-item>

        </a-form>
      </div>
      <br class="clear">
    </div>

  </div>
</template>
<script>
let storeId = 1;
import img_404 from '@/assets/images/gif_404.gif';
import Tinymce from '@/components/Tinymce'
import { plan, updatePlan } from '@/api/drp'
export default {
  components: { Tinymce },
  data () {
    return {
      data: {
        title: "分销员招募计划", content: "", storeId: storeId
      }
      , msg: {
        title: {
          errorMsg: '',
          tips: '',
          validateStatus: 'validating'
        },
        content: {
          errorMsg: '',
          tips: '',
          validateStatus: 'validating'
        }
      }

    }
  }, watch: {
    'data.content': {
      deep: true,
      handler: function (newVal, oldVal) {
        this.handleChange(newVal);
      }
    }
  }, methods: {
    init () {
      let than = this;
      this.listLoading = true;
      plan(storeId).then(response => {
        this.listLoading = false;
        let data = response.data;
        this.data = { ...data };
      });
    },
    handleChange (value) {
      var sign = true;
      if (this.data.title == "") {
        this.msg.title.errorMsg = "页面标题不能为空";
        this.msg.title.validateStatus = 'error';
        sign = false;
      } else {
        this.msg.title.errorMsg = "";
        this.msg.title.validateStatus = 'validating';
      }
      if (this.data.content == "") {
        sign = false;
        this.msg.content.errorMsg = "招募计划内容不能为空";
        this.msg.content.validateStatus = 'error';
      } else {
        this.msg.content.errorMsg = "";
        this.msg.content.validateStatus = 'validating';
      }
      return sign;
    },
    handleSubmit () {
      var sign = this.handleChange();
      if (sign) {
        updatePlan(this.data.id, this.data).then(response => {
          this.$message({
            message: '提交成功',
            type: 'success',
            duration: 1000
          });
        });
      }
    }
  }, mounted () {
    this.init();
  },
}
</script>
<style>
#drp-plan-warp .bg {
  width: 360px;
  height: 640px;
  background: url("../../../assets/images/wxpg.jpg");
  float: left;
  margin-right: 24px;
  position: relative;
}
#drp-plan-warp .body img {
  max-width: 100%;
  display: block;
  height: auto;
}
#drp-plan-warp .body {
  height: 575px;
  overflow: scroll;
}
#drp-plan-warp .header {
  width: 360px;
  height: 65px;
  position: relative;
}
#drp-plan-warp .title {
  color: #fff;
  margin-top: 32px;
  text-align: center;
}
.planContent {
  margin: auto auto auto 24px;
}
.clear {
  clear: both;
}
</style>
