<template> 
  <div :style="{width:width,height:height}"
       id="againUpload">
    <el-upload action="http://ninesub-oss.oss-cn-shanghai.aliyuncs.com"
               :data="dataObj"
               :multiple="false"
               :before-upload="beforeUpload"
               :on-success="handleUploadSuccess"
               :style="{width:width,height:height}">
      <img :src="imageUrl"
           :style="{width:width,height:height}" />
      <div class="changeGraph">
        <svg-icon icon-class="change-graph" />切换图片
      </div>
    </el-upload>
  </div>
</template>

<style scoped>
.changeGraph {
  position: absolute;
  top: 16px;
  left: 16px;
  color: #ffffff;
}
</style>

<script>
import { policy } from '@/api/oss'

export default {
  name: 'singleUpload',
  props: {
    value: String,
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    }
  },
  computed: {
    imageUrl () {
      return this.value;
    },
    imageName () {
      if (this.value != null && this.value !== '') {
        return this.value.substr(this.value.lastIndexOf("/") + 1);
      } else {
        return null;
      }
    },
    fileList () {
      return [{
        name: this.imageName,
        url: this.imageUrl
      }]
    },
    showFileList: {
      get: function () {
        return this.value !== null && this.value !== '' && this.value !== undefined;
      },
      set: function (newValue) {
      }
    }
  },
  data () {
    return {
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: ''
      },
      dialogVisible: false
    };
  },
  methods: {
    emitInput (val) {
      this.$emit('input', val)
    },
    handleRemove (file, fileList) {
      this.emitInput('');
    },
    handlePreview (file) {
      this.dialogVisible = true;
    },
    beforeUpload (file) {
      let _self = this;
      return new Promise((resolve, reject) => {
        policy().then(response => {
          _self.dataObj.policy = response.data.policy;
          _self.dataObj.signature = response.data.signature;
          _self.dataObj.ossaccessKeyId = response.data.accessKeyId;
          _self.dataObj.key = response.data.dir + '/${filename}';
          _self.dataObj.dir = response.data.dir;
          _self.dataObj.host = response.data.host;
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    },
    handleUploadSuccess (res, file) {
      this.showFileList = true;
      this.fileList.pop();
      this.fileList.push({ name: file.name, url: this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name });
      this.emitInput(this.fileList[0].url);
    }
  }
}
</script>



