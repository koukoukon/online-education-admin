<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="margin-bottom:30px;"/>
    <el-button type="primary" icon="el-icon-document-add" round @click="dialogVisible =true">添加一级分类</el-button>
    <el-button type="danger" icon="el-icon-delete" round>批量删除</el-button>
    <el-tree
      style="width: 350px"
      ref="tree"
      node-key="subjectId"
      :data="subjectTree"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      show-checkbox
      @check-change="handleCheckChange"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level===1"
            type="text"
            size="mini"
            @click="() => {dialogVisible=true;subject.subjectParentId=data.subjectId}"
          >
            添加二级分类
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)"
          >
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <el-form ref="subject" :model="subject" :rules="rules" label-width="100px">
        <el-form-item label="分类标题" prop="subjectTitle">
          <el-input v-model="subject.subjectTitle" placeholder="请输入分类标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('subject')">确定</el-button>
          <el-button @click="dialogVisible =false">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import { getSubjectTreeNode, removeSubjectById, saveSubject } from '@/api/education/subject'

export default {
  name: 'Index',
  data() {
    return {
      subject: {
        subjectTitle: '',
        subjectParentId: '0'
      },
      rules: {
        subjectTitle: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
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
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },
    append(node, data) {
      console.log(data)
    },
    remove(node, data) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeSubjectById(data.subjectId).then((response) => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.subjectId === data.subjectId)
          children.splice(index, 1)
        }).catch((response) => {

        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addSubject()
        } else {
          return false
        }
      })
    },
    addSubject() {
      saveSubject(this.subject).then((response) => {
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.dialogVisible = false
        this.subject.subjectTitle = ''
        this.subject.subjectParentId = '0'
        this.fetchData()
      }).catch((response) => {
      })
    }
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
