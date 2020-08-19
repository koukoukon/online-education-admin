<template>
  <div class="app-container">

    <el-form ref="teacher" :model="teacher" :rules="rules" label-width="80px">
      <el-form-item label="讲师名称" prop="teacherName">
        <el-input v-model="teacher.teacherName" style="width: 175px" minlength="2" maxlength="20" show-word-limit />
      </el-form-item>
      <el-form-item label="讲师排序" prop="teacherSort">
        <el-input-number v-model.number="teacher.teacherSort" type="number" controls-position="right" :min="0" :max="10000" />
      </el-form-item>
      <el-form-item label="讲师头衔" prop="teacherLevel">
        <el-select v-model="teacher.teacherLevel" placeholder="请选择">
          <el-option label="高级讲师" :value="1" />
          <el-option label="首席讲师" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历" prop="teacherIntro">
        <el-input v-model="teacher.teacherIntro" minlength="1" maxlength="255" show-word-limit style="width: 500px"/>
      </el-form-item>
      <el-form-item label="讲师简介" prop="teacherCareer">
        <el-input v-model="teacher.teacherCareer" type="textarea" :rows="10" style="width: 500px"/>
      </el-form-item>
      <el-form-item>
        <pan-thumb :image="teacher.teacherAvatar" />

        <el-button type="primary" icon="el-icon-upload" style="position: absolute;bottom: 15px;margin-left: 40px;" @click="imageCropperShow=true">
          更换头像
        </el-button>

        <image-cropper
          v-show="imageCropperShow"
          :key="imageCropperKey"
          :width="300"
          :height="300"
          :url="VUE_APP_BASE_API+'/oss/file/upload'"
          lang-type="zh"
          field="teacherAvatar"
          @close="close"
          @crop-upload-success="cropSuccess"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('teacher')">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveTeacher, getTeacherById, updateTeacherById } from '@/api/education/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
export default {
  name: 'Form',
  components: { ImageCropper, PanThumb },
  props: ['teacherId'],
  data() {
    return {
      VUE_APP_BASE_API: process.env.VUE_APP_BASE_API,
      imageCropperKey: 0,
      imageCropperShow: false,
      image: 'https://wpimg.wallstcn.com/577965b9-bb9e-4e02-9f0c-095b41417191',
      teacher: {
        teacherName: '',
        teacherSort: 0,
        teacherLevel: 1,
        teacherIntro: '',
        teacherCareer: '',
        teacherAvatar: 'https://education-prod.oss-cn-shanghai.aliyuncs.com/avatar/default.png'
      },
      rules: {
        teacherName: [
          { required: true, message: '请输入讲师名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        teacherSort: [
          { required: true, message: '请输入讲师排序', trigger: 'blur' },
          { type: 'number', min: 0, max: 10000, message: '数值在 0 到 10000 范围内', trigger: 'blur' }
        ],
        teacherLevel: [
          { required: true, message: '请选择讲师头衔', trigger: 'change' }
        ],
        teacherIntro: [
          { required: true, message: '请输入讲师资历', trigger: 'blur' },
          { min: 1, max: 255, message: '长度在 1 到 255 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 页面第一次加载从路由中获取传递的行对象 减少服务器压力
    const row = this.$route.params.row
    if (row !== undefined) {
      this.teacher = row
    } else {
      if (this.teacherId !== undefined) {
        this.fetchDataById(this.teacherId)
      }
    }
  },
  methods: {
    cropSuccess(resData) {
      this.imageCropperShow = false
      this.teacher.teacherAvatar = resData
      this.imageCropperKey += 1
    },
    close() {
      this.imageCropperShow = false
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addOrEdit()
        } else {
          return false
        }
      })
    },
    fetchDataById(teacherId) {
      getTeacherById(teacherId).then((response) => {
        this.teacher = response.data
      })
    },
    addOrEdit() {
      if (this.teacherId === undefined) {
        this.handleAdd()
      } else {
        this.handleEdit()
      }
    },
    handleEdit() {
      updateTeacherById(this.teacherId, this.teacher).then((response) => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.$router.push({ path: '/teacher/table' })
      })
    },
    handleAdd() {
      saveTeacher(this.teacher, this.teacher).then((response) => {
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.$router.push({ path: '/teacher/table' })
      })
    }
  }

}
</script>

<style scoped>
.avatar{
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
</style>
