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
          <el-form-item label="商品名称：">
            <el-input v-model="listQuery.keyword"
                      class="input-width"
                      placeholder="商品名称"></el-input>
          </el-form-item>

        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container"
             shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini"
                 class="btn-add"
                 @click="handleSelectProduct()"
                 style="margin-left: 20px">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productRelationTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection"
                         width="60"
                         align="center"></el-table-column>
        <el-table-column label="编号"
                         width="60"
                         align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品名称"
                         align="left">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="货号"
                         width="240"
                         align="left">
          <template slot-scope="scope">NO.{{scope.row.productSn}}</template>
        </el-table-column>
        <el-table-column label="商品价格"
                         width="100"
                         align="right">
          <template slot-scope="scope">￥{{scope.row.price}}</template>
        </el-table-column>

        <el-table-column label="操作"
                         width="100"
                         align="center">
          <template slot-scope="scope">

            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select size="small"
                 v-model="operateType"
                 placeholder="批量操作">
        <el-option v-for="item in operates"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button style="margin-left: 20px"
                 class="search-button"
                 @click="handleBatchOperate()"
                 type="primary"
                 size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     layout="total, sizes,prev, pager, next,jumper"
                     :current-page.sync="listQuery.pageNum"
                     :page-size="listQuery.pageSize"
                     :page-sizes="[5,10,15]"
                     :total="total">
      </el-pagination>
    </div>
    <el-dialog title="选择商品"
               :visible.sync="selectDialogVisible"
               width="50%">
      <el-input v-model="dialogData.listQuery.keyword"
                style="width: 250px;margin-bottom: 20px"
                size="small"
                placeholder="商品名称搜索">
        <el-button slot="append"
                   icon="el-icon-search"
                   @click="handleSelectSearch()"></el-button>
      </el-input>
      <el-table :data="dialogData.list"
                @selection-change="handleDialogSelectionChange"
                border>
        <el-table-column type="selection"
                         width="60"
                         align="center"></el-table-column>
        <el-table-column label="商品名称"
                         align="left">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="货号"
                         width="240"
                         align="left">
          <template slot-scope="scope">NO.{{scope.row.productSn}}</template>
        </el-table-column>
        <el-table-column label="价格"
                         width="120"
                         align="center">
          <template slot-scope="scope">￥{{scope.row.price}}</template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background
                       @size-change="handleDialogSizeChange"
                       @current-change="handleDialogCurrentChange"
                       layout="prev, pager, next"
                       :current-page.sync="dialogData.listQuery.pageNum"
                       :page-size="dialogData.listQuery.pageSize"
                       :page-sizes="[5,10,15]"
                       :total="dialogData.total">
        </el-pagination>
      </div>
      <div style="clear: both;"></div>
      <div slot="footer">
        <el-button size="small"
                   @click="selectDialogVisible = false">取 消</el-button>
        <el-button size="small"
                   type="primary"
                   @click="handleSelectDialogConfirm()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { fetchProductList as fetchSubjectProductList, createProductRelation, deleteProductRelation } from '@/api/subject';
import { fetchList as fetchProductList } from '@/api/product';
const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5
};
export default {
  name: 'subjectProductRelationList',
  data () {
    return {
      subjectId: 0,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      dialogVisible: false,
      selectDialogVisible: false,
      multipleSelection: [],
      dialogData: {
        list: null,
        total: null,
        multipleSelection: [],
        listQuery: {
          keyword: null,
          pageNum: 1,
          pageSize: 5
        }
      },
      operateType: null,
      operates: [
        {
          label: "删除",
          value: 2
        }
      ],
    }
  },
  created () {
    this.subjectId = this.$route.query.subjectId;
    this.getList();
  },
  methods: {
    handleSizeChange (val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSelectProduct () {
      this.selectDialogVisible = true;
      this.getDialogList();
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    handleSearchList () {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleResetSearch () {
      this.listQuery = Object.assign({}, defaultListQuery);
      this.getList();
    },
    handleBatchOperate () {
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
      if (this.operateType === 2) {

        let data = new URLSearchParams();
        data.append("productIds", ids);
        deleteProductRelation(this.subjectId, data).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        });
      } else {
        this.$message({
          message: '请选择批量操作类型',
          type: 'warning',
          duration: 1000
        });
      }
    },
    handleDelete (index, row) {
      this.$confirm('是否要删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var ids = [];
        ids.push(row.id);
        let data = new URLSearchParams();
        data.append("productIds", ids);
        deleteProductRelation(this.subjectId, data).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getList();
        });
      });
    },
    handleSelectSearch () {
      this.getDialogList();
    },
    handleDialogSizeChange (val) {
      this.dialogData.listQuery.pageNum = 1;
      this.dialogData.listQuery.pageSize = val;
      this.getDialogList();
    },
    handleDialogCurrentChange (val) {
      this.dialogData.listQuery.pageNum = val;
      this.getDialogList();
    },
    handleDialogSelectionChange (val) {
      this.dialogData.multipleSelection = val;
    },
    handleSelectDialogConfirm () {
      if (this.dialogData.multipleSelection < 1) {
        this.$message({
          message: '请选择一条记录',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      let productIds = [];
      for (let i = 0; i < this.dialogData.multipleSelection.length; i++) {
        productIds.push(this.dialogData.multipleSelection[i].id);
      }
      this.$confirm('使用要进行添加操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = new URLSearchParams();
        data.append("productIds", productIds);
        createProductRelation(this.subjectId, data).then(response => {
          this.selectDialogVisible = false;
          this.dialogData.multipleSelection = [];
          this.getList();
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
        });
      });
    },

    getList () {
      this.listLoading = true;
      console.log(this.listQuery);
      fetchSubjectProductList(this.subjectId, this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    getDialogList () {
      fetchProductList(this.dialogData.listQuery).then(response => {
        this.dialogData.list = response.data.list;
        this.dialogData.total = response.data.total;
      })
    }
  }
}
</script>
<style scoped>
.input-width {
  width: 200px;
}
</style>


