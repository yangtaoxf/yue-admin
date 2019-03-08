import request from '@/utils/request'
export function fetchList (parentId, params) {
  return request({
    url: '/frontCategory/list/' + parentId,
    method: 'get',
    params: params
  })
}
export function fetchAllList (params) {
  return request({
    url: '/frontCategory/list/',
    method: 'get',
    params: params
  })
}

export function deleteProductCate (id) {
  return request({
    url: '/frontCategory/delete/' + id,
    method: 'get'
  })
}

export function createProductCate (data) {
  return request({
    url: '/frontCategory/create',
    method: 'post',
    data: data
  })
}

export function updateProductCate (id, data) {
  return request({
    url: '/frontCategory/update/' + id,
    method: 'post',
    data: data
  })
}

export function getProductCate (id) {
  return request({
    url: '/frontCategory/' + id,
    method: 'get',
  })
}

export function updateShowStatus (data) {
  return request({
    url: '/frontCategory/update/showStatus',
    method: 'post',
    data: data
  })
}

export function updateNavStatus (data) {
  return request({
    url: '/frontCategory/update/navStatus',
    method: 'post',
    data: data
  })
}

export function fetchListWithChildren () {
  return request({
    url: '/frontCategory/list/withChildren',
    method: 'get'
  })
}
