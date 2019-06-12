<template> 
  <div class="app-container">
    <el-card class="filter-container"
             shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right"
                   type="primary"
                   @click="handleSearchList()"
                   size="small">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px"
                   @click="handleResetSearch()"
                   size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true"
                 :model="listQuery"
                 size="small"
                 label-width="140px">
          <el-form-item label="昵称:">
            <el-input v-model="listQuery.nickname"
                      class="input-width"
                      placeholder="昵称"></el-input>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.approvalStatus"
                       placeholder="全部">
              <el-option v-for="item in verifyStatusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container"
             shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>

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
                         label="手机号码"
                         width="180"
                         prop="phone" />
        <el-table-column align="center"
                         label="昵称"
                         width="120"
                         prop="nickname" />
        <el-table-column align="center"
                         label="邀请方"
                         width="120"
                         prop="superiorNickname" />
        <el-table-column align="center"
                         label="邀请方电话"
                         width="180"
                         prop="superiorPhone" />

        <el-table-column align="center"
                         label="累计消费笔数"
                         width="120"
                         prop="buyCount" />
        <el-table-column align="center"
                         label="累计消费金额"
                         width="120"
                         prop="buyAmount" />

        <el-table-column align="left"
                         label="审核状态"
                         width="100"
                         prop="approvalStatus">
          <template slot-scope="scope">
            {{ scope.row.approvalStatus| drpPromoterApplyStatus }}
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="加入时间"
                         width="180"
                         prop="insertedAt">
          <template slot-scope="scope">
            {{ scope.row.insertedAt| formatDate }}
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
             title="分销员审核"
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

      <p><label>昵 称:</label>{{currentRow.nickname}}</p>
      <p><label>电 话:</label>{{currentRow.phone}}</p>
      <p><label>消费次数:</label>{{currentRow.buyCount}}</p>
      <p><label>消费金额:</label>{{currentRow.buyAmount}}</p>
    </a-modal>
  </div>
</template>
<script>
import { formatDate } from '@/utils/date';
import { applyPromoterList, updatePromoterApplyStatus } from '@/api/drp'
import global_ from '@/global'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  title: null,
  approvalStatus: global_.drpPromoterApplyStatus.WAIT_APPLY.value
};
export default {
  name: 'waitApplyList',
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
      verifyStatusOptions: global_.drpPromoterApplyStatus
    }
  },
  created () {
    this.getList();
  },
  filters: {
    formatDate (time) {
      var date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  },
  methods: {
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
      this.currentRow = row;
    },
    handleOk (e) {
      // this.loadingApply = true;
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
      updatePromoterApplyStatus(params).then(response => {
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
      applyPromoterList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      })
    }
  }
}
</script>
<style></style>


