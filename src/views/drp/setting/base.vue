<template> 
  <div class="setting-wrap">
    <el-form :model="drpSettingForm"
             ref="drpSettingForm"
             label-width="100px"
             label-position="left"
             class="demo-ruleForm">
      <div class="group">
        <div class="group-header">招募设置</div>
        <div class="group-body">
          <el-form-item label="邀请奖励"
                        label-width="128px"
                        prop="inviteOpen">
            <el-radio-group v-model="drpSettingForm.inviteOpen">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
            <div class="info">开启后,分销员可邀请好友成为其下级分销员。当下级分销员的客户发生购买,上级分销员可获得邀请奖励</div>
          </el-form-item>
          <el-form-item label="分销员招募"
                        label-width="128px"
                        prop="recruitOpen">
            <el-radio-group v-model="drpSettingForm.recruitOpen">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
            <div v-if="drpSettingForm.recruitOpen==1"
                 class="verify-block">

              <el-form-item label="分销员审核"
                            prop="verifyOpen">
                <el-radio-group v-model="drpSettingForm.verifyOpen">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
                <div class="info"
                     v-if="drpSettingForm.verifyOpen==1">若选择添加多个加入门槛，则必须同时满足才能申请成为分销员。</div>
                <div class="info"
                     v-else>不需要对分销员进行审核，申请可直接成为分销员</div>

                <div v-if="drpSettingForm.verifyOpen==1">
                  <el-divider></el-divider>
                  <el-form-item label="加入门槛">
                    <el-checkbox-group v-model="drpSettingForm.type">
                      <el-checkbox label="demandNeedShop"
                                   name="type">购买指定商品</el-checkbox>
                      <div class="view-link">
                        <el-link type="primary"
                                 href="/#/stm/subjectProductRelation?subjectId=8">查看指定商品<i class="el-icon-view el-icon--right"></i> </el-link>
                      </div>
                      <br>
                      <el-checkbox label="entryAmount"
                                   name="type">消费金额大于</el-checkbox>
                      <el-input style="width:100px"
                                v-model="drpSettingForm.demandBuyAmount">
                      </el-input>
                      <div class="unit inline">元</div>
                      <div class="info inline">支付后及计入消费金额</div>

                      <br>
                      <el-checkbox label="entryCount"
                                   name="type">消费笔数大于</el-checkbox>
                      <el-input style="width:100px"
                                v-model="drpSettingForm.demandBuyCount"> </el-input>
                      <div class="unit inline">笔</div>
                      <div class="info inline">支付后及计入消费金额</div>

                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="审核方式"
                                prop="verifyMode">
                    <el-radio-group v-model="drpSettingForm.verifyMode">
                      <el-radio :label="1">自动审核</el-radio>
                      <el-radio :label="0">人工审核</el-radio>
                    </el-radio-group>
                    <div class="info"
                         v-if="drpSettingForm.verifyMode==1">开启自动审核功能后,消费者达到加入门槛后可自动成为分销员,至少需要设置一个门槛</div>
                    <div class="info"
                         v-else>人工审核可不设置任何门槛。</div>
                  </el-form-item>
                </div>

              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item label="有效期设置"
                        label-width="128px"
                        prop="validityDay">
            <el-radio-group v-model="drpSettingForm.validityDay"
                            @change="changeProtectStatus">
              <el-radio :label="15">短期15天</el-radio>
              <el-radio :label="9999">永久</el-radio>
            </el-radio-group>
            <div class="info">有效期内,客户在小程序内购买商品的业绩都算在绑定的分销员上</div>
          </el-form-item>
          <el-form-item label="保护期设置"
                        label-width="128px"
                        prop="protectionOpen">
            <el-radio-group v-model="drpSettingForm.protectionOpen">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
            <div v-if="drpSettingForm.protectionOpen==1"
                 class="protection-block">

              <el-form-item prop="protectionDay">
                <el-radio-group v-model="protectionDaySet">
                  <el-radio :label="0">
                    <el-input style="width:100px"
                              v-model="protectionDay"> </el-input>
                    <div class="unit inline">天</div>
                  </el-radio>
                  <el-radio :label="1"
                            :disabled="protectionLong">永久</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="group">
        <div class="group-header">权益设置</div>
        <div class="group-body">
          <el-form-item label="分销员自购分佣"
                        prop="ownBuyRebateOpen"
                        label-width="128px">
            <el-radio-group v-model="drpSettingForm.ownBuyRebateOpen">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
            <div class="info"
                 v-if="drpSettingForm.ownBuyRebateOpen==1"> 开启后,所有分销员自己购买商品会获得佣金</div>
            <div class="info"
                 v-else> 关闭后,所有分销员自己购买商品不会获得佣金</div>
            <div v-if="drpSettingForm.ownBuyRebateOpen==0"
                 class="second-level-block">
              <el-form-item label="分销员建立客户关系"
                            prop="ownCustomerOpen"
                            label-width="148px">
                <el-radio-group v-model="drpSettingForm.ownCustomerOpen">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
                <div class="info"
                     v-if="drpSettingForm.ownCustomerOpen==1">开启后,允许分销员之间建立客户关系</div>
                <div class="info"
                     v-else>关闭后,不允许分销员之间建立客户关系</div>
              </el-form-item>
            </div>
          </el-form-item>

          <el-form-item label="结算方式"
                        label-width="128px"
                        prop="settleMode">
            <el-radio-group v-model="drpSettingForm.settleMode">
              <el-radio :label="0">自动结算</el-radio>
              <el-radio :label="1">人工结算</el-radio>
            </el-radio-group>
            <div v-if="drpSettingForm.settleMode==0">
              <a-table :columns="columns"
                       :dataSource="ruleList"
                       :pagination="false"
                       style="width:1000px"
                       bordered>

                <template slot="levelName"
                          slot-scope="text, record, index">
                  <div v-if="record.editable">

                    <a-input style="margin: -5px 0;width:160px;"
                             :value="record.levelName"
                             @change="e => handleChange(e.target.value, record.levelVal, 'levelName')" />

                  </div>
                  <div v-else>{{text}}</div>
                </template>

                <template slot="rule"
                          slot-scope="text, record, index">
                  <div v-if="record.levelVal==1">默认成为分销员后及是该等级</div>
                  <div v-else>
                    <div v-if="record.editable">
                      <a-checkbox-group @change="onChange"
                                        v-model="record.checkOptions">
                        <a-checkbox value="salesAmount">累计推广金达</a-checkbox>
                        <a-input style="margin: -5px 0;width:50px;height:20px"
                                 :value="record.salesAmount"
                                 @change="e => handleChange(e.target.value, record.levelVal, 'salesAmount')" />元
                        <br>
                        <a-checkbox value="salesBuyAmount">累计推广金和消费总额达</a-checkbox>
                        <a-input style="margin: -5px 0;width:50px;height:20px"
                                 :value="record.salesBuyAmount"
                                 @change="e => handleChange(e.target.value, record.levelVal, 'salesBuyAmount')" />元
                      </a-checkbox-group>
                    </div>
                    <div v-else
                         v-html="text"></div>
                  </div>
                </template>

                <template slot="rights"
                          slot-scope="text, record, index">
                  <div v-if="record.editable">
                    佣金比例
                    <a-input style="margin: -5px 0;width:50px;height:20px"
                             :value="record.rebateRatio"
                             @change="e => handleChange(e.target.value, record.levelVal, 'rebateRatio')" />%
                    <br>
                    邀请奖励佣金比例
                    <a-input style="margin: -5px 0;width:50px;height:20px"
                             :value="record.inviteRatio"
                             @change="e => handleChange(e.target.value, record.levelVal, 'inviteRatio')" />%
                  </div>
                  <div v-else
                       v-html="text"></div>
                </template>

                <template slot="operation"
                          slot-scope="text, record, index">
                  <div class='editable-row-operations'>
                    <span v-if="record.editable">
                      <a @click="() => save(record.key)">保存</a>
                      <a-popconfirm title='确定要取消?'
                                    @confirm="() => cancel(record.levelVal)">
                        <a>取消</a>
                      </a-popconfirm>
                    </span>
                    <span v-else>
                      <a @click="() => edit(record.key)">编辑</a>

                      <a @click="() => del(record.key)"
                         v-if="record.isPreset==false">删除</a>
                    </span>
                  </div>
                </template>
              </a-table>
              <a-button icon="plus"
                        @click="handleAdd">添加</a-button>
            </div>

            <div class="info"
                 v-else>需要手动计算销售员的佣金后，通过线下转账的方式进行佣金发放</div>
          </el-form-item>
        </div>
      </div>
      <div class="group">
        <div class="group-header">个性设置</div>
        <div class="group-body">
          <el-form-item label="分销员名称"
                        label-width="128px">
            <el-input v-model="drpSettingForm.name"
                      style="margin: -5px 0;width:160px;"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="group">

        <el-divider></el-divider>
        <div class="button">
          <el-form-item>
            <el-button type="primary"
                       @click="submitForm('drpSettingForm')">提交</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>

  </div>
