import Vue from 'vue'

export function levelFilter (value) {
  if (value === 0) {
	return '一级';
  } else if (value === 1) {
	return '二级';
  }
}
