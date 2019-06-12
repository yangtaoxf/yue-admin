<template> 
  <el-card class="form-container"
           shadow="never">
    <el-form :model="admin"
             :rules="rules"
             ref="adminFrom"
             label-width="150px">
      <el-form-item label="姓名:"
                    prop="name">
        <el-input v-model="admin.fullname"></el-input>
      </el-form-item>
      <el-form-item label="邮箱：">
        <el-input v-model="admin.email"></el-input>
      </el-form-item>
      <el-form-item label="头像："
                    prop="icon">
        <single-upload v-model="admin.icon"></single-upload>
      </el-form-item>

      <el-form-item label="登陆账号："
                    prop="name">
        <el-input v-model="admin.username"></el-input>
      </el-form-item>
      <el-form-item label="登陆密码："
                    prop="name"
                    v-if="!isEdit">
        <el-input v-model="admin.password"
                  show-password></el-input>
      </el-form-item>

      <el-form-item label="备注：">
        <el-input placeholder="请输入内容"
                  type="textarea"
                  v-model="admin.note"
                  :autosize="true"></el-input>
      </el-form-item>
      <el-form-item label="角色：">
        <a-checkbox-group :options="roles"
                          @change="onChange"
                          v-model="admin.roleList"
                          v-if="roles.length>0">
        </a-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="onSubmit('adminFrom')">提交</el-button>
        <el-button v-if="!isEdit"
                   @click="resetForm('adminFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { createAdmin, getAdmin, updateAdmin } from '@/api/admin'
import { all as roleAll } from '@/api/role'
import SingleUpload from '@/components/Upload/aliyun/singleUpload'
const defaultAdmin = {
  fullname: '',
  email: '',
  note: '',
  icon: '',
  username: '',

  roleList: []

};

export default {

  components: { SingleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      admin: Object.assign({}, defaultAdmin),
      rules: {
        username: [
          { required: true, message: '请输入登陆账号', trigger: 'blur' },
          { min: 4, max: 64, message: '长度在 4 到64 个字符', trigger: 'blur' }
        ]
      },
      roles: [],
      isUpdateRole: false
    }
  },
  created () {
    if (this.isEdit) {
      getAdmin(this.$route.query.id).then(response => {
        this.admin = response.data;
        this.admin.roleList = response.data.roleList.map(item => item.id);
      });
    } else {
      this.admin = Object.assign({}, defaultAdmin);
    }
    roleAll().then(response => {
      let list = response.data.list.map(function (item) {
        item.value = item.id
        item.label = item.name
        return item;
      })
      this.roles = list;
    })

  },
  methods: {
    onChange (checkedValues) {
      this.isUpdateRole = true;
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              this.admin.isUpdateRole = this.isUpdateRole;
              updateAdmin(this.$route.query.id, this.admin).then(response => {
                this.$refs[formName].resetFields();
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                });
                this.$router.back();
              });
            } else {
              createAdmin(this.admin).then(response => {
                this.$refs[formName].resetFields();
                this.admin = Object.assign({}, defaultAdmin);
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                });
              });
            }
          });

        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          });
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.admin = Object.assign({}, defaultAdmin);
    }
  }
}
</script>
<style>
</style>


