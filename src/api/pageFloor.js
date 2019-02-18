import request from '@/utils/request'
export function fetchList (params) {
  return request({
    url: '/floor/list',
    method: 'get',
    params: params
  })
}

export function updateFloorShow (data) {
  return request({
    url: '/floor/update/show',
    method: 'post',
    data: data
  })
}

export function updateFloor (id, data) {
  return request({
    url: '/floor/update/' + id,
    method: 'post',
    data: data
  })
}
export function createFloor (data) {
  return request({
    url: '/floor/create',
    method: 'post',
    data: data
  })
}

export function updateFloorSort (params) {
  return request({
    url: '/floor/update/sort/' + params.id,
    method: 'post',
    params: params
  })
}
