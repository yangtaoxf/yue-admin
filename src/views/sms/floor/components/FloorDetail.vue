<template> 
  <div>
    <el-card class="form-container"
             shadow="never">
      <el-form :model="floor"
               :rules="rules"
               ref="floorFrom"
               label-width="150px"
               size="medium">

        <el-form-item label="楼层Title："
                      prop="title">
          <el-input v-model="floor.title"
                    class="input-width"></el-input>
        </el-form-item>

        <el-form-item label="备注：">
          <el-input class="input-width"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入内容"
                    v-model="floor.description">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit('floorFrom')">提交</el-button>
          <el-button v-if="!isEdit"
                     @click="resetForm('floorFrom')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-container class="display-area">

      <el-main>
        <el-row>
          <el-col :span="2">
            "
          </el-col>
          <el-col :span="20">
            <div class="w">
              <div class="box-hd">
                <h2 class="title">
                  {{floor.title}}
                </h2>
                <div class="hot-word-con"> <a class="hot-word">
                    <el-dropdown @command="handleLinkCommand">
                      <span class="el-dropdown-link">
                        链接设置
                        <i class="el-icon-plus"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command='{"p":"w","v":"product"}'> 关联商品</el-dropdown-item>
                        <el-dropdown-item command='{"p":"w","v":"category"}'>关联分类</el-dropdown-item>
                        <el-dropdown-item command='{"p":"w","v":"subject"}'>关联主题</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </a> <a class="hot-word"
                     @click="delLink(index)"
                     v-for="(data,index ) in demoLinks"
                     :key="data.dataId">{{data.dataName}}
                    <svg-icon icon-class="close" />
                  </a></div>
                <!-- <div class="more"><a class="more-link"
                     href=""
                     target="_blank">查看全部
                    <svg-icon icon-class="more" /></a></div> -->
              </div>
              <div class="row">
                <div class="span4 span-first">
                  <ul class="brick-promo-list clearfix">
                    <li class="brick-item brick-item-l"
                        v-for="(banner, index) in demoBanners"
                        :key="index">
                      <again-upload v-model="banner.pic"
                                    style="width:100%;height:100%">
                      </again-upload>

                      <div class="linkSet">
                        <el-dropdown @command="handleLinkCommand">
                          <span class="el-dropdown-link">
                            链接设置
                            <i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command='{"p":"b","v":"product"}'
                                              :index="index"> 关联商品</el-dropdown-item>
                            <el-dropdown-item command='{"p":"b","v":"category"}'
                                              :index="index">关联分类</el-dropdown-item>
                            <el-dropdown-item command='{"p":"b","v":"subject"}'
                                              :index="index">关联主题</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </div>
                    </li>

                  </ul>
                </div>
                <div class="span16">
                  <ul class="brick-list clearfix">
                    <li class="brick-item brick-item-m brick-item-m-2"
                        v-for="(data,index ) in demoBrickList"
                        :key="data.id"
                        @click="toSetProduct(index)">

                      <div class="figure figure-img">
                        <a class="exposure">
                          <img :src="data.pic"
                               :alt="data.name"></a> </div>
                      <h3 class="title"> <a>{{data.name}}</a></h3>
                      <p class="desc">{{data.desc}}</p>
                      <p class="price"> <span class="num">{{data.price}}</span>元 <del><span class="num">1999</span>元</del> </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="2">
            "
          </el-col>
        </el-row>
      </el-main>
    </el-container>
    <select-product ref="productDialog"
                    @selectdProduct="setProduct"></select-product>
    <select-product ref="linkProductDialog"
                    :multiSelect="false"
                    @selectdProduct="setLink"></select-product>
    <selectFrontCategory ref="linkCategoryDialog"
                         :multiSelect="false"
                         @selectdProductCategory="setLink"></selectFrontCategory>
  </div>
</template>
<script>
import { createFloor, getFloor, updateFloor } from '@/api/pageFloor';
import againUpload from '@/components/Upload/againUpload'
import selectProduct from '@/components/Select/product'
import selectFrontCategory from '@/components/Select/frontCategory'

