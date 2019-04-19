import request from '@/utils/request'
export function fetchListAll () {
  return request({
    url: '/expressCompany/listAll',
    method: 'get',
  })
}

export function tracking (params) {
  return request({
    url: '/expressCompany/tracking',
    method: 'get',
    params: params
  })
}
