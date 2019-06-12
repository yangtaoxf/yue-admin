const defaultAdvertiseTypeOptions = [
  {
    label: 'PC首页轮播',
    value: 0,
    range: {
      width: '2452px',
      height: '920px'
    }

  },
  {
    label: 'APP首页轮播',
    value: 1,
    range: {
      width: '2500px',
      height: '600px'
    }
  },
  {
    label: '小程序首页轮播',
    value: 3,
    range: {
      width: '2500px',
      height: '600px'
    }
  },
  {
    label: '登录背景图',
    value: 2,
    range: {
      width: '2500px',
      height: '600px'
    }
  }
];

const drpPromoterApplyStatus = {
  "WAIT_APPLY": {
    label: '待审核',
    value: 100
  },
  "AUTO_APPLY": {
    label: '自动通过',
    value: 110
  },
  "APPLY_SUCCESS": {
    label: '已通过',
    value: 111
  },
  "APPLY_REJECT": {
    label: '已驳回',
    value: 120
  }
}

const sysConfig = {
  storeId: 1
}

export default {
  defaultAdvertiseTypeOptions,
  drpPromoterApplyStatus,
  sysConfig
}