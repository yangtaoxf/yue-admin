<template>
  <a-layout>
    <a-layout-header class="w">
      <div class="logo"
           id="registerHeader"><a target="_top"
           href="/">欢迎注册</a></div>
    </a-layout-header>
    <a-layout-content class="w">
      <div class="form-wrap">
        <div class="form-content">

          <a-steps :current="current">
            <a-step v-for="item in steps"
                    :key="item.title"
                    :title="item.title" />
          </a-steps>
          <div class="steps-content">
            <a-form id="form-register"
                    class="login-form"
                    :form="admin">
              <a-form-item label="电子邮箱"
                           :label-col="{ span: 4 }"
                           :wrapper-col="{ span: 8 }">
                <a-input v-decorator="['email',{ rules: [{ required: true, message: '请填写你的Email地址!' }] }]"
                         placeholder="请输入邮箱">
                </a-input>
              </a-form-item>
              <a-form-item :label-col="{ span: 4 }"
                           :wrapper-col="{ span: 10 }"
                           label="验证">
                <drag-verify @verifySuccess="verifySuccess"></drag-verify>
              </a-form-item>
              <div>
                <a-row>
                  <a-col :span="4"></a-col>
                  <a-col :span="16">
                    <a-checkbox @change="agreeLicense">同意桐源平台服务协议、隐私权政策 及法律声明</a-checkbox>
                  </a-col>
                </a-row>
                <a-row class="steps-action">
                  <a-col :span="4"></a-col>
                  <a-col :span="16">
                    <a-button type="primary"
                              v-if="agree"
                              @click="mailAuth">下一步</a-button>
                    <a-button type="primary"
                              disabled
                              v-else>下一步</a-button>
                  </a-col>
                </a-row>

              </div>
            </a-form>
          </div>

        </div>
      </div>

    </a-layout-content>
    <a-layout-footer class="w"></a-layout-footer>
  </a-layout>
</template>
<script>
export default {
  data () {
    return {
      current: 0,
      agree: false,
      slideVerify: false,
      admin: this.$form.createForm(this),
      steps: [{
        title: '设置用户名',
        content: 'First-content',
      }, {
        title: '填写账号信息',
        content: 'Second-content',
      }, {
        title: '注册成功',
        content: 'Last-content',
      }],
    }
  },
  methods: {
    next () {
      this.current++
    },
    prev () {
      this.current--
    },
    agreeLicense (e) {
      this.agree = e.target.checked;
    },
    mailAuth () {
      var email = this.admin.getFieldValue('email');
      console.log(this.admin);
      console.log(email + "-------------9999999999----" + this.slideVerify);
      if (null != email && this.slideVerify) {
        console.log("-------------9999999999--------");
      }
    },
    verifySuccess (status) {
      this.slideVerify = status;
    }
  }, created: function () {

  }

}
</script>

<style>
.w {
  width: 1190px;
  margin: auto;
}
.ant-layout-header {
  background: #409eff;
}
.logo {
  background: url("../../assets/images/logo.png") no-repeat 10px;
  padding-left: 248px;
  font-size: 20px;
  color: #fff;
}
#app {
  height: 100%;
}

.form-wrap {
  width: 100%;
  background: #fff;
}
.form-content {
  padding: 40px 50px;
}
.steps-content {
  margin-top: 16px;
  min-height: 200px;
}
#form-register {
  width: 720px;
  margin: auto;
  padding: 40px 0;
}
.steps-action {
  margin-top: 24px;
}
</style>
