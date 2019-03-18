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
          <el-form-item label="用户名或姓名:">
            <el-input v-model="listQuery.keyword"
                      class="input-width"
                      placeholder="用户名或姓名"></el-input>
          </el-form-item>

        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container"
             shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <!-- <el-button size="mini"
                 class="btn-add"
                 @click="handleAdd()">添加</el-button> -->
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
                         align="left"></el-table-column>
        <el-table-column align="left"
                         width="100"
                         label="管理员名称"
                         prop="username" />
        <el-table-column align="left"
                         width="100"
                         label="昵称"
                         prop="nickname" />
        <el-table-column align="left"
                         width="180"
                         label="邮箱"
                         prop="email" />

        <el-table-column align="left"
                         width="120"
                         label="手机号码"
                         prop="phone" />

        <el-table-column align="left"
                         label="头像"
                         prop="icon">

        </el-table-column>

        <el-table-column align="left"
                         label="备注"
                         prop="note" />

        <el-table-column align="left"
                         width="60"
                         label="状态"
                         prop="status">
          <template slot-scope="scope">
            {{ scope.row.status| memberStatus }}
          </template>
        </el-table-column>
        <el-table-column align="left"
                         label="操作"
                         width="100"
                         class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       @click="handleUpdate(scope.row)">编辑</el-button>
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
import { fetchList, createAdmin, updateAdmin } from '@/api/admin'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  name: null
};
const defaultShowOptions = [
  {
    label: '禁用',
    value: -1
  },
  {
    label: '未启用',
    value: 0
  },
  {
    label: '启用',
    value: 1
  },
  {
    label: '注销',
    value: -2
  }
];
export default {
  name: 'memberList',
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
          label: "禁用",
          value: -1
        },
        {
          label: "注销",
          value: -2
        },
        {
          label: "启用",
          value: 1
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
      levelDic: ['普通用户', 'VIP用户', '高级VIP用户']
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

    handleUpdateStatus (ids, status) {
      this.$confirm('是否要变更用户状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = new URLSearchParams();
        params.append("ids", ids);
        params.append("status", status);
        updateMemberStatus(params).then(response => {
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
      this.handleUpdateStatus(ids, this.operateType);
    },
    handleAdd () {
      this.$router.push({ path: '/ums/addMember' })
    },

    handleUpdate (row) {
      this.$router.push({ path: '/ums/updateMember', query: { id: row.id } })
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
            message: '操作成功!'
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


