<template>
  <el-card class="form-container"
           shadow="never">
    <el-form :model="productCate"
             :rules="rules"
             ref="productCateFrom"
             label-width="150px">
      <el-form-item label="类目名称："
                    prop="name">
        <el-input v-model="productCate.name"></el-input>
      </el-form-item>

      <el-form-item label="上级类目："
                    prop="parentId">
        <el-cascader v-model="selectParentCateValue"
                     :options="selectProductCateList"
                     :change-on-select="true"
                     expand-trigger="hover">
        </el-cascader>
      </el-form-item>

      <el-form-item v-for="(productCate, index) in filterProductCateList"
                    :label="index | backCateFilter"
                    :key="productCate.id">
        <el-cascader clearable
                     v-model="productCate.value"
                     :options="filterCates">
        </el-cascader>
        <el-button style="margin-left: 20px"
                   @click.prevent="removeFilterProductCate(productCate)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small"
                   type="primary"
                   @click="handleAddFilterProductCate()">新增</el-button>
      </el-form-item>

      <el-form-item label="排序：">
        <el-input v-model="productCate.sort"></el-input>
      </el-form-item>
      <el-form-item label="是否显示：">
        <el-radio-group v-model="productCate.showStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="是否显示在导航栏：">
        <el-radio-group v-model="productCate.navStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="类目图标：">
        <single-upload v-model="productCate.icon"></single-upload>
      </el-form-item>
      <el-form-item v-for="(filterProductAttr, index) in filterProductAttrList"
                    :label="index | filterLabelFilter"
                    :key="filterProductAttr.key">
        <el-cascader clearable
                     v-model="filterProductAttr.value"
                     :options="filterAttrs">
        </el-cascader>
        <el-button style="margin-left: 20px"
                   @click.prevent="removeFilterAttr(filterProductAttr)">删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small"
                   type="primary"
                   @click="handleAddFilterAttr()">新增</el-button>
      </el-form-item>
      <el-form-item label="关键词：">
        <el-input v-model="productCate.keywords"></el-input>
      </el-form-item>
      <el-form-item label="分类描述：">
        <el-input type="textarea"
                  :autosize="true"
                  v-model="productCate.description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="onSubmit('productCateFrom')">提交</el-button>
        <el-button v-if="!isEdit"
                   @click="resetForm('productCateFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { fetchList, createProductCate, updateProductCate, getProductCate, fetchListWithChildren } from '@/api/productFrontCate';
