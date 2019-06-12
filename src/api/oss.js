import request from '@/utils/request'
export function policy () {
  return request({
    url: '/oss/policy',
    method: 'get',
  })
}
export function qiNiuToken () {
  return request({
    url: '/oss/qiniu/token',
    method: 'get',
  })
}




