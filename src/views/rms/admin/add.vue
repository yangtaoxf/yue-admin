<template> 
  <admin-detail :isEdit="false"></admin-detail>
</template>
<script>
import adminDetail from './components/adminDetail'
export default {
  name: 'addAdmin',
  components: { adminDetail }
}
</script>
<style scoped>
</style>