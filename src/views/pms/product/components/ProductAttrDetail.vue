<template>
  <div style="margin-top: 50px">
    <el-form :model="value"
             ref="productAttrForm"
             label-width="120px"
             size="small">
      <el-form-item label="属性类型：">
        <el-select v-model="value.productAttributeCategoryId"
                   placeholder="请选择属性类型"
                   @change="handleProductAttrChange">
          <el-option v-for="item in productAttributeCategoryOptions"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品规格：">
        <el-card shadow="never"
                 class="cardBg">
          <div v-for="(productAttr,idx) in selectProductAttr">
            {{productAttr.name}}：
            <el-checkbox-group v-if="productAttr.handAddStatus===0"
                               v-model="selectProductAttr[idx].values">
              <el-checkbox v-for="item in getInputListArr(productAttr.inputList)"
                           :label="item"
                           :key="item"
                           class="littleMarginLeft"></el-checkbox>
            </el-checkbox-group>
            <div v-else>
              <el-checkbox-group v-model="selectProductAttr[idx].values">
                <div v-for="(item,index) in selectProductAttr[idx].options"
                     style="display: inline-block"
                     class="littleMarginLeft"
                     :key="item">
                  <el-checkbox :label="item"
                               :key="item"></el-checkbox>
                  <el-button type="text"
                             class="littleMarginLeft"
                             @click="handleRemoveProductAttrValue(idx,index)">删除
                  </el-button>
                </div>
              </el-checkbox-group>
              <el-input v-model="addProductAttrValue"
                        style="width: 160px;margin-left: 10px"
                        clearable></el-input>
              <el-button class="littleMarginLeft"
                         @click="handleAddProductAttrValue(idx)">增加</el-button>
            </div>
          </div>
        </el-card>

        <el-table style="margin-top: 20px"
                  :data="skus"
                  border
                  id="skuTable">
          <el-table-column v-for="(item,index) in selectProductAttr"
                           :label="item.name"
                           :key="item.id"
                           align="left"
                           v-if="item.values.length>0"
                           class-name="skuColumn">
            <template slot-scope="scope">
              {{getValueName(scope.row,item)}}
            </template>
          </el-table-column>
          <el-table-column label="销售价格"
                           width="80"
                           align="right"
                           class-name="skuColumn">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="商品库存"
                           width="80"
                           align="right"
                           class-name="skuColumn">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="库存预警值"
                           width="100"
                           align="right"
                           class-name="skuColumn">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lowStock"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="SKU编号"
                           align="left"
                           class-name="skuColumn">
            <template slot-scope="scope">
              <el-input v-model="scope.row.skuCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="80"
                           align="left"
                           class-name="skuColumn">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="handleRemoveProductSku(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary"
                   style="margin-top: 20px"
                   @click="handleRefreshProductSkuList">刷新列表
        </el-button>
        <el-button type="primary"
                   style="margin-top: 20px"
                   @click="handleSyncProductSkuPrice">同步价格
        </el-button>
      </el-form-item>
      <el-form-item label="属性图片："
                    v-if="hasAttrPic">
        <el-card shadow="never"
                 class="cardBg">
          <div v-for="(item,index) in selectProductAttrPics">
            <span>{{item.name}}:</span>
            <single-upload v-model="item.pic"
                           style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品参数：">
        <el-card shadow="never"
                 class="cardBg">
          <div v-for="(item,index) in selectProductParam"
               :class="{littleMarginTop:index!==0}">
            <div class="paramInputLabel">{{item.name}}:</div>
            <el-select v-if="item.inputType===1"
                       class="paramInput"
                       v-model="selectProductParam[index].value"
                       :multiple="item.selectType==2">
              <el-option v-for="item in getParamInputList(item.inputList)"
                         :key="item"
                         :label="item"
                         :value="item">
              </el-option>
            </el-select>
            <el-input v-else
                      class="paramInput"
                      v-model="selectProductParam[index].value"></el-input>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品相册：">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>
      <el-form-item label="主图视频：">

        <localVideoUpload v-model="value.video"></localVideoUpload>

      </el-form-item>
      <el-form-item label="规格参数：">
        <el-tabs v-model="activeHtmlName"
                 type="card">
          <el-tab-pane label="电脑端详情"
                       name="pc">
            <tinymce :height="300"
                     v-model="value.detailHtml"></tinymce>
          </el-tab-pane>
          <el-tab-pane label="移动端详情"
                       name="mobile">
            <tinymce :height="300"
                     v-model="value.detailMobileHtml"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium"
                   @click="handlePrev">上一步，填写商品促销</el-button>
        <el-button type="primary"
                   size="medium"
                   @click="handleNext">下一步，选择商品关联</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchList as fetchProductAttrCateList } from '@/api/productAttrCate'
