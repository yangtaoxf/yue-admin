import request from '@/utils/request'
export function setting (storeId) {
  return request({
    url: '/drp/setting/' + storeId,
    method: 'get'
  })
}

export function updateSetting (id, data) {
  return request({
    url: '/drp/setting/update/' + id,
    method: 'post',
    data: data
  })
}

export function plan (storeId) {
  return request({
    url: '/drp/plan/' + storeId,
    method: 'get'
  })
}

export function updatePlan (id, data) {
  return request({
    url: '/drp/plan/update/' + id,
    method: 'post',
    data: data
  })
}

export function promoterList (params) {
  return request({
    url: '/drp/promoter/list',
    method: 'get',
    params: params
  })
}

export function applyPromoterList (params) {
  return request({
    url: '/drp/promoter/applyPromoterList',
    method: 'get',
    params: params
  })
}

export function updatePromoterApplyStatus (params) {
  return request({
    url: '/drp/promoter/apply',
    method: 'get',
    params: params
  })
}

export function goodsList (params) {
  return request({
    url: '/drp/goods/list',
    method: 'get',
    params: params
  })
}

export function goodsItem (params) {
  return request({
    url: '/drp/goods/item',
    method: 'get',
    params: params
  })
}

export function setLevelRate (data) {
  return request({
    url: '/drp/goods/setLevelRate',
    method: 'post',
    data: data
  })
}

//佣金明细
export function commissionList (params) {
  return request({
    url: '/drp/commission/list',
    method: 'get',
    params: params
  })
}
export function performanceStatistics (data) {
  return request({
    url: '/drp/commission/performanceStatistics',
    method: 'post',
    data: data
  })
}

export function commissionStatistics (data) {
  return request({
    url: '/drp/commission/commissionStatistics',
    method: 'post',
    data: data
  })
}



//提现申请列表
export function cashOutList (data) {
  return request({
    url: '/drp/cashOut/list',
    method: 'post',
    data: data
  })
}

//提现申请
export function updateCashOutApplyStatus (params) {
  return request({
    url: '/drp/cashOut/apply',
    method: 'get',
    params: params
  })
}







