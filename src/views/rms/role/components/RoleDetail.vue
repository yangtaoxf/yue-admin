<template> 
  <a-drawer :title="title"
            :width="720"
            @close="onClose"
            :visible="visible"
            :wrapStyle="{height: 'calc(100% - 108px)',overflow: 'auto',paddingBottom: '108px'}"
            v-if="this.role.id">
    <a-tree checkable
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            v-model="checkedKeys"
            @select="onSelect"
            :selectedKeys="selectedKeys"
            :treeData="treeData" />
    <div :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }">
      <a-button :style="{marginRight: '8px'}"
                @click="onClose">
        Cancel
      </a-button>
      <a-button @click="onClose"
                type="primary">Submit</a-button>
    </div>
  </a-drawer>
</template>
<script>
import { treeList } from '@/api/permission'
import { permission, permissionUpdate } from '@/api/role'
export default {
  name: 'updateRole',
  data () {
    return {
      role: {},
      visible: false,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: []
    }
  },
  methods: {
    showDrawer (role) {
      this.role = role;
      this.visible = true;
      this.initData();
    },
    onClose () {
      this.visible = false
    },
    initData () {

      if (this.role.id) {
        treeList({}).then(response => {
          this.treeData = response.data;
          permission(this.role.id).then(response => {
            var data = response.data;
            if (data.length > 0) {
              this.checkedKeys = data.map(function (item) {
                return item.id;
              });
              this.expandedKeys = data.map(function (item) {
                if (item.type == 1 || item.type == 0) {
                  return item.id;
                }
              });
            }
          })
        })
      }
    }, onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      this.selectedKeys = selectedKeys
    },
  }, created () {

  }, computed: {
    title: function () {
      return "编辑[" + this.role.name + "]";
    }

  }
}
</script>
<style scoped>
</style>