const defaultFloor = {
  pageCode: 'HOME',
  title: "待设置",
  templateId: 1,
  amount: null,
  floorIcon: null,
  sort: 0,
  description: null,
  createTime: null,
  showStatus: 0,
  note: null,
  deleteStatus: 0,
  blockContentJSON: null
};
const defaultTemplateContent = {
  links: [],
  brickItemLeft: [{
    pic: "https://i1.mifile.cn/a4/xmad_1544580545953_UvEXK.jpg",
    link: {
      type: "product",
      dataId: "",
      dataName: ""
    }
  }],
  productList: [
    {
      id: "DEMO_1",
      pic: "//i1.mifile.cn/a1/pms_1504498936.11861982!220x220.jpg",
      name: "待设置",
      description: "商品简述",
      price: "888.00"
    },
    {
      id: "DEMO_2",
      pic: "//i1.mifile.cn/a1/pms_1504498936.11861982!220x220.jpg",
      name: "待设置",
      description: "商品简述",
      price: "888.00"
    },
    {
      id: "DEMO_3",
      pic: "//i1.mifile.cn/a1/pms_1504498936.11861982!220x220.jpg",
      name: "待设置",
      description: "商品简述",
      price: "888.00"
    },
    {
      id: "DEMO_4",
      pic: "//i1.mifile.cn/a1/pms_1504498936.11861982!220x220.jpg",
      name: "待设置",
      description: "商品简述",
      price: "888.00"
    },
    {
      id: "DEMO_5",
      pic: "//i1.mifile.cn/a1/pms_1504498936.11861982!220x220.jpg",
      name: "待设置",
      description: "商品简述",
      price: "888.00"
    },
    {
      id: "DEMO_6",
      pic: "//i1.mifile.cn/a1/pms_1504498936.11861982!220x220.jpg",
      name: "待设置",
      description: "商品简述",
      price: "888.00"
    },
    {
      id: "DEMO_7",
      pic: "//i1.mifile.cn/a1/pms_1504498936.11861982!220x220.jpg",
      name: "待设置",
      description: "商品简述",
      price: "888.00"
    },
    {
      id: "DEMO_8",
      pic: "//i1.mifile.cn/a1/pms_1504498936.11861982!220x220.jpg",
      name: "待设置",
      description: "商品简述",
      price: "888.00"
    },
  ]
}
export default {
  name: 'FloorDetail',
  components: { againUpload, selectProduct, selectFrontCategory },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      floor: {},
      pic: "",
      currentProductIndex: 0,
      currentBannerIndex: 0,
      currentLinkCommand: {},
      demoBrickList: [],
      demoBanners: [],
      demoLinks: [],
      rules: {
        title: [
          { required: true, message: '请输入楼层Title', trigger: 'blur' },
          { min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur' }
        ],
      },
    }
  },
  created () {
    this.floor = Object.assign({}, defaultFloor);
    this.floor.blockContentJSON = {};
    if (this.floor.templateId === 1) {
      this.demoBanners = Object.assign([], defaultTemplateContent.brickItemLeft);
      this.demoBrickList = Object.assign([], defaultTemplateContent.productList);
    }
    if (this.isEdit) {
      getFloor(this.$route.query.id).then(response => {
        this.floor = response.data;
        this.floor.blockContentJSON = JSON.parse(this.floor.blockContent);
        if (this.floor.templateId === 1) {
          this.demoBrickList = this.floor.productList;
          this.demoBanners = this.floor.blockContentJSON.brickItemLeft;
          this.demoLinks = this.floor.blockContentJSON.links;
        }
      });
    }
  },
  methods: {
    onSubmit (formName) {
      var demoBrickList = this.demoBrickList;
      for (var i in demoBrickList) {
        let brick = demoBrickList[i];
        if ((typeof brick.id) == 'string' && brick.id.indexOf("DEMO") == 0) {
          this.$message({
            message: '有未设置商品不能提交',
            type: 'warning',
            duration: 2000
          });
          return;
        }
      }
      this.floor.blockContent = "";
      this.floor.blockContentJSON.brickList = [];
      if (this.floor.templateId === 1) {
        for (var i in demoBrickList) {
          let brick = demoBrickList[i];
          this.floor.blockContentJSON.brickList.push({ "dataId": brick.id });
        }
      }
      this.floor.blockContentJSON.links = this.demoLinks;
      this.floor.blockContentJSON.brickItemLeft = this.demoBanners;

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (this.isEdit) {
              updateFloor(this.$route.query.id, this.floor).then(response => {
                this.$refs[formName].resetFields();
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                });
                this.$router.back();
              });
            } else {
              createFloor(this.floor).then(response => {
                this.$refs[formName].resetFields();
                this.$message({
                  message: '提交成功',
                  type: 'success',
                  duration: 1000
                });
                this.$router.back();
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
    delLink (index) {
      this.demoLinks.splice(index, 1);
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.floor = Object.assign({}, defaultFloor);
    },
    toSetProduct (index) {
      this.$refs.productDialog.show();
      this.currentProductIndex = index;
    },
    handleLinkCommand (command, event) {
      this.currentLinkCommand = JSON.parse(command);
      console.log(this.currentLinkCommand);
      if (this.currentLinkCommand.p == "b") {
        this.currentBannerIndex = event.$attrs.index;
      }
      switch (this.currentLinkCommand.v) {
        case "product":
          this.$refs.linkProductDialog.show();
          break;
        case "category":
          this.$refs.linkCategoryDialog.show();
          break;
        default:
      }
    },
    setLink (data) {
      data = data[0];

      if (this.currentLinkCommand.p == "b") {
        var tempLink = {
          type: this.currentLinkCommand.v,
          dataId: data.id,
          dataName: data.name
        }
        this.floor.blockContentJSON.brickItemLeft[this.currentBannerIndex].link = tempLink;
      } else if (this.currentLinkCommand.p == "w") {

        var links = this.demoLinks;
        if (links) {
        } else {
          links = [];
        }
        var tempLink = {
          type: this.currentLinkCommand.v,
          dataId: data.id,
          dataName: data.name
        }
        links.push(tempLink);
      }
    },
    setProduct (products) {
      var brickList = this.demoBrickList;
      var tempIds = [];
      for (var i = 0; i < brickList.length; i++) {
        tempIds.push(brickList[i].id);
      }
      for (var i = 0; i < products.length; i++) {
        if ((tempIds.join() + ",").indexOf(products[i].id + ",") > -1) {
          this.$message({
            message: products[i].name + '重复设置',
            type: 'warning',
            duration: 2000
          });
          return;
        }
      }
      for (var i = 0; i < products.length; i++) {
        var index = new Number(this.currentProductIndex) + i;
        if (index < brickList.length) {
          this.$set(brickList, index, products[i]);
        }
      }

    }

  }
}
</script>
<style scoped>
.w {
  width: 1226px;
}
.row {
  margin-left: -14px;
}
.can-point {
  cursor: pointer;
}
.box-hd .title {
  margin: 0;
  font-size: 22px;
  font-weight: 200;
  line-height: 58px;
  color: #333;
  float: left;
}
.form-container {
  position: relative;
}
.box-hd {
  position: relative;
  height: 58px;
  -webkit-font-smoothing: antialiased;
}
.box-hd .more {
  position: absolute;
  top: 0;
  right: 0;
}
.box-hd .more .more-link {
  font-size: 16px;
  line-height: 58px;
  color: #424242;
  -webkit-transition: all 0.4s;
  transition: all 0.4s;
}
.box-hd .more .more-link .svg-icon {
  color: #b0b0b0;
}
.box-hd .hot-word-con {
  position: absolute;
  top: 0;
  right: 0;
  width: 800px;
  text-align: right;
}
.box-hd .hot-word-con .hot-word {
  display: inline-block;
  line-height: 58px;
  margin: 5px 10px;
  font-size: 14px;
  border: none;
  border-bottom: 1px solid #f5f5f5;
}
.box-hd .hot-word-con .hot-word:hover {
  text-decoration: underline;
}

.input-width {
  width: 60%;
}
.brick-list {
  list-style-type: none;
}
.brick-promo-list .brick-item .linkSet {
  position: absolute;
  top: 16px;
  right: 16px;
  color: #ffffff;
}
.brick-promo-list .brick-item .linkSet .el-dropdown {
  color: #ffffff;
}
.brick-list,
.brick-promo-list {
  height: 614px;
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.brick-item-l {
  height: 614px;
}
.brick-promo-list .brick-item-l img {
  height: 614px;
}
.display-area {
  background-color: #efefef;
}
.span1,
.span2,
.span3,
.span4,
.span5,
.span6,
.span7,
.span8,
.span9,
.span10,
.span11,
.span12,
.span13,
.span14,
.span15,
.span16,
.span17,
.span18,
.span19,
.span20 {
  float: left;
  margin-left: 14px;
  min-height: 1px;
}
.span4 {
  width: 234px;
}
.span16 {
  width: 978px;
}
.brick-list {
  width: 992px;
}
img {
  border: 0;
  -ms-interpolation-mode: bicubic;
}
.brick-item-m {
  height: 246px;
  padding: 34px 0 20px;
  *zoom: 1;
}

.brick-promo-list,
.brick-list {
  margin: 0 0 -14px -14px;
  _margin-left: 0;
}
.brick-item {
  position: relative;
  z-index: 1;
  float: left;
  width: 234px;
  margin-left: 14px;
  margin-bottom: 14px;
  background: #fff;
  -webkit-transition: all 0.2s linear;
  transition: all 0.2s linear;
}
.brick-item-m .desc {
  margin: 0 10px 10px;
  height: 18px;
  font-size: 12px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  _zoom: 1;
  color: #b0b0b0;
}
.brick-item-m .price del {
  color: #b0b0b0;
}
.brick-item-m .title,
.brick-item-m .title a {
  color: #333;
}
.brick-item-m .title a {
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  _zoom: 1;
}
.brick-item-m .title {
  margin: 0 10px;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
}
.brick-item-m .price {
  margin: 0 10px 10px;
  text-align: center;
  color: #ff6700;
}
.brick-item-m-2 {
  height: 300px;
  padding: 20px 0;
}

.brick-item-m .figure-img {
  width: 150px;
  height: 150px;
  margin: 0 auto 18px;
}
.brick-item-m-2 .figure-img {
  width: 160px;
  height: 160px;
}
.brick-item-m-2 .title {
  margin: 0 10px 2px;
}
.brick-item-m-2 .price {
  margin: 0 10px 14px;
}
.brick-item-m-2 .figure-img img {
  width: 160px;
  height: 160px;
}
li {
  display: list-item;
  text-align: -webkit-match-parent;
}
</style>


