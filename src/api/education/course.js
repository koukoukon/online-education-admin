import request from '@/utils/request'

export function saveCourse(course) {
  return request({
    url: 'course',
    method: 'post',
    data: course
  })
}
export function getCourseById(courseId) {
  return request({
    url: `course/${courseId}`,
    method: 'get'
  })
}
export function updateCourseById(courseId, course) {
  return request({
    url: `course/${courseId}`,
    method: 'put',
    data: course
  })
}
