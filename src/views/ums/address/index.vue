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
          <el-form-item label="收货人名称：">
            <el-input v-model="listQuery.name"
                      class="input-width"
                      placeholder="收货人名称"></el-input>
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
                stripe=true
                @selection-change="handleSelectionChange"
                v-loading="listLoading"
                border>
        <el-table-column type="selection"
                         width="60"
                         align="center"></el-table-column>

        <el-table-column align="left"
                         min-width="100px"
                         label="会员ID"
                         prop="memberId" />
        <el-table-column align="left"
                         min-width="100px"
                         label="收货人名称"
                         prop="name" />
        <el-table-column align="left"
                         min-width="100px"
                         label="手机号码"
                         prop="phoneNumber" />
        <el-table-column align="left"
                         min-width="100px"
                         label="邮政编码"
                         prop="postCode" />
        <el-table-column align="left"
                         min-width="100px"
                         label="省份/直辖市"
                         prop="province" />
        <el-table-column align="left"
                         min-width="100px"
                         label="城市"
                         prop="city" />
        <el-table-column align="left"
                         min-width="100px"
                         label="区"
                         prop="region" />
        <el-table-column align="left"
                         min-width="100px"
                         label="地址(街道)"
                         prop="detailAddress" />
        <el-table-column align="left"
                         min-width="300px"
                         label="详细地址"
                         prop="address">
          <template slot-scope="scope">
            {{ scope.row.province + scope.row.city + scope.row.region + scope.row.detailAddress }}
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
import { listAddress as fetchList } from '@/api/member'


const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  title: null,
  showStatus: null
};

export default {
  name: 'homeBrandList',
  data () {
    return {
      listQuery: Object.assign({}, defaultListQuery),

      list: null,
      total: null,
      listLoading: false,
      multipleSelection: [],
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
    handleShowStatusChange (index, row) {
      this.handleUpdateFloorShow(row.id, row.showStatus);
    },
    handleUpdateFloorShow (ids, status) {
      this.$confirm('是否要启用?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", ids);
        params.append("status", status);
        updateFloorShow(params).then(response => {
          this.getList();
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
        });
      }).catch(() => {
        this.$message({
          type: 'success',
          message: '已取消操作!'
        });
        this.getList();
      });
    },

    handleAdd () {
      this.$router.push({ path: '/sms/addFloor' })
    },

    handleUpdate (index, row) {
      this.$router.push({ path: '/sms/updateFloor', query: { id: row.id } })
    },
    handleSelectSearch () {
      this.getDialogList();
    },
    handleEditSort (index, row) {
      this.sortDialogVisible = true;
      this.sortDialogData.sort = row.sort;
      this.sortDialogData.id = row.id;
    },
    handleUpdateSort () {
      this.$confirm('是否要修改排序?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateHomeBrandSort(this.sortDialogData).then(response => {
          this.sortDialogVisible = false;
          this.getList();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        });
      })
    },
    getList () {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      })
    },
    deleteBrand (ids) {
      this.$confirm('是否要删除该楼层?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", ids);
        deleteHomeBrand(params).then(response => {
          this.getList();
          this.$message({
            type: 'success',
            message: '删成功!'
          });
        });
      })
    },
    getDialogList () {
      fetchBrandList(this.dialogData.listQuery).then(response => {
        this.dialogData.list = response.data.list;
        this.dialogData.total = response.data.total;
      })
    }
  }
}
</script>
<style></style>


