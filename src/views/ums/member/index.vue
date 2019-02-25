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
          <el-form-item label="会员名称：">
            <el-input v-model="listQuery.keyword"
                      class="input-width"
                      placeholder="会员名称"></el-input>
          </el-form-item>
          <el-form-item label="帐号状态：">
            <el-select v-model="listQuery.status"
                       placeholder="全部"
                       clearable
                       class="input-width">
              <el-option v-for="item in showOptions"
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
      <el-button size="mini"
                 class="btn-add"
                 @click="handleAdd()">添加</el-button>
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
                         width="100px"
                         label="用户ID"
                         prop="id"
                         sortable />

        <el-table-column align="left"
                         label="用户名"
                         prop="username" />
        <el-table-column align="cenleftter"
                         label="昵称"
                         prop="nickname" />
        <el-table-column align="left"
                         label="手机号码"
                         prop="phone" />

        <el-table-column align="left"
                         label="性别"
                         prop="gender">
          <template slot-scope="scope">
            {{ genderDic[scope.row.gender] }}
          </template>
        </el-table-column>

        <el-table-column align="left"
                         label="生日"
                         prop="birthday" />

        <el-table-column align="left"
                         label="用户等级"
                         prop="userLevel">
          <template slot-scope="scope">
            {{ levelDic[scope.row.userLevel] }}
          </template>
        </el-table-column>

        <el-table-column align="left"
                         label="状态"
                         prop="status">
          <template slot-scope="scope">
            {{ statusDic[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column align="left"
                         label="操作"
                         width="200"
                         class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button type="danger"
                       size="mini"
                       @click="handleDelete(scope.row)">删除</el-button>
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

    <el-dialog title="设置排序"
               :visible.sync="sortDialogVisible"
               width="40%">
      <el-form :model="sortDialogData"
               label-width="150px">
        <el-form-item label="排序：">
          <el-input v-model="sortDialogData.sort"
                    style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="sortDialogVisible = false"
                   size="small">取 消</el-button>
        <el-button type="primary"
                   @click="handleUpdateSort"
                   size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, createMember, updateMember } from '@/api/member'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  title: null,
  showStatus: null
};
const defaultShowOptions = [
  {
    label: '禁用',
    value: 0
  },
  {
    label: '启用',
    value: 1
  }
];
export default {
  name: 'homeBrandList',
  data () {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      showOptions: Object.assign({}, defaultShowOptions),
      list: null,
      total: null,
      listLoading: false,
      multipleSelection: [],
      operates: [
        {
          label: "设为启用",
          value: 0
        },
        {
          label: "取消启用",
          value: 1
        },
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
      sortDialogData: { sort: 0, id: null },
      genderDic: ['未知', '男', '女'],
      levelDic: ['普通用户', 'VIP用户', '高级VIP用户'],
      statusDic: ['可用', '禁用', '注销']
    }
  },
  created () {
    this.getList();
  },
  filters: {
    formatRecommendStatus (status) {
      if (status === 1) {
        return '启用中';
      } else {
        return '未启用';
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
      if (this.operateType === 0) {
        //设为启用
        this.updateFloorShow(ids, 1);
      } else if (this.operateType === 1) {
        //取消启用
        this.updateFloorShow(ids, 0);
      } else {
        this.$message({
          message: '请选择批量操作类型',
          type: 'warning',
          duration: 1000
        });
        return;
      }
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


