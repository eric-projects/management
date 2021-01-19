import { ValueLabelPair } from '@/common/defines';

/**
 * 将枚举以及其对应的描述对象，配对转化为数组
 * @param source 源枚举
 * @param map 枚举对应的 Text 说明
 */
export function enumMapping(source: any, map: any): ValueLabelPair[] {
  return Object.keys(map).map<ValueLabelPair>(key => ({ value: source[key], label: map[key] }));
}
