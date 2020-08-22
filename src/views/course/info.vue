<template>
  <div class="app-container">
    <el-steps :active="1" finish-status="success">
      <el-step title="添加课程基本信息" />
      <el-step title="添加课程章节" />
      <el-step title="发布课程" />
    </el-steps>
    <el-form ref="course" :model="course" :rules="rules" label-width="120px">

      <el-form-item label="课程标题" prop="courseTitle">
        <el-input v-model="course.courseTitle" type="text" :minlength="2" :maxlength="50" show-word-limit placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>

      <!-- 所属分类 TODO -->
      <el-form-item label="课程分类" prop="subjectId">
        <el-select v-model="course.subjectParentId" placeholder="一级分类" @change="onFirstLevelSelectChange">
          <el-option
            v-for="subject in subjects"
            :key="subject.subjectId"
            :label="subject.subjectTitle"
            :value="subject.subjectId"
          >
          </el-option>
        </el-select>
        -
        <el-select v-model="course.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subSubjects"
            :key="subject.subjectId"
            :label="subject.subjectTitle"
            :value="subject.subjectId"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 TODO -->
      <el-form-item label="课程讲师" prop="teacherId">
        <el-select v-model="course.teacherId" placeholder="请选择讲师">
          <el-option
            v-for="teacher in teachers"
            :key="teacher.teacherId"
            :label="teacher.teacherName"
            :value="teacher.teacherId"
          />

        </el-select>
      </el-form-item>

      <el-form-item label="总课时" prop="courseLessonNum">
        <el-input-number v-model="course.courseLessonNum" :min="0" type="number" controls-position="right" placeholder="请填写课程的总课时数" />
      </el-form-item>
      <!-- 课程简介 TODO -->

      <el-form-item label="课程简介" prop="courseDescription">
        <div>
          <tinymce v-model="course.courseDescription" :height="300" />
        </div>
        <div class="editor-content" />
      </el-form-item>
      <!-- 课程封面 TODO -->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="VUE_APP_BASE_API+'oss/file/uploadCover'"
          name="courseCover"
          class="avatar-uploader"
        >
          <img :src="course.courseCover" alt="请上传课程封面">
        </el-upload>

      </el-form-item>
      <el-form-item label="课程价格" prop="coursePrice">
        <el-input-number v-model="course.coursePrice" :min="0" type="number" controls-position="right" placeholder="免费课程请设置为0元" /> 元
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="next('course')">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveCourse, getCourseById, updateCourseById } from '@/api/education/course'
import { getTeacherList } from '@/api/education/teacher'
import { getSubjectTreeNode } from '@/api/education/subject'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'Info',
  components: { Tinymce },
  data() {
    return {
      VUE_APP_BASE_API: process.env.VUE_APP_BASE_API,
      teachers: [],
      subjects: [],
      subSubjects: [],
      course: {
        courseTitle: '',
        coursePrice: 0.00,
        courseCover: 'https://i0.hdslb.com/bfs/archive/8a0d2bf5d07cf6551aeff01f5e5978def771e174.jpg@880w_388h_1c_95q',
        courseLessonNum: 1,
        courseDescription: '',
        teacherId: '',
        subjectId: '',
        subjectParentId: ''
      },
      rules: {
        courseTitle: [
          { required: true, message: '请输入课程标题', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        teacherId: [
          { required: true, message: '请选择讲师', trigger: 'change' }
        ],
        courseLessonNum: [
          { required: true, message: '请输入课时', trigger: 'blur' },
          { type: 'number', min: 1, max: 10000, message: '数值在 1 到 10000 范围内', trigger: 'blur' }
        ],
        coursePrice: [
          { required: true, message: '请输入课程价格', trigger: 'blur' },
          { type: 'number', min: 0, max: 99999, message: '价格在 0 到 99999 范围内', trigger: 'blur' }
        ],
        subjectId: [
          { required: true, message: '请选择二级分类', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    const courseId = this.$route.params.courseId
    if (courseId !== undefined) {
      this.courseId = courseId
      this.init()
    } else {
      this.fetchTeacherData()
      this.fetchSubjectsData()
    }
  },
  methods: {
    init() {
      getCourseById(this.courseId).then((response) => {
        this.course = response.data
        getSubjectTreeNode().then((response) => {
          this.subjects = response.data
          for (let i = 0; i < this.subjects.length; i++) {
            if (this.course.subjectParentId === this.subjects[i].subjectId) {
              this.subSubjects = this.subjects[i].children
            }
          }
        })
        // 获取讲师列表
        this.fetchTeacherData()
      })
    },
    handleAvatarSuccess(res, file) {
      this.course.courseCover = res.data
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    onFirstLevelSelectChange(data) {
      for (let i = 0; i < this.subjects.length; i++) {
        if (data === this.subjects[i].subjectId) {
          this.subSubjects = this.subjects[i].children
        } else {
          this.course.subjectId = ''
        }
      }
    },
    fetchSubjectsData() {
      getSubjectTreeNode().then((response) => {
        this.subjects = response.data
      })
    },
    fetchTeacherData() {
      getTeacherList().then((response) => {
        this.teachers = response.data
      })
    },
    next(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.courseId === undefined) {
            this.add()
          } else {
            this.edit()
          }
        } else {
          return false
        }
      })
    },
    add() {
      console.log('执行了新增方法')
      saveCourse(this.course).then((response) => {
        this.$router.push('/course/chapter/' + response.data.courseId)
      })
    },
    edit() {
      console.log('执行了修改方法')
      updateCourseById(this.courseId, this.course).then((response) => {
        console.log(response)
      })
    }
  }

}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
</style>
