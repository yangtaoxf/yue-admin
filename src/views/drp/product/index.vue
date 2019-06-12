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
          <el-form-item label="">
            <el-select v-model="listQuery.queryOption">
              <el-option v-for="item in queryOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="listQuery.keyword"
                      class="input-width"
                      style="width:200px"
                      placeholder="关键字"></el-input>
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
        <el-table-column align="left"
                         label="商品"
                         prop="title">
          <template slot-scope="scope">
            <div class="goods-container clearfix">
              <div class="goods-thumb">
                <img alt="example"
                     :src="scope.row.thumbUrl" />
              </div>
              <div class="goods-info">
                <p class="goods-title">
                  <a>{{scope.row.title}}</a>
                </p>
                <div class="goods-info__footer">
                  <p class="goods-price">￥{{scope.row.price}}</p>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="库存"
                         width="80"
                         prop="totalStockNum" />
        <el-table-column align="center"
                         label="总销量"
                         width="80"
                         prop="totalSoldNum" />
        <el-table-column align="center"
                         label="是否参与推广"
                         width="120"
                         prop="isJoin">
          <template slot-scope="scope">
            {{scope.row.isJoin | joinStatus}}
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="操作时间"
                         width="180"
                         prop="rateUpdatedAt" />
        <el-table-column label="操作"
                         width="100"
                         align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="handleSetting(scope.$index, scope.row)">设置
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
    <a-modal v-model="openSetting"
             title="修改产品佣金"
             onOk="handleOk"
             v-if="openSetting">
      <a-form>
        <a-form-item label="推广:"
                     :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }">
          <a-radio-group v-model="currentRow.isJoin">
            <a-radio :value="1">
              参与
            </a-radio>
            <a-radio :value="0">
              不参与
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="佣金:"
                     :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }">
          <a-radio-group @change="onChangeLevelRate"
                         v-model="currentRow.isDefault">
            <a-radio :value="0">
              默认佣金比例
            </a-radio>
            <a-radio :value="1">
              自定义佣金比例
            </a-radio>

          </a-radio-group>
        </a-form-item>
        <a-table bordered
                 :dataSource="dataSource"
                 :pagination="false"
                 :columns="columns">
          <template slot="name"
                    slot-scope="text">
            {{text}}
          </template>
          <template v-for="col in inputColums"
                    :slot="col"
                    slot-scope="text, record, index">
            <div :key="col">
              <div v-if="record.editable">
                <a-input style="margin: -5px 0"
                         :value="text"
                         addonAfter="%"
                         @change="e => handleChange(e.target.value, record.key, col)" />
              </div>
              <template v-else>{{text}}%</template>
            </div>
          </template>

        </a-table>

      </a-form>
      <template slot="footer">
        <a-button key="submit"
                  type="primary"
                  :loading="loading"
                  @click="handleOk">
          确定
        </a-button>
        <a-button key="back"
                  @click="handleCancel">取消</a-button>

      </template>

    </a-modal>
  </div>
</template>
<script>
import { formatDate } from '@/utils/date';
import { goodsList, goodsItem, setLevelRate } from '@/api/drp'
import global_ from '@/global'
const columns = [{
  title: '分销员',
  dataIndex: 'name',
  scopedSlots: { customRender: 'name' },
  width: 150,
}];
const data = [];
data.push({
  key: 0,
  name: "佣金比例"
});
data.push({
  key: 1,
  name: "邀请奖励佣金比例"
});
const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  keyword: null,
  queryOption: 0,
};
export default {
  name: 'drpGoodsList',
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
      dataSource: data,
      columns: columns,
      inputColums: [],
      queryOptions: [{
        value: 0,
        label: '全部商品'
      }, {
        value: 1,
        label: '不参与推广的商品'
      }, {
        value: 2,
        label: '自定义比例的商品'
      }, {
        value: 3,
        label: '参加推广的商品'
      }]
    }
  },
  created () {
    this.getList();
  },
  filters: {
    joinStatus (value) {
      if (value === 1) {
        return '参与';
      } else {
        return '不参与';
      }
    }
  },
  methods: {
    onCellChange (key, dataIndex, value) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
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
    handleSetting (index, row) {
      this.dataSource = [];
      let parm = {
        productId: row.productId,
        storeId: global_.sysConfig.storeId
      }
      goodsItem(parm).then(response => {
        const newData = [...data];
        const newColumns = [...columns]
        const inputColums = [];
        let goodsLevelRate = response.data.goodsLevelRate;;

        for (var index in goodsLevelRate) {
          var levelRate = goodsLevelRate[index];

          var levelValName = "levelVal-" + levelRate.levelVal;
          var idName = "id-" + levelRate.levelVal;
          var levelName = "levelName-" + levelRate.levelVal;

          newColumns.push(
            {
              title: levelRate.levelName,
              dataIndex: levelValName,
              scopedSlots: { customRender: levelValName },
            }
          );

          inputColums.push(levelValName);
          newData[0][idName] = levelRate.id;
          newData[0][levelName] = levelRate.levelName;
          newData[0][levelValName] = levelRate.rebateRatio;
          newData[1][idName] = levelRate.id;
          newData[1][levelName] = levelRate.levelName;
          newData[1][levelValName] = levelRate.inviteRatio;
        }
        this.inputColums = inputColums;
        this.columns = newColumns;
        this.dataSource = newData;
        this.openSetting = true;
      })
      this.currentRow = { ...row };
      if (this.currentRow.isDefault == null) {
        this.currentRow.isDefault = 0;
      }
    },
    handleOk (e) {
      this.openSetting = false;
      let ids = [];
      ids.push(this.currentRow.productId);
      this.setLevelRate(ids);
    },
    handleCancel (e) {
      this.openSetting = false;
    },
    setLevelRate (ids) {
      let goodsLevelRate = [];
      let data = this.dataSource;
      let inputColums = this.inputColums;
      let currentRow = this.currentRow;
      for (var index in inputColums) {
        var colums = inputColums[index];
        var index = colums.lastIndexOf("\-");
        var levelVal = colums.substring(index + 1, colums.length);

        var idName = "id-" + levelVal;
        var levelValName = "levelVal-" + levelVal;
        var levelName = "levelName-" + levelVal;
        goodsLevelRate.push({
          id: data[0][idName],
          levelVal: levelVal,
          levelName: data[0][levelName],
          rebateRatio: data[0][levelValName],
          inviteRatio: data[1][levelValName]
        });
      }
      let params = {
        ids: ids,
        isJoin: currentRow.isJoin,
        isDefault: currentRow.isDefault,
        goodsLevelRate: goodsLevelRate
      }
      setLevelRate(params).then(response => {
        this.getList();
        this.$message({
          type: 'success',
          message: '操作成功!'
        });
      });
    },
    handleChange (value, key, column) {
      const newData = [...this.dataSource]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        newData[key][column] = value;
        this.dataSource = newData
      }
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
      goodsList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      })
    },//改变佣金比例
    onChangeLevelRate (e) {
      var isDefault = e.target.value;
      const newData = [...this.dataSource]
      if (isDefault == 1) {
        newData[0]['editable'] = true;
        newData[1]['editable'] = true;
      } else {
        newData[0]['editable'] = false;
        newData[1]['editable'] = false;
      }
      this.dataSource = newData;
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


