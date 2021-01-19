/**
 * 动态对象
 */
export interface DynamicObject {
  [key: string]: string | number | boolean | Date | DynamicObject[];
}
