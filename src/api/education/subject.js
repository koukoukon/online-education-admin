import request from '@/utils/request'

export function getSubjectTreeNode() {
  return request({
    url: 'subject',
    method: 'get'
  })
}
export function removeSubjectById(subjectId) {
  return request({
    url: `subject/${subjectId}`,
    method: 'delete'
  })
}
export function removeSubjectByIds(subjectIds) {
  return request({
    url: 'subject',
    method: 'delete',
    data: subjectIds
  })
}
export function saveSubject(subject) {
  return request({
    url: 'subject',
    method: 'post',
    data: subject
  })
}

