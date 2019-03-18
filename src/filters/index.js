import Vue from 'vue'
import global_ from '@/global'
import { formatDate } from '@/utils/date';
export function levelFilter (value) {
  if (value === 0) {
    return '一级';
  } else if (value === 1) {
    return '二级';
  }
}
export function memberStatus (val) {
  var label = "未知状态";
  switch (val) {
    case -1:
      label = '禁用';
      break;
    case -2:
      label = '注销';
      break;
    case 0:
      label = '未启用';
      break;
    case 1:
      label = '启用';
      break;
  }
  return label;
}
export function roleStatus (val) {
  var label = "未知状态";
  switch (val) {
    case -1:
      label = '禁用';
      break;
    case 0:
      label = '未启用';
      break;
    case 1:
      label = '启用';
      break;
  }
  return label;
}

export function powerStatus (val) {
  var label = "未知类型";
  switch (val) {

    case 0:
      label = '目录';
      break;
    case 1:
      label = '菜单';
      break;
    case -1:
      label = '功能';
      break;
  }
  return label;
}




export function formatAdvertiseType (type) {
  var aTypes = global_.defaultAdvertiseTypeOptions
  for (var index in aTypes) {
    var item = aTypes[index];
    if (item.value == type) {
      return item.label;
    }
  }
}
export function formatTime (time) {
  if (time == null || time === '') {
    return 'N/A';
  }
  let date = new Date(time);
  return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
}
