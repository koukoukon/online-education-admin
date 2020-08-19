<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="margin-bottom:30px;" />

    <el-tree
      ref="tree"
      :data="subjectTree"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
    />

  </div>
</template>

<script>
import { getSubjectTreeNode } from '@/api/education/subject'

export default {
  name: 'Index',
  data() {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'subjectTitle'
      },
      subjectTree: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.subjectTitle.toLowerCase().indexOf(value) !== -1
    },
    fetchData() {
      getSubjectTreeNode().then((response) => {
        this.subjectTree = response.data
      })
    }
  }
}
</script>

<style scoped>

</style>
