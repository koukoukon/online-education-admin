<template>
  <div class="app-container">
    <el-steps :active="2" finish-status="success">
      <el-step title="添加课程基本信息" />
      <el-step title="添加课程章节" />
      <el-step title="发布课程" />
    </el-steps>

    <el-button-group>
      <el-button icon="el-icon-arrow-left" @click="previous">上一步</el-button>
      <el-button type="primary" @click="next">下一步<i class="el-icon-arrow-right el-icon--right" /></el-button>
    </el-button-group>
  </div>
</template>

<script>
export default {
  name: 'Chapter',
  data() {
    return {
      courseId: ''
    }
  },
  created() {
    const courseId = this.$route.params.courseId
    if (courseId !== undefined) {
      this.courseId = courseId
    }
  },
  methods: {
    previous() {
      this.$router.push('/course/info/' + this.courseId)
    },
    next() {
      this.$router.push('/course/publish/1' + this.courseId)
    }
  }
}
</script>

<style scoped>

</style>