import { fetchListWithAttr } from '@/api/productAttrCate';
import { getProductAttrInfo } from '@/api/productAttr';
import SingleUpload from '@/components/Upload/aliyun/singleUpload';
import { fetchListWithChildren as fetchListWithProductCate } from '@/api/productCate'
const defaultProductCate = {
  description: '',
  icon: '',
  keywords: '',
  name: '',
  navStatus: 0,
  parentId: 0,
  productUnit: '',
  showStatus: 0,
  sort: 0,
  productAttributeIdList: [],
  backCategoryIdList: []
};
export default {
  name: "ProductCateDetail",
  components: { SingleUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      productCate: Object.assign({}, defaultProductCate),
      selectParentCateValue: [],
      selectProductCateList: [],
      rules: {
        name: [
          { required: true, message: '请输入类目名称', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ]
      },
      filterAttrs: [],
      filterProductAttrList: [{
        value: []
      }],
      filterCates: [],
      filterProductCateList: [{
        value: []
      }]
    }
  },
  created () {
    this.getProductCateList();
    this.getSelectProductCateList();
    this.getProductAttrCateList();
    if (this.isEdit) {
      getProductCate(this.$route.query.id).then(response => {
        this.productCate = response.data;
        this.selectParentCateValue.push(this.productCate.parentId);
        this.filterProductCateList = [];
        var backCategoryList = this.productCate.backCategoryList;
        for (let i = 0; i < backCategoryList.length; i++) {
          let back = backCategoryList[i];
          let valStr = back.path.split(",");
          let val = [];
          for (var j = 0; j < valStr.length; j++) {
            val.push(parseInt(valStr[j]));
          }
          val.push(back.id);
          console.log(val);
          let cateItem = {
            id: back.id,
            value: val
          }
          this.filterProductCateList.push(cateItem);
        }
      });
      getProductAttrInfo(this.$route.query.id).then(response => {
        if (response.data != null && response.data.length > 0) {
          this.filterProductAttrList = [];
          for (let i = 0; i < response.data.length; i++) {
            this.filterProductAttrList.push({
              key: Date.now() + i,
              value: [response.data[i].attributeCategoryId, response.data[i].attributeId]
            })
          }
        }
      });

    } else {
      this.productCate = Object.assign({}, defaultProductCate);
    }

  },
  methods: {
    getSelectProductCateList () {
      //前台类目
      fetchListWithChildren().then(response => {
        let list = response.data;
        for (let i = 0; i < list.length; i++) {
          let productCate = list[i];
          let children = [];
          if (productCate.children != null && productCate.children.length > 0) {
            for (let j = 0; j < productCate.children.length; j++) {
              children.push({
                label: productCate.children[j].name,
                value: productCate.children[j].id
              })
            }
          }
          this.selectProductCateList.push({ label: productCate.name, value: productCate.id, children: children });
        }
      });
    },
    getProductCateList () {
      //商品分类
      fetchListWithProductCate().then(response => {
        let list = response.data;
        for (let i = 0; i < list.length; i++) {
          let productCate = list[i];
          let children = [];
          if (productCate.children != null && productCate.children.length > 0) {
            for (let j = 0; j < productCate.children.length; j++) {
              children.push({
                label: productCate.children[j].name,
                value: productCate.children[j].id
              })
            }
          }
          this.filterCates.push({ label: productCate.name, value: productCate.id, children: children });
        }
      });
    },
    getProductAttrCateList () {
      //属性模版
      fetchListWithAttr().then(response => {
        let list = response.data;
        for (let i = 0; i < list.length; i++) {
          let productAttrCate = list[i];
          let children = [];
          if (productAttrCate.productAttributeList != null && productAttrCate.productAttributeList.length > 0) {
            for (let j = 0; j < productAttrCate.productAttributeList.length; j++) {
              children.push({
                label: productAttrCate.productAttributeList[j].name,
                value: productAttrCate.productAttributeList[j].id
              })
            }
          }
          this.filterAttrs.push({ label: productAttrCate.name, value: productAttrCate.id, children: children });
        }
      });

    },
    getProductAttributeIdList () {
      //获取选中的筛选商品属性
      let productAttributeIdList = [];
      for (let i = 0; i < this.filterProductAttrList.length; i++) {
        let item = this.filterProductAttrList[i];
        if (item.value !== null && item.value.length === 2) {
          productAttributeIdList.push(item.value[1]);
        }
      }

      return productAttributeIdList;
    },
    getBackCategoryIdList () {
      //获取选中的关联品类
      let backCategoryIdList = [];
      for (let i = 0; i < this.filterProductCateList.length; i++) {
        let item = this.filterProductCateList[i];
        let len = item.value.length;
        if (item.value != null && len > 0) {
          backCategoryIdList.push(item.value[len - 1]);
        }
      }

      return backCategoryIdList;
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.productCate.backCategoryIdList = this.getBackCategoryIdList();
            this.productCate.productAttributeIdList = this.getProductAttributeIdList();
            if (this.isEdit) {
              updateProductCate(this.$route.query.id, this.productCate).then(response => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                });
                this.$router.back();
              });
            } else {
              if (this.selectParentCateValue.length > 0) {
                var len = this.selectParentCateValue.length;
                this.productCate.parentId = this.selectParentCateValue[len - 1];
              }
              createProductCate(this.productCate).then(response => {
                this.$refs[formName].resetFields();
                this.resetForm(formName);
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
      this.productCate = Object.assign({}, defaultProductCate);
      this.getSelectProductCateList();
      this.filterProductAttrList = [{
        value: []
      }];
    },
    removeFilterProductCate (productCateId) {
      if (this.filterProductCateList.length === 1) {
        this.$message({
          message: '至少要留一个',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      var index = this.filterProductCateList.indexOf(productCateId);
      if (index !== -1) {
        this.filterProductCateList.splice(index, 1)
      }
    },
    removeFilterAttr (productAttributeId) {
      if (this.filterProductAttrList.length === 1) {
        this.$message({
          message: '至少要留一个',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      var index = this.filterProductAttrList.indexOf(productAttributeId);
      if (index !== -1) {
        this.filterProductAttrList.splice(index, 1)
      }
    },
    handleAddFilterAttr () {
      if (this.filterProductAttrList.length === 3) {
        this.$message({
          message: '最多添加三个',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      this.filterProductAttrList.push({
        value: null,
        key: Date.now()
      });
    },
    handleAddFilterProductCate () {
      if (this.filterProductCateList.length === 3) {
        this.$message({
          message: '最多添加三个',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      this.filterProductCateList.push({
        value: null,
        key: Date.now()
      });
    }
  },
  filters: {
    filterLabelFilter (index) {
      if (index === 0) {
        return '筛选属性：';
      } else {
        return '';
      }
    }, backCateFilter (index) {
      if (index === 0) {
        return '关联商品分类:';
      } else {
        return '';
      }
    }
  }
}
</script>

<style scoped>
</style>
