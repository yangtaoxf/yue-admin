import request from '@/utils/request'
export function fetchList (params) {
  return request({
    url: '/feedback/list',
    method: 'get',
    params: params
  })
}

export function getFeedback (id) {
  return request({
    url: '/feedback/' + id,
    method: 'get',
  })
}

export function updateFeedback (id, data) {
  return request({
    url: '/feedback/update/' + id,
    method: 'post',
    data: data
  })
}

