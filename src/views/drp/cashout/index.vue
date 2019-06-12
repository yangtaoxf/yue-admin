<template>
  <div class="app-container clearfix">
    <el-card class="filter-container"
             shadow="never">
      <div class="query-row">
        <div class="item-lable">起止时间</div>
        <a-date-picker :disabledDate="disabledStartDate"
                       showTime
                       format="YYYY-MM-DD HH:mm:ss"
                       v-model="listQuery.startDate"
                       placeholder="Start"
                       @openChange="handleStartOpenChange" />

        <span class="picker-seperator">至</span>
        <a-date-picker :disabledDate="disabledEndDate"
                       showTime
                       format="YYYY-MM-DD HH:mm:ss"
                       placeholder="End"
                       v-model="listQuery.endDate"
                       :open="endOpen"
                       @openChange="handleEndOpenChange" />
      </div>
      <div class="query-row">
        <div class="item-lable">分销员手机号</div>
        <a-input style=" width: 200px;"
                 v-model="listQuery.phone" />
      </div>
      <div class="query-row">
        <div class="item-lable"></div>
        <el-button type="primary"
                   @click="handleSearchList()"
                   size="small">
          查询搜索
        </el-button>
        <el-button @click="handleResetSearch()"
                   size="small">
          重置
        </el-button>
      </div>

    </el-card>

    <div class="table-container">
      <el-table ref="homeBrandTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection"
                         width="60"
                         align="center"></el-table-column>
        <el-table-column align="left"
                         label="手机号"
                         width="180"
                         prop="phone" />
        <el-table-column align="center"
                         label="账户信息"
                         :formatter="getAccountInfo"
                         prop="accountInfo">

        </el-table-column>

        <el-table-column align="center"
                         label="申请时间"
                         width="180"
                         prop="insertedAt" />
        <el-table-column align="center"
                         label="审核时间"
                         width="180"
                         prop="approvalTime" />

        <el-table-column align="center"
                         label="提现金额"
                         width="120"
                         prop="amount">
          <template slot-scope="scope">
            {{scope.row.amount+''}}
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="审核状态"
                         width="180"
                         prop="approvalStatus">
          <template slot-scope="scope">
            {{scope.row.approvalStatus |applyStatus}}
          </template>
        </el-table-column>

        <el-table-column label="操作"
                         width="100"
                         align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="handleUpdate(scope.$index, scope.row)">审核
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">

      <el-button style="margin-left: 20px"
                 class="search-button"
                 @click="handleBatchOperate()"
                 type="primary"
                 size="small">
        批量审批
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     layout="total, sizes,prev, pager, next,jumper"
                     :page-size="listQuery.pageSize"
                     :page-sizes="[5,10,15]"
                     :current-page.sync="listQuery.pageNum"
                     :total="total">
      </el-pagination>
    </div>
    <a-modal v-model="openApply"
             title="提现审核"
             onOk="handleOk">
      <template slot="footer">
        <a-button key="back"
                  @click="handleCancel">驳回</a-button>
        <a-button key="submit"
                  type="primary"
                  :loading="loadingApply"
                  @click="handleOk">
          通过
        </a-button>
      </template>

      <p>
        <label>提现金额:</label>{{currentRow.amount}}</p>
      <p>
        <label>银行名称:</label>{{currentRow.bankName}}</p>
      <p>
        <label>银行账号:</label>{{currentRow.bankAccount}}</p>
      <p>
        <label>开户人姓名:</label>{{currentRow.accountHolder}}</p>
    </a-modal>
  </div>
</template>
<script>
import { formatDate } from '@/utils/date';
import { cashOutList, updateCashOutApplyStatus } from '@/api/drp'
import global_ from '@/global'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  phone: null,
  startDate: null,
  endDate: null
};
export default {
  name: 'cashOutList',
  data () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      multipleSelection: [],
      loadingApply: false,
      openApply: false,
      currentRow: {},
      verifyStatusOptions: global_.drpPromoterApplyStatus,
      endOpen: false,
    }
  },
  created () {
    this.getList();
  },
  filters: {
    formatDate (time) {
      var date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    },
    applyStatus (value) {
      if (value == 1) {
        return '已审核';
      } else if (value == 0) {
        return '待审核';
      } else if (value == -1) {
        return '驳回';
      }
    }
  },
  methods: {
    getAccountInfo (row, column, cellValue) {
      let accountInfoJSON = JSON.parse(cellValue);
      return accountInfoJSON.bankName + "[" + accountInfoJSON.accountHolder + "]" + accountInfoJSON.bankAccount;
    },
    handleResetSearch () {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList () {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    handleSizeChange (val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleUpdate (index, row) {
      this.openApply = true;
      let applyRow = {};
      let accountInfoJSON = JSON.parse(row.accountInfo);
      applyRow.bankName = accountInfoJSON.bankName;
      applyRow.accountHolder = accountInfoJSON.accountHolder;
      applyRow.bankAccount = accountInfoJSON.bankAccount;
      applyRow.amount = row.amount;
      applyRow.id = row.id;
      this.currentRow = applyRow;
    },
    handleOk (e) {
      this.openApply = false;
      let ids = [];
      ids.push(this.currentRow.id);
      this.handleUpdateStatus(ids, "ok");
    },
    handleCancel (e) {
      this.openApply = false;
      let ids = [];
      ids.push(this.currentRow.id);
      this.handleUpdateStatus(ids, "no");
    },
    handleUpdateStatus (ids, status) {
      let params = new URLSearchParams();
      params.append("storeId", global_.sysConfig.storeId);
      params.append("ids", ids);
      params.append("applyResult", status);
      updateCashOutApplyStatus(params).then(response => {
        this.getList();
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      });
    },

    handleBatchOperate (status) {
      if (this.multipleSelection < 1) {
        this.$message({
          message: '请选择一条记录',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      let ids = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].id);
      }
      this.handleUpdateStatus(ids, status);
    },
    getList () {
      this.listLoading = true;
      this.listQuery.storeId = 1;
      cashOutList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      })
    },

    disabledStartDate (startValue) {
      const endValue = this.listQuery.endDate;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate (endValue) {
      const startValue = this.listQuery.startDate;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange (open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange (open) {
      this.endOpen = open;
    },
  }
}
</script>
<style>
.query-row {
  margin-bottom: 20px;
  display: flex;
  height: 32px;
  line-height: 32px;
}
.item-lable {
  width: 180px;
  text-align: right;

  padding-right: 20px;
}
.picker-seperator {
  font-size: 12px;
  color: #666;
  padding: 0 10px;
}
</style>



