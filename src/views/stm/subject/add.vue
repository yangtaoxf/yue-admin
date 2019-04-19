<template> 
  <subject-detail :is-edit='false'></subject-detail>
</template>
<script>
import subjectDetail from './components/subjectDetail'
export default {
  name: 'addSubject',
  components: { subjectDetail }
}
</script>
<style>
</style>
