<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="信息描述">
        <el-tag type="info">课程分类excel模板</el-tag>
        <el-tag>
          <i class="el-form-download"/>
          <a :href="excelExampleUrl">点击下载模板</a>
        </el-tag>
      </el-form-item>

      <el-form-item>
        <el-upload
          ref="upload"
          class="upload-demo"
          name="excel"
          accept="application/vnd.ms-excel,.xlsx"
          :action="uploadURL"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-remove="handleRemove"
          :auto-upload="false"
          :limit="limit"
          :disabled="disabled"
          :on-exceed="handleExceed"
          :before-remove="handleRemove"
          style="width: 250px"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">
            {{ buttonText }}
          </el-button>
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Import',
  data() {
    return {
      buttonText: '上传到服务器',
      disabled: false,
      limit: 1,
      excelExampleUrl: 'https://education-prod.oss-cn-shanghai.aliyuncs.com/excel/%E8%AF%BE%E7%A8%8B%E5%88%86%E7%B1%BB%E5%88%97%E8%A1%A8%E6%A8%A1%E6%9D%BF.xlsx',
      uploadURL: process.env.VUE_APP_BASE_API + '/subject/import'
    }
  },
  methods: {
    submitUpload() {
      this.buttonText = '正在上传'
      this.disabled = true
      this.$refs.upload.submit()
    },
    handleSuccess(response, file, fileList) {
      if (response.code === 5003) {
        this.$message({
          message: response.message,
          type: 'error',
          duration: 3 * 1000
        })
        this.buttonText = '重新上传'
        this.disabled = false
      } else {
        if (response.data !== undefined) {
          const messages = response.data
          let messageString = '<ol>'
          messages.forEach(message => {
            messageString += `<li>${message}</li>`
          })
          messageString += '</ol>'
          this.$alert(response.message + messageString, '系统提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            callback: action => {
            }
          })
        } else {
          this.$message({
            message: response.message,
            type: 'success',
            duration: 3 * 1000
          })
        }
        this.buttonText = '上传成功'
        this.disabled = false
      }
      this.$refs.upload.clearFiles()
    },
    handleError(err, file, fileList) {
      console.log(err)
      this.$message({
        message: '网络异常',
        type: 'error',
        duration: 3 * 1000
      })
    },
    handleRemove(file, fileList) {
      this.$confirm(`确定移除 ${file.name}？`).then(() => {
        this.buttonText = '上传到服务器'
        this.$message({
          type: 'success',
          message: '移除成功!'
        })
        return true
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消移除'
        })
        return false
      })
    },
    handleExceed(files, fileList) {
      return this.$alert('只允许上传一个文件', '系统提示', {
        confirmButtonText: '确定',
        callback: action => {
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
