import request from '@/utils/request'

export function getSubjectTreeNode() {
  return request({
    url: 'subject/treeNode',
    method: 'get'
  })
}
export function getSubjectByParentId(subjectParentId) {
  return request({
    url: 'subject',
    method: 'get',
    params: {
      'subjectParentId': subjectParentId
    }
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

