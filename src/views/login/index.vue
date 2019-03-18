<template>

  <el-container class="login-page">
    <el-header></el-header>
    <el-main>
      <el-card class="login-form-layout">
        <el-form autoComplete="on"
                 :model="loginForm"
                 :rules="loginRules"
                 ref="loginForm"
                 label-position="left">
          <div style="text-align: center">
            <svg-icon icon-class="login-mall"
                      style="width: 56px;height: 56px;color: #f70"></svg-icon>
          </div>
          <h2 class="login-title color-main">桐源电商平台</h2>
          <el-form-item prop="username">
            <el-input name="username"
                      type="text"
                      v-model="loginForm.username"
                      autoComplete="on"
                      placeholder="请输入用户名">
              <span slot="prefix">
                <svg-icon icon-class="user"
                          class="color-main"></svg-icon>
              </span>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input name="password"
                      :type="pwdType"
                      @keyup.enter.native="handleLogin"
                      v-model="loginForm.password"
                      autoComplete="on"
                      placeholder="请输入密码">
              <span slot="prefix">
                <svg-icon icon-class="password"
                          class="color-main"></svg-icon>
              </span>
              <span slot="suffix"
                    @click="showPwd">
                <svg-icon icon-class="eye"
                          class="color-main"></svg-icon>
              </span>
            </el-input>
          </el-form-item>
          <el-form-item style="margin-bottom: 60px">
            <el-button style="width: 100%"
                       type="primary"
                       :loading="loading"
                       @click.native.prevent="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <div class="index-notice-box">
          <ul class="index-notice clearfix">
            <li>
              <h1>供应商入驻</h1>
              <p>桐源诚邀合作伙伴，加入桐源供应链</p>
              <a name="sop_index01_body_ruzhu_02"
                 target="_blank"
                 href="/#/register"
                 class="index-notice-btn merchantsSettled">我要入驻</a>
            </li>
          </ul>
        </div>
      </el-card>
      <img :src="login_center_bg"
           class="login-center-layout">
    </el-main>
    <el-footer>

    </el-footer>
  </el-container>

</template>

<script>
import { isvalidUsername } from '@/utils/validate';
import login_center_bg from '@/assets/images/login_center_bg.png'

export default {
  name: 'login',
  data () {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码不能小于3位'))
      } else {
        callback()
      }
    };
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      login_center_bg
    }
  },
  methods: {
    showPwd () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false;
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('参数验证不合法！');
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 0 auto;
  border-top: 10px solid #409eff;
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: #409eff;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 80px;
}
.login-page .el-main {
  padding: 0;
}
.index-notice {
  width: 286px;
  padding: 40px 0;
  margin: auto;
  list-style: none;
}
.index-notice > li {
  float: left;
  width: 286px;
  min-height: 170px;

  text-align: center;
  list-style: none;
}
a.index-notice-btn {
  display: inline-block;
  width: 160px;
  height: 46px;
  background: #f70;
  border-radius: 2px;
  text-align: center;
  font-size: 16px;
  line-height: 46px;
  color: #fff;
}
</style>
