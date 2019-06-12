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
                 v-model="listQuery.salesmanPhone" />
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
                v-loading="listLoading"
                border>

        <el-table-column align="left"
                         label="手机号"
                         width="180"
                         prop="phone" />
        <el-table-column align="center"
                         label="昵称"
                         width="120"
                         prop="nickName" />
        <el-table-column align="center"
                         label="等级"
                         width="180"
                         prop="levelName" />
        <el-table-column align="center"
                         label="客户数"
                         width="180"
                         prop="customerNumber" />
        <el-table-column align="center"
                         label="邀请人数"
                         width="180"
                         prop="nviteNumber" />
        <el-table-column align="center"
                         label="推广金"
                         width="120"
                         prop="turnoverAmount" />
        <!-- <el-table-column align="center"
                         label="累计成交额"
                         width="120"
                         prop="buyAmount" /> -->

      </el-table>
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
    </div>

  </div>
</template>
<script>
import { formatDate } from '@/utils/date';
import { performanceStatistics } from '@/api/drp'
import global_ from '@/global'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  salesmanPhone: null,
  startDate: null,
  endDate: null
};
export default {
  name: 'waitApplyList',
  data () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      endOpen: false

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

    handleSizeChange (val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.listQuery.pageNum = val;
      this.getList();
    },

    getList () {
      this.listLoading = true;

      performanceStatistics(this.listQuery).then(response => {
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



