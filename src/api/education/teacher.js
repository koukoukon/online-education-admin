import request from '@/utils/request'

export function getTeacherPageByCondition(pageNum, pageSize, teacherQuery) {
  return request({
    url: 'teacher',
    method: 'get',
    params: {
      'pageNum': pageNum,
      'pageSize': pageSize,
      'teacherName': teacherQuery.teacherName,
      'teacherLevel': teacherQuery.teacherLevel,
      'createTime': teacherQuery.createTime,
      'updateTime': teacherQuery.updateTime
    }
  })
}

export function removeTeacherById(teacherId) {
  return request({
    url: `teacher/${teacherId}`,
    method: 'delete'
  })
}

export function saveTeacher(teacher) {
  return request({
    url: 'teacher',
    method: 'post',
    data: teacher
  })
}
export function updateTeacherById(teacherId, teacher) {
  return request({
    url: `teacher/${teacherId}`,
    method: 'put',
    data: teacher
  })
}
export function getTeacherById(teacherId) {
  return request({
    url: `teacher/${teacherId}`,
    method: 'get'
  })
}
export function getTeacherList() {
  return request({
    url: 'teacher',
    method: 'get'
  })
}
