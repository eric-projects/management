import { httpHelper, jwtHelper } from '@/common/utils';
const commonApi = {};
// cache_module 模块名（表名）
// cache_key 数据传入主键
// cache_data_path 存储数据路径
// cache_data_key 数据自带主键
// cache_field 数据结构

/**
 * 添加数据
 * @param {*} module 模块/表
 * @param {*} id 行id
 * @param {*} data 行数据
 * @param {*} field 自定义添加数据/表新建列
 * @returns
 */
commonApi.post = (module, id, data, field = []) => {
  return httpHelper.post(`/api/${module}/${id}?cache_field=${field.join(',')}`, data);
};

export default commonApi;
