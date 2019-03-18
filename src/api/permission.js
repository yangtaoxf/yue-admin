import request from '@/utils/request'
export function treeList (params) {
  return request({
    url: '/permission/treeList',
    method: 'get',
    params: params
  })
}

export function fetchList (params) {
  return request({
    url: '/permission/list',
    method: 'get',
    params: params
  })
}
export function createPermission (data) {
  return request({
    url: '/permission/create',
    method: 'post',
    data: data
  })
}

export function getPermission (id) {
  return request({
    url: '/permission/' + id,
    method: 'get',
  })
}

export function updatePermission (id, data) {
  return request({
    url: '/permission/update/' + id,
    method: 'post',
    data: data
  })
}

export function deletePermission (id) {
  return request({
    url: '/permission/delete/' + id,
    method: 'post',
  })
}