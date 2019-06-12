<template> 
  <member-detail :isEdit="false"></member-detail>
</template>
<script>
import memberDetail from './components/memberDetail'
export default {
  name: 'addMember',
  components: { memberDetail }
}
</script>
<style scoped>
</style>