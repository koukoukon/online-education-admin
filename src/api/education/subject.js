import request from '@/utils/request'

export function getSubjectTreeNode() {
  return request({
    url: '/subject/',
    method: 'get'
  })
}

