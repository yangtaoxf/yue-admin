<template>
  <el-dialog title="选择专题"
             :visible.sync="selectDialogVisible"
             width="50%">
    <el-input v-model="dialogData.listQuery.keyword"
              style="width: 250px;margin-bottom: 20px"
              size="small"
              placeholder="专题名称搜索">
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
      <el-table-column label="专题名称"
                       align="left">
        <template slot-scope="scope">{{scope.row.title}}</template>
      </el-table-column>
      <el-table-column label="所属分类"
                       width="160"
                       align="left">
        <template slot-scope="scope">{{scope.row.categoryName}}</template>
      </el-table-column>
      <el-table-column label="添加时间"
                       width="160"
                       align="center">
        <template slot-scope="scope">{{scope.row.createTime | formatTime}}</template>
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
</template>
<script>
import { fetchList as fetchSubjectList } from '@/api/subject';
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
      fetchSubjectList(this.dialogData.listQuery).then(response => {
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
      let selectDatas = [];
      for (let i = 0; i < this.dialogData.multipleSelection.length; i++) {
        let data = this.dialogData.multipleSelection[i];
        data.name = data.title;
        selectDatas.push(data);
      }
      this.$emit('selectdSubject', selectDatas);
      this.selectDialogVisible = false;
    }
  }
}
</script>