import { fetchList as fetchProductAttrList } from '@/api/productAttr'
import SingleUpload from '@/components/Upload/qiniu/singleUpload'
import MultiUpload from '@/components/Upload/qiniu/multiUpload'
import localVideoUpload from '@/components/Upload/localVideoUpload'

import Tinymce from '@/components/Tinymce'

export default {
  name: "ProductAttrDetail",
  components: { SingleUpload, MultiUpload, Tinymce, localVideoUpload },
  props: {
    value: Object,
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      //编辑模式时是否初始化成功
      hasEditCreated: false,
      //商品属性分类下拉选项
      productAttributeCategoryOptions: [],
      //选中的商品属性
      selectProductAttr: [],
      //选中的商品参数
      selectProductParam: [],
      //选中的商品属性图片
      selectProductAttrPics: [],
      //可手动添加的商品属性
      addProductAttrValue: '',
      //商品富文本详情激活类型
      activeHtmlName: 'pc',
      skus: this.value.skuStockList
    }
  },
  computed: {
    //是否有商品属性图片
    hasAttrPic () {
      if (this.selectProductAttrPics.length < 1) {
        return false;
      }
      return true;
    },
    //商品的编号
    productId () {
      return this.value.id;
    },
    //商品的主图和画册图片
    selectProductPics: {
      get: function () {
        let pics = [];
        if (this.value.pic === undefined || this.value.pic == null || this.value.pic === '') {
          return pics;
        }
        pics.push(this.value.pic);
        if (this.value.albumPics === undefined || this.value.albumPics == null || this.value.albumPics === '') {
          return pics;
        }
        let albumPics = this.value.albumPics.split(',');
        for (let i = 0; i < albumPics.length; i++) {
          pics.push(albumPics[i]);
        }
        return pics;
      },
      set: function (newValue) {
        if (newValue == null || newValue.length === 0) {
          this.value.pic = null;
          this.value.albumPics = null;
        } else {
          this.value.pic = newValue[0];
          this.value.albumPics = '';
          if (newValue.length > 1) {
            for (let i = 1; i < newValue.length; i++) {
              this.value.albumPics += newValue[i];
              if (i !== newValue.length - 1) {
                this.value.albumPics += ',';
              }
            }
          }
        }
      }
    }
  },
  created () {
    this.getProductAttrCateList();
  },
  watch: {
    productId: function (newValue) {
      if (!this.isEdit) return;
      if (this.hasEditCreated) return;
      if (newValue === undefined || newValue == null || newValue === 0) return;

      this.handleEditCreated();
      this.skus = this.value.skuStockList;
      this.skus.map((item) => {
        item.values = JSON.parse(item.specs);
        return item;
      })
    }
  },
  methods: {
    reBuild: function () {
      var vm = this;
      console.log(this.skus.values);
      var oriSkus = JSON.parse(JSON.stringify(this.skus));
      var vmSkus = this.skus = [];
      var propertyChecked = [];
      var skuCount = 1;
      var ori = [];
      var properties = this.selectProductAttr;
      properties.forEach(
        function (item, index) {
          var values = item.values;
          if (values.length > 0) {
            propertyChecked.push(index);
            skuCount *= values.length;
            var selectValues = [];
            for (index in values) {
              var tempVal = {
                attrId: item.id,
                name: item.name,
                value: values[index]
              }
              selectValues.push(tempVal);
            }
            ori.push(selectValues);
          }
        });
      console.log(JSON.stringify(ori))
      var ret = descartes(ori);
      console.log(JSON.stringify(ret));
      for (var i = 0; i < ret.length; i++) {
        var sku = { skuCode: "", price: "", stock: "" };
        sku.values = [];
        ret[i].forEach(
          function (item, index) {
            sku.values.push({ attrId: item.attrId, name: item.name, value: item.value });
          });

        if (oriSkus.length >= ret.length) {
          sku.skuCode = oriSkus[i].skuCode;
          sku.price = oriSkus[i].price;
          sku.stock = oriSkus[i].stock;
        } else {
          if (i < oriSkus.length) {
            sku.skuCode = oriSkus[i].skuCode;
            sku.price = oriSkus[i].price;
            sku.stock = oriSkus[i].stock;
          } else {
            sku.skuCode = "";
            sku.price = "";
            sku.stock = "";
          }
        }
        vmSkus.push(sku);
        this.value.skuStockList = vmSkus;
      }
    },
    getValueName: function (sku, property) {
      var valueName = "";
      sku.values.forEach(function (item, index) {
        var _item = item;
        if (item.attrId == property.id) {
          property.values.forEach(function (item, index) {
            if (_item.value == item) {
              valueName = item;
              return false;
            }
          })
        }
      });
      return valueName;
    },
    handleEditCreated () {
      //根据商品属性分类id获取属性和参数
      if (this.value.productAttributeCategoryId != null) {
        this.handleProductAttrChange(this.value.productAttributeCategoryId);
      }
      // this.reBuild();
      this.hasEditCreated = true;
    },
    getProductAttrCateList () {
      let param = { pageNum: 1, pageSize: 100 };
      fetchProductAttrCateList(param).then(response => {
        this.productAttributeCategoryOptions = [];
        let list = response.data.list;
        for (let i = 0; i < list.length; i++) {
          this.productAttributeCategoryOptions.push({ label: list[i].name, value: list[i].id });
        }
      });
    },
    getProductAttrList (type, cid) {
      let param = { pageNum: 1, pageSize: 100, type: type };
      fetchProductAttrList(cid, param).then(response => {
        let list = response.data.list;
        if (type === 0) {
          this.selectProductAttr = [];
          for (let i = 0; i < list.length; i++) {
            let options = [];
            let values = [];

            if (this.isEdit) {
              if (list[i].handAddStatus === 1) {
                //编辑状态下获取手动添加编辑属性
                options = this.getEditAttrOptions(list[i].id);
              }
              //编辑状态下获取选中属性
              values = this.getEditAttrOptions(list[i].id);
            }

            this.selectProductAttr.push({
              id: list[i].id,
              name: list[i].name,
              type: list[i].type,
              handAddStatus: list[i].handAddStatus,
              inputList: list[i].inputList,
              values: values,
              options: options
            });
          }
          if (this.isEdit) {
            //编辑模式下刷新商品属性图片
            this.refreshProductAttrPics();
          }
        } else {
          this.selectProductParam = [];
          for (let i = 0; i < list.length; i++) {
            let value = null;
            if (list[i].inputType == 1 && list[i].selectType == 2) {
              value = [];
            }
            if (this.isEdit) {
              //编辑模式下获取参数属性
              value = this.getEditParamValue(list[i].id);
              if (list[i].inputType == 1 && list[i].selectType == 2) {
                value = value.split(",");
              }
            }

            this.selectProductParam.push({
              id: list[i].id,
              name: list[i].name,
              value: value,
              inputType: list[i].inputType,
              selectType: list[i].selectType,
              inputList: list[i].inputList
            });
          }
        }
      });
    },
    //获取设置的可手动添加属性值
    getEditAttrOptions (id) {
      let options = [];
      for (let i = 0; i < this.value.productAttributeValueList.length; i++) {
        let attrValue = this.value.productAttributeValueList[i];
        if (attrValue.productAttributeId === id) {
          let strArr = attrValue.value.split(',');
          for (let j = 0; j < strArr.length; j++) {
            options.push(strArr[j]);
          }
        }
      }
      return options;
    },
    //获取属性的值
    getEditParamValue (id) {
      for (let i = 0; i < this.value.productAttributeValueList.length; i++) {
        if (id === this.value.productAttributeValueList[i].productAttributeId) {
          return this.value.productAttributeValueList[i].value;
        }
      }
    },
    handleProductAttrChange (value) {
      this.getProductAttrList(0, value);
      this.getProductAttrList(1, value);
    },
    getInputListArr (inputList) {
      return inputList.split(',');
    },
    handleAddProductAttrValue (idx) {
      let options = this.selectProductAttr[idx].options;
      if (this.addProductAttrValue == null || this.addProductAttrValue == '') {
        this.$message({
          message: '属性值不能为空',
          type: 'warning',
          duration: 1000
        });
        return
      }
      if (options.join().indexOf(this.addProductAttrValue) !== -1) {
        this.$message({
          message: '属性值不能重复',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      this.selectProductAttr[idx].options.push(this.addProductAttrValue);
      this.addProductAttrValue = null;
    },
    handleRemoveProductAttrValue (idx, index) {
      this.selectProductAttr[idx].options.splice(index, 1);
    },

    handleRefreshProductSkuList () {
      this.$confirm('刷新列表将导致sku信息重新生成，是否要刷新', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.reBuild();
        this.refreshProductAttrPics();
      });
    },
    handleSyncProductSkuPrice () {
      this.$confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.skus !== null && this.skus.length > 0) {
          let price = this.skus[0].price;
          for (let i = 1; i < this.skus.length; i++) {
            this.skus[i].price = price;
          }
        }
      });
    },
    refreshProductAttrPics () {
      this.selectProductAttrPics = [];
      if (this.selectProductAttr.length >= 1) {
        let values = this.selectProductAttr[0].values;
        for (let i = 0; i < values.length; i++) {
          let pic = null;
          if (this.isEdit) {
            //编辑状态下获取图片
            pic = this.getProductAttrPic(values[i]);
          }
          this.selectProductAttrPics.push({ name: values[i], pic: pic })
        }
      }
    },
    //获取商品相关属性的图片
    getProductAttrPic (name) {
      for (let i = 0; i < this.value.productAttributeValueList.length; i++) {
        if (name === this.value.productAttributeValueList[i].value) {
          return this.value.productAttributeValueList[i].picUrl;
        }
      }
      return null;
    },

    //设置属性的图片
    getAttrPic (name) {
      for (let i = 0; i < this.selectProductAttrPics.length; i++) {
        if (name === this.selectProductAttrPics[i].name) {
          return this.selectProductAttrPics[i].pic;
        }
      }
      return null;
    },
    //合并商品属性
    mergeProductAttrValue () {
      this.value.productAttributeValueList = [];
      for (let i = 0; i < this.selectProductAttr.length; i++) {
        let attr = this.selectProductAttr[i];
        if (attr.values != null && attr.values.length > 0) {
          for (var vi = 0; vi < attr.values.length; vi++) {
            var attrName = attr.values[vi];
            var pic = this.getAttrPic(attrName);
            this.value.productAttributeValueList.push({
              productAttributeId: attr.id,
              value: attrName,
              type: 0,
              picUrl: pic
            });
          }
        }
      }
      for (let i = 0; i < this.selectProductParam.length; i++) {
        let param = this.selectProductParam[i];
        let val = param.value;
        if (param.value instanceof Array) {
          val = val.join();
        }
        this.value.productAttributeValueList.push({
          productAttributeId: param.id,
          value: val,
          type: 1
        });
      }
    },
    //合并商品属性图片
    mergeProductAttrPics () {
      for (let i = 0; i < this.selectProductAttrPics.length; i++) {
        for (let j = 0; j < this.value.skuStockList.length; j++) {
          if (this.value.skuStockList[j].sp1 === this.selectProductAttrPics[i].name) {
            this.value.skuStockList[j].pic = this.selectProductAttrPics[i].pic;
          }
        }
      }
    },
    getOptionStr (arr) {
      let str = '';
      for (let i = 0; i < arr.length; i++) {
        str += arr[i];
        if (i != arr.length - 1) {
          str += ',';
        }
      }
      return str;
    },
    handleRemoveProductSku (index, row) {
      let list = this.skus;
      if (list.length === 1) {
        list.pop();
      } else {
        list.splice(index, 1);
      }
    },
    getParamInputList (inputList) {
      return inputList.split(',');
    },
    handlePrev () {
      this.$emit('prevStep')
    },
    handleNext () {
      this.mergeProductAttrValue();
      this.mergeProductAttrPics();
      this.$emit('nextStep')
    }
  }
}


