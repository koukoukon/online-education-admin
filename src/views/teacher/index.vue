<template>
  <div class="app-container">
    <el-form ref="form" :inline="true" :model="searchObj" size="small" class="demo-form-inline">
      <el-form-item label="名称" prop="teacherName">
        <el-input v-model="searchObj.teacherName" placeholder="请输入讲师名称" style="width: 125px" />
      </el-form-item>
      <el-form-item label="头衔" prop="teacherLevel">
        <el-select v-model="searchObj.teacherLevel" style="width: 100px" placeholder="请选择">
          <el-option label="未选择" value="" />
          <el-option label="高级讲师" value="1" />
          <el-option label="首席讲师" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-col>
          <el-form-item prop="createTime">
            <el-date-picker
              v-model="searchObj.createTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="修改时间" prop="updateTime">
        <el-col>
          <el-form-item prop="updateTime">
            <el-date-picker
              v-model="searchObj.updateTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
              style="width: 100%;"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData(1)">查询</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="拼命加载中"
      border
      stripe
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        fixed
        type="selection"
        width="55"
      />

      <el-table-column
        prop="teacherName"
        label="名称"
        width="120"
      />

      <el-table-column
        prop="teacherIntro"
        label="资历"
        show-overflow-tooltip
      />
      <el-table-column
        prop="teacherCareer"
        label="简介"
        show-overflow-tooltip
      />
      <el-table-column
        prop="teacherLevel"
        label="头衔"
        width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.level === 1 ? '高级讲师' : '首席讲师' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="teacherSort"
        label="排序"
        width="50"
        show-overflow-tooltip
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160"
        show-overflow-tooltip
      />
      <el-table-column
        prop="updateTime"
        label="修改时间"
        width="160"
        show-overflow-tooltip
      />
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        style="text-align: center;"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getTeacherPageByCondition, removeTeacherById } from '@/api/education/teacher'

export default {
  name: 'Index',
  data() {
    return {
      listLoading: false,
      list: null,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      searchObj: {
        'teacherName': '',
        'teacherLevel': '',
        'createTime': '',
        'updateTime': ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.fetchData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchData(1)
    },
    handleCurrentChange(val) {
      this.fetchData(val)
    },
    handleEdit(index, row) {
      this.$router.push({ name: 'TeacherEdit', params: { 'teacherId': row.teacherId, 'row': row }})
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return removeTeacherById(row.teacherId)
      }).then(() => {
        this.fetchData()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((response) => {
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除!'
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData(pageNum) {
      this.listLoading = true
      this.pageNum = pageNum || this.pageNum
      getTeacherPageByCondition(this.pageNum, this.pageSize, this.searchObj).then(response => {
        if (response.success === true) {
          this.list = response.data
          this.total = response.total
        }
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
