<template>
  <div class="app-container clearfix">
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

          <el-form-item label="分销员手机号">
            <el-input v-model="
                        listQuery.salesmanPhone"
                      class="input-width"
                      style="width:200px"
                      placeholder="分销员手机号">
            </el-input>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input v-model="listQuery.orderSn"
                      class="input-width"
                      style="width:200px"
                      placeholder="订单号"></el-input>
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
                         width="50"
                         align="center"></el-table-column>

        <el-table-column align="center"
                         label="时间"
                         width="160"
                         prop="insertedAt">

          <template slot-scope="scope">
            {{scope.row.insertedAt| formatTime}}

          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="分销员昵称"
                         width="120"
                         prop="salesmanNickname" />

        <el-table-column align="center"
                         label="分销员手机号"
                         width="120"
                         prop="salesmanPhone" />
        <el-table-column align="center"
                         label="订单号"
                         width="180"
                         prop="orderSn" />
        <el-table-column align="center"
                         label="商品名称"
                         prop="productName" />
        <el-table-column align="center"
                         label="商品成交金额"
                         width="120"
                         prop="realAmount" />

        <el-table-column align="center"
                         label="佣金比例"
                         width="180"
                         prop="ratio">
          <template slot-scope="scope">
            {{scope.row.ratio}}%
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="佣金"
                         width="180"
                         prop="amount">
          <template slot-scope="scope">
            {{scope.row.amount }} 元
            <el-tooltip class="item"
                        v-if="scope.row.type==1"
                        effect="dark"
                        content="提成奖励"
                        placement="bottom-end">
              <i class="el-icon-caret-bottom"></i>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column align="center"
                         label="状态"
                         width="180"
                         prop="status">
          <template slot-scope="scope">
            {{scope.row.status |settleStatus}}
          </template>
        </el-table-column>
      </el-table>
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

  </div>
</template>
<script>
import { formatDate } from '@/utils/date';
import { commissionList } from '@/api/drp'
import global_ from '@/global'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  salesmanPhone: '',
  orderSn: '',
};
export default {
  name: 'commissionList',
  data () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      loading: false,
      openSetting: false,
      multipleSelection: [],
      currentRow: {},
    }
  },
  created () {
    this.getList();
  },
  filters: {
    settleStatus (value) {
      if (value == 10) {
        return '已结算';
      } else if (value == 0) {
        return '待结算';
      }
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


    getList () {
      this.listLoading = true;
      commissionList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      })
    }
  }
}
</script>
<style>
.goods-container .goods-thumb {
  float: left;
  margin-right: 15px;
  text-align: center;
  width: 50px;
}
.goods-container .goods-thumb img {
  height: 50px;
  max-height: 50px;
}
.goods-container .goods-title {
  line-height: 1.1;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.goods-container .goods-info__footer {
  display: inline-block;
  padding-top: 7px;
}
.goods-container .goods-price {
  color: #f60;
  margin-top: 5px;
  line-height: 12px;
}
.table-container a {
  color: #38f;
  cursor: pointer;
}
a,
a:hover {
  color: #38f;
}
a,
a:focus,
a:hover {
  color: #38f;
}
</style>


