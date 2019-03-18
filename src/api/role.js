import request from '@/utils/request'
export function fetchList (params) {
  return request({
    url: '/role/list',
    method: 'get',
    params: params
  })
}

export function createRole (data) {
  return request({
    url: '/role/create',
    method: 'post',
    data: data
  })
}

export function getRole (id) {
  return request({
    url: '/role/' + id,
    method: 'get',
  })
}

export function updateRole (id, data) {
  return request({
    url: '/role/update/' + id,
    method: 'post',
    data: data
  })
}

export function deleteRole (id) {
  return request({
    url: '/role/delete/' + id,
    method: 'post',
  })
}

export function permission (id) {
  return request({
    url: '/role/permission/' + id,
    method: 'get',
  })
}

export function permissionUpdate (data) {
  return request({
    url: '/role/permission/update/',
    method: 'post',
    data: data
  })
}
