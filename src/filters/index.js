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
