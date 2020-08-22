<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="3" finish-status="success">
      <el-step title="添加课程基本信息" />
      <el-step title="添加课程章节" />
      <el-step title="发布课程" />
    </el-steps>

    <el-button-group>
      <el-button icon="el-icon-arrow-left" @click="previous">上一步</el-button>
      <el-button type="primary">发布课程<i class="el-icon-arrow-right el-icon--right"></i></el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  name: 'Publish',
  methods: {
    previous() {
      this.$router.push('/course/chapter/1')
    }
  }
}
</script>

<style scoped>

</style>
