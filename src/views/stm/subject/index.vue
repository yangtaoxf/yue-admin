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
          <el-form-item label="专题名称：">
            <el-input v-model="listQuery.keyword"
                      class="input-width"
                      placeholder="专题名称"></el-input>
          </el-form-item>

        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container"
             shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add"
                 @click="addSubject()"
                 size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="newSubjectTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection"
                         width="60"
                         align="center"></el-table-column>
        <el-table-column label="编号"
                         width="90"
                         align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="专题名称"
                         align="left">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>

        <el-table-column label="操作"
                         width="180"
                         align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleSelectSession(scope.$index, scope.row)">设置商品
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
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
                     :page-size="listQuery.pageSize"
                     :page-sizes="[5,10,15]"
                     :current-page.sync="listQuery.pageNum"
                     :total="total">
      </el-pagination>
    </div>

  </div>
</template>
<script>

import { fetchList } from '@/api/subject';
import { formatDate } from '@/utils/date';

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  subjectName: null,
  recommendStatus: null
};

export default {
  name: 'homeSubjectList',
  data () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: false,
      multipleSelection: [],
      operates: [

        {
          label: "删除",
          value: 2
        }
      ],
      operateType: null,
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
      },
      sortDialogVisible: false,
      sortDialogData: { sort: 0, id: null }
    }
  },
  created () {
    this.getList();
  },
  filters: {

    formatTime (time) {
      if (time == null || time === '') {
        return 'N/A';
      }
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
  },
  methods: {
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
    handleDelete (index, row) {
      this.deleteSubject(row.id);
    },
    handleSelectSession (index, row) {
      this.$router.push({ path: '/stm/subjectProductRelation', query: { subjectId: row.id } })
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
        //删除
        this.deleteSubject(ids);
      } else {
        this.$message({
          message: '请选择批量操作类型',
          type: 'warning',
          duration: 1000
        });
      }
    },

    handleUpdate (index, row) {
      this.$router.push({ path: '/stm/updateSubject', query: { id: row.id } })
    },
    getList () {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      })
    },

    deleteSubject (ids) {
      this.$confirm('是否要删除该推荐?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", ids);
        deleteHomeSubject(params).then(response => {
          this.getList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        });
      })
    },
    addSubject () {
      this.$router.push({ path: '/stm/addSubject' })
    }
  }
}
</script>
<style></style>
