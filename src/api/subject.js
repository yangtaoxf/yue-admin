import request from '@/utils/request'
export function fetchListAll () {
  return request({
    url: '/subject/listAll',
    method: 'get',
  })
}

export function fetchList (params) {
  return request({
    url: '/subject/list',
    method: 'get',
    params: params
  })
}

export function createSubject (data) {
  return request({
    url: '/subject/create',
    method: 'post',
    data: data
  })
}


export function deleteSubject (data) {
  return request({
    url: '/subject/delete/',
    method: 'post',
    data: data
  })
}

export function getSubject (id) {
  return request({
    url: '/subject/' + id,
    method: 'get',
  })
}

export function updateSubject (id, data) {
  return request({
    url: '/subject/update/' + id,
    method: 'post',
    data: data
  })
}

export function fetchProductList (id, data) {
  return request({
    url: '/subject/productRelation/list/' + id,
    method: 'get',
    params: data
  })
}

export function createProductRelation (id, data) {
  return request({
    url: '/subject/productRelation/create/' + id,
    method: 'post',
    data: data
  })
}
export function deleteProductRelation (id, data) {
  return request({
    url: '/subject/productRelation/delete/' + id,
    method: 'post',
    data: data
  })
}
