import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/register', component: () => import('@/views/scm/register'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },



  {
    path: '/pms',
    component: Layout,
    redirect: '/pms/product',
    name: 'pms',
    meta: { title: '商品', icon: 'product' },
    children: [{
      path: 'product',
      name: 'product',
      component: () => import('@/views/pms/product/index'),
      meta: { title: '商品列表', icon: 'product-list' }
    },
    {
      path: 'addProduct',
      name: 'addProduct',
      component: () => import('@/views/pms/product/add'),
      meta: { title: '添加商品', icon: 'product-add' }
    },
    {
      path: 'updateProduct',
      name: 'updateProduct',
      component: () => import('@/views/pms/product/update'),
      meta: { title: '修改商品', icon: 'product-add' },
      hidden: true
    },
    {
      path: 'productRecycle',
      name: 'productRecycle',
      component: () => import('@/views/pms/product/index'),
      meta: { title: '商品回收站', icon: 'product-recycle' },
      hidden: true
    },
    {
      path: 'productComment',
      name: 'productComment',
      component: () => import('@/views/pms/product/index'),
      meta: { title: '商品评价', icon: 'product-comment' },
      hidden: true
    },
    {
      path: 'productCate',
      name: 'productCate',
      component: () => import('@/views/pms/productCate/index'),
      meta: { title: '商品分类', icon: 'product-cate' }
    },
    {
      path: 'addProductCate',
      name: 'addProductCate',
      component: () => import('@/views/pms/productCate/add'),
      meta: { title: '添加商品分类' },
      hidden: true
    },
    {
      path: 'updateProductCate',
      name: 'updateProductCate',
      component: () => import('@/views/pms/productCate/update'),
      meta: { title: '修改商品分类' },
      hidden: true
    },
    {
      path: 'productAttr',
      name: 'productAttr',
      component: () => import('@/views/pms/productAttr/index'),
      meta: { title: '商品类型', icon: 'product-attr' }
    },
    {
      path: 'productAttrList',
      name: 'productAttrList',
      component: () => import('@/views/pms/productAttr/productAttrList'),
      meta: { title: '商品属性列表' },
      hidden: true
    },
    {
      path: 'addProductAttr',
      name: 'addProductAttr',
      component: () => import('@/views/pms/productAttr/addProductAttr'),
      meta: { title: '添加商品属性' },
      hidden: true
    },
    {
      path: 'updateProductAttr',
      name: 'updateProductAttr',
      component: () => import('@/views/pms/productAttr/updateProductAttr'),
      meta: { title: '修改商品属性' },
      hidden: true
    },
    {
      path: 'brand',
      name: 'brand',
      component: () => import('@/views/pms/brand/index'),
      meta: { title: '品牌管理', icon: 'product-brand' }
    },
    {
      path: 'addBrand',
      name: 'addBrand',
      component: () => import('@/views/pms/brand/add'),
      meta: { title: '添加品牌' },
      hidden: true
    },
    {
      path: 'updateBrand',
      name: 'updateBrand',
      component: () => import('@/views/pms/brand/update'),
      meta: { title: '编辑品牌' },
      hidden: true
    }
    ]
  },
  {
    path: '/oms',
    component: Layout,
    redirect: '/oms/order',
    name: 'oms',
    meta: { title: '订单', icon: 'order' },
    children: [
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/oms/order/index'),
        meta: { title: '订单列表', icon: 'product-list' }
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: () => import('@/views/oms/order/orderDetail'),
        meta: { title: '订单详情' },
        hidden: true
      },
      {
        path: 'deliverOrderList',
        name: 'deliverOrderList',
        component: () => import('@/views/oms/order/deliverOrderList'),
        meta: { title: '发货列表' },
        hidden: true
      },
      {
        path: 'orderSetting',
        name: 'orderSetting',
        component: () => import('@/views/oms/order/setting'),
        meta: { title: '订单设置', icon: 'order-setting' }
      },
      {
        path: 'returnApply',
        name: 'returnApply',
        component: () => import('@/views/oms/apply/index'),
        meta: { title: '退货申请处理', icon: 'order-return' }
      },
      {
        path: 'returnReason',
        name: 'returnReason',
        component: () => import('@/views/oms/apply/reason'),
        meta: { title: '退货原因设置', icon: 'order-return-reason' }
      },
      {
        path: 'returnApplyDetail',
        name: 'returnApplyDetail',
        component: () => import('@/views/oms/apply/applyDetail'),
        meta: { title: '退货原因详情' },
        hidden: true
      }
    ]
  },

  {
    path: '/ums',
    component: Layout,
    redirect: '/ums/member',
    name: 'ums',
    meta: { title: '会员', icon: 'user-manage' },
    children: [
      {
        path: 'member',
        name: 'member',
        component: () => import('@/views/ums/member'),
        meta: { title: '会员管理', icon: 'user' }
      },
      {
        path: 'addMember',
        name: 'addMember',
        component: () => import('@/views/ums/member/add'),
        meta: { title: '添加会员', icon: 'member-add' },
        hidden: true
      },
      {
        path: 'updateMember',
        name: 'updateMember',
        component: () => import('@/views/ums/member/update'),
        meta: { title: '编辑会员信息', icon: 'member-update' },
        hidden: true
      },
      {
        path: 'address',
        name: 'address',
        component: () => import('@/views/ums/address'),
        meta: { title: '收货地址', icon: 'address' }
      },
    ]
  },
  {
    path: '/stm',
    component: Layout,
    redirect: '/stm/subject',
    name: 'stm',
    meta: { title: '专题', icon: 'zhuanti' },
    children: [{
      path: 'subject',
      name: 'subject',
      component: () => import('@/views/stm/subject/index'),
      meta: { title: '专题列表', icon: 'product-list' }
    },
    {
      path: 'addSubject',
      name: 'addSubject',
      component: () => import('@/views/stm/subject/add'),
      meta: { title: '添加专题', icon: 'product-add' },
      hidden: true
    },
    {
      path: 'updateSubject',
      name: 'updateSubject',
      component: () => import('@/views/stm/subject/update'),
      meta: { title: '修改专题', icon: 'product-add' },
      hidden: true
    },
    {
      path: 'subjectProductRelation',
      name: 'subjectProductRelation',
      component: () => import('@/views/stm/subject/productRelationList'),
      meta: { title: '专题商品列表' },
      hidden: true
    },
    {
      path: 'subjectRecycle',
      name: 'subjectRecycle',
      component: () => import('@/views/stm/subject/index'),
      meta: { title: '专题回收站', icon: 'subject-recycle' },
      hidden: true
    },

    {
      path: 'subjectCate',
      name: 'subjectCate',
      component: () => import('@/views/stm/subjectCate/index'),
      meta: { title: '专题分类', icon: 'product-cate' }
    },
    {
      path: 'addSubjectCate',
      name: 'addSroductCate',
      component: () => import('@/views/stm/subjectCate/add'),
      meta: { title: '添加专题分类' },
      hidden: true
    },
    {
      path: 'updateProductCate',
      name: 'updateProductCate',
      component: () => import('@/views/stm/subjectCate/update'),
      meta: { title: '修改专题分类' },
      hidden: true
    }
    ]
  },
  {
    path: '/sms',
    component: Layout,
    redirect: '/sms/coupon',
    name: 'sms',
    meta: { title: '运营', icon: 'smsmanage' },
    children: [
      {
        path: 'flash',
        name: 'flash',
        component: () => import('@/views/sms/flash/index'),
        meta: { title: '秒杀活动列表', icon: 'sms-flash' }
      },
      {
        path: 'flashSession',
        name: 'flashSession',
        component: () => import('@/views/sms/flash/sessionList'),
        meta: { title: '秒杀时间段列表' },
        hidden: true
      },
      {
        path: 'selectSession',
        name: 'selectSession',
        component: () => import('@/views/sms/flash/selectSessionList'),
        meta: { title: '秒杀时间段选择' },
        hidden: true
      },
      {
        path: 'flashProductRelation',
        name: 'flashProductRelation',
        component: () => import('@/views/sms/flash/productRelationList'),
        meta: { title: '秒杀商品' },
        hidden: true
      },
      {
        path: 'coupon',
        name: 'coupon',
        component: () => import('@/views/sms/coupon/index'),
        meta: { title: '优惠券', icon: 'sms-coupon' }
      },
      {
        path: 'addCoupon',
        name: 'addCoupon',
        component: () => import('@/views/sms/coupon/add'),
        meta: { title: '添加优惠券' },
        hidden: true
      },
      {
        path: 'updateCoupon',
        name: 'updateCoupon',
        component: () => import('@/views/sms/coupon/update'),
        meta: { title: '修改优惠券' },
        hidden: true
      },
      {
        path: 'couponHistory',
        name: 'couponHistory',
        component: () => import('@/views/sms/coupon/history'),
        meta: { title: '优惠券领取详情' },
        hidden: true
      },
      {
        path: 'brand',
        name: 'homeBrand',
        component: () => import('@/views/sms/brand/index'),
        meta: { title: '品牌推荐', icon: 'product-brand' }
      },
      {
        path: 'new',
        name: 'homeNew',
        component: () => import('@/views/sms/new/index'),
        meta: { title: '新品推荐', icon: 'sms-new' }
      },
      {
        path: 'hot',
        name: 'homeHot',
        component: () => import('@/views/sms/hot/index'),
        meta: { title: '人气推荐', icon: 'sms-hot' }
      },
      {
        path: 'subject',
        name: 'homeSubject',
        component: () => import('@/views/sms/subject/index'),
        meta: { title: '专题推荐', icon: 'sms-subject' }
      },
      {
        path: 'advertise',
        name: 'homeAdvertise',
        component: () => import('@/views/sms/advertise/index'),
        meta: { title: '广告列表', icon: 'sms-ad' }
      },
      {
        path: 'addAdvertise',
        name: 'addHomeAdvertise',
        component: () => import('@/views/sms/advertise/add'),
        meta: { title: '添加广告' },
        hidden: true
      },
      {
        path: 'updateAdvertise',
        name: 'updateHomeAdvertise',
        component: () => import('@/views/sms/advertise/update'),
        meta: { title: '编辑广告' },
        hidden: true
      },
      {
        path: 'floor',
        name: 'pageFloor',
        component: () => import('@/views/sms/floor/index'),
        meta: { title: '页面楼层', icon: 'floor-settings' }
      },
      {
        path: 'addFloor',
        name: 'addFloor',
        component: () => import('@/views/sms/floor/add'),
        meta: { title: '添加页面楼层设置' },
        hidden: true
      },
      {
        path: 'updateFloor',
        name: 'updateFloor',
        component: () => import('@/views/sms/floor/update'),
        meta: { title: '修改页面楼层设置' },
        hidden: true
      },
      {
        path: 'frontCate',
        name: 'frontCate',
        component: () => import('@/views/sms/productCate/index'),
        meta: { title: '前台类目', icon: 'fenlei' }
      },
      {
        path: 'addFrontCate',
        name: 'addFrontCate',
        component: () => import('@/views/sms/productCate/add'),
        meta: { title: '添加前台类目' },
        hidden: true
      },
      {
        path: 'updateFrontCate',
        name: 'updateFrontCate',
        component: () => import('@/views/sms/productCate/update'),
        meta: { title: '修改前台类目' },
        hidden: true
      },
    ]
  },
  {
    path: '/rms',
    component: Layout,
    redirect: '/rms/role',
    name: 'rms',
    meta: { title: '权限', icon: 'quanxian' },
    children: [
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/rms/admin'),
        meta: { title: '管理员维护', icon: 'guanliyuan' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/rms/role'),
        meta: { title: '角色管理', icon: 'role_icon' }
      },
      {
        path: 'power',
        name: 'power',
        component: () => import('@/views/rms/power'),
        meta: { title: '权限管理', icon: 'power' }
      },
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