function descartes (list) {
  //parent上一级索引;count指针计数
  var point = {};
  var result = [];
  var pIndex = null;
  var tempCount = 0;
  var temp = [];
  //根据参数列生成指针对象
  for (var index in list) {
    if (typeof list[index] == 'object') {
      point[index] = { 'parent': pIndex, 'count': 0 }
      pIndex = index;
    }
  }
  //单维度数据结构直接返回
  if (pIndex == null) {
    return list;
  }
  //动态生成笛卡尔积
  while (true) {
    for (var index in list) {
      tempCount = point[index]['count'];
      temp.push(list[index][tempCount]);
    }
    //压入结果数组
    result.push(temp);
    temp = [];
    //检查指针最大值问题
    while (true) {
      if (point[index]['count'] + 1 >= list[index].length) {
        point[index]['count'] = 0;
        pIndex = point[index]['parent'];
        if (pIndex == null) {
          return result;
        }
        //赋值parent进行再次检查
        index = pIndex;
      }
      else {
        point[index]['count']++;
        break;
      }
    }
  }
}
</script>

<style scoped>
.littleMarginLeft {
  margin-left: 10px;
}

.littleMarginTop {
  margin-top: 10px;
}
.el-input__inner {
  border: 1px solid #f8f9fc;
}
.paramInput {
  width: 250px;
}

.paramInputLabel {
  display: inline-block;
  width: 100px;
  text-align: right;
  padding-right: 10px;
}

.cardBg {
  background: #f8f9fc;
}
</style>
<style>
.skuColumn {
  padding: 2px 0 !important;
}
.skuColumn .el-input__inner {
  border-radius: 0;
}
</style>

