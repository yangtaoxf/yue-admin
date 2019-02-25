import request from '@/utils/request'

export function fetchList (params) {
  return request({
    url: '/member/list',
    method: 'get',
    params: params
  })
}

export function createMember (params) {
  return request({
    url: '/member/create',
    method: 'post',
    params: params
  })
}

export function getMember (params) {
  return request({
    url: '/member/detail',
    method: 'get',
    params: params
  })
}

export function updateMember (params) {
  return request({
    url: '/member/update',
    method: 'post',
    params: params
  })
}

export function listAddress (params) {
  return request({
    url: '/address/list',
    method: 'get',
    params: params
  })
}


