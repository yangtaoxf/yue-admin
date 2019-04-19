<template> 
  <el-card class="form-container"
           shadow="never">
    <el-form :model="subject"
             :rules="rules"
             ref="subjectFrom"
             label-width="150px">
      <el-form-item label="专题名称："
                    prop="title">
        <el-input v-model="subject.title"></el-input>
      </el-form-item>

      <el-form-item label="专题主图：">
        <single-upload v-model="subject.pic"></single-upload>
      </el-form-item>
      <el-form-item label="相册：">
        <multi-upload v-model="selectSubjectPics"></multi-upload>
      </el-form-item>

      <el-form-item label="专题介绍">
        <tinymce :height="300"
                 v-model="subject.content"></tinymce>
      </el-form-item>
      <el-form-item label="备注">
        <el-input placeholder="请输入内容"
                  type="textarea"
                  v-model="subject.description"
                  :autosize="true"></el-input>
      </el-form-item>

      <el-form-item label="是否显示：">
        <el-radio-group v-model="subject.showStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   @click="onSubmit('subjectFrom')">提交</el-button>
        <el-button v-if="!isEdit"
                   @click="resetForm('subjectFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { createSubject, getSubject, updateSubject } from '@/api/subject'
import SingleUpload from '@/components/Upload/singleUpload'
import MultiUpload from '@/components/Upload/multiUpload'
import Tinymce from '@/components/Tinymce'
const defaultSubject = {
  categoryId: '',
  pic: '',
  title: "",
  albumPics: '',
  description: '',
  categoryName: '',
  content: '',
  showStatus: 0
};
export default {
  name: 'subjectDetail',
  components: { SingleUpload, MultiUpload, Tinymce },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      subject: Object.assign({}, defaultSubject),
      rules: {
        title: [
          { required: true, message: '请输入专题名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (this.isEdit) {
      getSubject(this.$route.query.id).then(response => {
        this.subject = response.data;
        if (!this.subject.content) {
          this.subject.content = "";
        }
      });
    } else {
      this.subject = Object.assign({}, defaultSubject);
    }
  },
  computed: {
    //画册图片
    selectSubjectPics: {
      get: function () {
        let pics = [];
        let albumPics = (this.subject.albumPics) ? this.subject.albumPics.split(',') : [];
        for (let i = 0; i < albumPics.length; i++) {
          pics.push(albumPics[i]);
        }
        return pics;
      },
      set: function (newValue) {
        if (newValue == null || newValue.length === 0) {
          this.subject.albumPics = null;
        } else {
          this.subject.albumPics = newValue.join();
        }
      }
    }
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateSubject(this.$route.query.id, this.subject).then(response => {
                this.$refs[formName].resetFields();
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                });
                this.$router.back();
              });
            } else {
              createSubject(this.subject).then(response => {
                this.$refs[formName].resetFields();
                this.subject = Object.assign({}, defaultSubject);
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
      this.subject = Object.assign({}, defaultSubject);
    },

  }
}
</script>
<style>
</style>


