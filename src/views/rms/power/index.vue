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
          <el-form-item label="名称:">
            <el-input v-model="listQuery.keyword"
                      class="input-width"
                      placeholder="权限名称"></el-input>
          </el-form-item>
          <el-form-item label="权限类型:">
            <el-select v-model="listQuery.type"
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
                         align="center"></el-table-column>
        <el-table-column align="left"
                         label="类别"
                         width="80"
                         prop="type">
          <template slot-scope="scope">
            {{ scope.row.status| powerStatus }}
          </template>
        </el-table-column>
        <el-table-column align="left"
                         label="名称"
                         width="180"
                         prop="name" />
        <el-table-column align="left"
                         label="值"
                         width="280"
                         prop="value" />
        <el-table-column align="left"
                         label="图标"
                         width="100"
                         prop="icon" />

        <el-table-column align="left"
                         label="URL"
                         prop="url" />

        <el-table-column align="left"
                         label="操作"
                         width="200"
                         class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary"
                       size="mini"
                       @click="handleUpdate(scope.row)">编辑</el-button>
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
import { fetchList, createPermission, updatePermission } from '@/api/permission'

const defaultListQuery = {
  pageNum: 1,
  pageSize: 5,
  keyword: null,
  type: null
};
const defaultShowOptions = [

  {
    label: '目录',
    value: 0
  },
  {
    label: '菜单',
    value: 1
  },
  {
    label: '功能',
    value: 2
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

    handleUpdate (index, row) {
      this.$router.push({ path: '/sms/updateFloor', query: { id: row.id } })
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

  }
}
</script>
<style></style>


