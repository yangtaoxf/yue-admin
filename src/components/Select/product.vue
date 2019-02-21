<template>
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
              :highlight-current-row="true"
              @row-click="handleSingleSelection"
              border>
      <el-table-column type="selection"
                       width="60"
                       align="center"
                       v-if="multiSelect"></el-table-column>
      <el-table-column label="商品名称"
                       align="left">
        <template slot-scope="scope">{{scope.row.name}}</template>
      </el-table-column>
      <el-table-column label="货号"
                       width="160"
                       align="left">
        <template slot-scope="scope">NO.{{scope.row.productSn}}</template>
      </el-table-column>
      <el-table-column label="价格"
                       width="120"
                       align="right">
        <template slot-scope="scope">￥{{scope.row.price}}</template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination background
                     layout="prev, pager, next"
                     @size-change="handleDialogSizeChange"
                     @current-change="handleDialogCurrentChange"
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
</template>
<script>
import { fetchList as fetchProductList } from '@/api/product';
export default {
  props: {
    multiSelect: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      selectDialogVisible: false,
      dialogData: {
        list: null,
        total: null,
        multipleSelection: [],
        listQuery: {
          keyword: null,
          pageNum: 1,
          pageSize: 5
        }
      }
    }
  }, methods: {
    show () {
      this.selectDialogVisible = true;
      this.getDialogList();
    },
    getDialogList () {
      fetchProductList(this.dialogData.listQuery).then(response => {
        this.dialogData.list = response.data.list;
        this.dialogData.total = response.data.total;
      })
    }, handleSelectSearch () {
      this.getDialogList();
    }, handleDialogSizeChange (val) {
      this.dialogData.listQuery.pageNum = 1;
      this.dialogData.listQuery.pageSize = val;
      this.getDialogList();
    }, handleDialogCurrentChange (val) {
      this.dialogData.listQuery.pageNum = val;
      this.getDialogList();
    }, handleDialogSelectionChange (val) {
      this.dialogData.multipleSelection = val;
    }, handleSingleSelection (row) {
      if (!this.multiSelect) {
        this.dialogData.multipleSelection = [];
        this.dialogData.multipleSelection.push(row);
      }
    }, handleSelectDialogConfirm () {
      if (this.dialogData.multipleSelection < 1) {
        this.$message({
          message: '请选择一条记录',
          type: 'warning',
          duration: 1000
        });
        return;
      }
      let selectProducts = [];
      for (let i = 0; i < this.dialogData.multipleSelection.length; i++) {
        selectProducts.push(this.dialogData.multipleSelection[i]);
      }
      this.$emit('selectdProduct', selectProducts);
      this.selectDialogVisible = false;
    }
  }
}
</script>