</template>
<script>
let storeId = 1;
import { setting, updateSetting } from '@/api/drp'
const columns = [{
  title: '等级值',
  dataIndex: 'levelVal',
  width: '60px',
  scopedSlots: { customRender: 'levelVal' },
}, {
  title: '等级名',
  dataIndex: 'levelName',
  width: '100px',
  scopedSlots: { customRender: 'levelName' },
}, {
  title: '升级规则',
  dataIndex: 'rule',
  width: '228px',
  scopedSlots: { customRender: 'rule' },
}, {
  title: '等级权益',
  dataIndex: 'rights',
  width: '160px',
  scopedSlots: { customRender: 'rights' },
}, {
  title: '操作',
  dataIndex: 'operation',
  width: '100px',
  scopedSlots: { customRender: 'operation' },
}]


export default {
  data () {
    return {
      listLoading: true,
      drpSettingForm: {
        id: 0,
        inviteOpen: 0,
        recruitOpen: 1,
        verifyOpen: 0,
        type: [],
        demandBuyAmount: 0,
        demandBuyCount: 0,
        verifyMode: 0,
        validityDay: 15,
        protectionOpen: 0,
        protectionDay: 1,
        ownBuyRebateOpen: 0,
        ownCustomerOpen: 0,
        settleMode: 1,
        name: '分销员'
      },
      protectionDaySet: 0,
      protectionDay: 1,
      protectionLong: true,
      ruleList: [],
      columns,
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      let than = this;
      than.listLoading = true;
      setting(storeId).then(response => {
        than.listLoading = false;
        let data = response.data;
        let type = [];
        if (data.demandNeedShop) {
          type.push("demandNeedShop");
        }
        if (data.demandBuyAmount > 0) {
          type.push("entryAmount");
        }
        if (data.demandBuyCount > 0) {
          type.push("entryCount");
        }
        data.type = type;
        than.drpSettingForm = Object.assign(than.drpSettingForm, data);
        for (var i in than.drpSettingForm) {
          if (Object.prototype.toString.call(than.drpSettingForm[i]) == "[object Boolean]") {
            than.drpSettingForm[i] = than.drpSettingForm[i] ? 1 : 0;
          }
        }
        if (than.drpSettingForm.protectionDay >= 999) {
          than.protectionDaySet = 1;
        } else {
          than.protectionDaySet = 0;
          than.protectionDay = than.drpSettingForm.protectionDay;
        }
        this.changeProtectStatus(than.drpSettingForm.validityDay);
        let ruleList = data.ruleList;
        ruleList = ruleList.map(function (item) {
          item.key = item.levelVal;
          than.setShow(item);
          return item;
        });
        than.cacheData = ruleList.map(item => ({ ...item }))
        than.ruleList = ruleList;
      });
    },
    changeProtectStatus (val) {
      if (val >= 999) {
        this.protectionLong = false;
      } else {
        this.protectionLong = true;
        this.protectionDaySet = 0;
      }
    },
    setShow (item) {
      item['rule'] = "";
      item.checkOptions = [];
      if (item.levelVal == 1) {
        item['rule'] = "默认成为分销员后及是该等级";
      } else {
        if (item.salesAmount && item.salesAmount > 0) {
          item.checkOptions.push("salesAmount");
          item['rule'] = "累计推广金额达到" + item.salesAmount;
        }
        if (item.salesBuyAmount && item.salesBuyAmount > 0) {
          item.checkOptions.push("salesBuyAmount");
          if (item['rule'] != "") {
            item['rule'] += "<br>并且"
          }
          item['rule'] += "累计推广金和消费总额达" + item.salesBuyAmount;
        }
      }
      item['rights'] = "佣金比例" + item['rebateRatio'] + "%<br>邀请奖励佣金比例" + item['inviteRatio'] + "%";
    },
    submitForm (formName) {
      let than = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let mkType = than.drpSettingForm.type.join();
          if (mkType.indexOf("demandNeedShop") > -1) {
            than.drpSettingForm["demandNeedShop"] = 1;
          } else {
            than.drpSettingForm["demandNeedShop"] = 0;
          }
          if (mkType.indexOf("entryAmount") == -1) {
            than.drpSettingForm["demandBuyAmount"] = 0;
          }
          if (mkType.indexOf("entryCount") == -1) {
            than.drpSettingForm["demandBuyCount"] = 0;
          }

          if (than.protectionDaySet == 1) {
            than.drpSettingForm.protectionDay = 9999;
          } else {
            than.drpSettingForm.protectionDay = than.protectionDay;
          }
          if (than.drpSettingForm.protectionOpen == 0) {
            than.drpSettingForm.protectionDay = 0;
          }


          console.log(than.drpSettingForm);
          updateSetting(than.drpSettingForm.id, than.drpSettingForm).then(response => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1000
            });
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    }, onChange () {

    }, handleChange (value, key, column) {
      const newData = [...this.ruleList]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.setShow(target);
        this.ruleList = newData
      }
    },
    edit (key) {
      const newData = [...this.ruleList]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target.editable = true
        this.ruleList = newData
      }
    },
    del (key) {
      const newData = [...this.ruleList]
      const target = newData.filter(item => key != item.key)
      if (target) {
        this.ruleList = target
      }
    },
    save (key) {
      const newData = [...this.ruleList]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        delete target.editable
        this.ruleList = newData
        this.cacheData = newData.map(item => ({ ...item }))
      }
    },
    handleAdd () {
      const newData = [...this.ruleList];
      let rowData = Object.assign({}, newData[newData.length - 1]);
      rowData['key'] = new Number(rowData['key']) + 1;
      rowData['levelVal'] = rowData['key'];
      rowData['levelName'] = "待设置";
      rowData['checkOptions'] = [];
      rowData['salesAmount'] = 0;
      rowData['salesBuyAmount'] = 0;
      rowData['isPreset'] = false;
      this.setShow(rowData);
      newData.push(rowData);
      this.ruleList = newData;
    },
    cancel (key) {
      const newData = [...this.ruleList]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
        delete target.editable
        this.ruleList = newData
      }
    },
  },
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
}
</script>
<style>
.setting-wrap {
  padding: 16px 0 48px 0;
}
.setting-wrap .group {
  margin: 0 8px;
}
.setting-wrap .group .button {
  margin-left: 80px;
}

.setting-wrap .group .group-body {
  padding: 0px 48px;
  position: relative;
}
.inline {
  display: inline-block;
  font-size: 14px;
}
.group-body .unit {
  padding: 0 8px 0 4px;
}
.view-link {
  width: 200px;
  display: inline-block;
  padding: 0 0 5px 0;
}
.view-link a {
  vertical-align: baseline !important;
}

.setting-wrap .group .group-header {
  border-left: 4px #1890ff solid;
  padding: 0 12px;
}
.verify-block,
.protection-block,
.second-level-block {
  background: #f9f9f9;
}
</style>

