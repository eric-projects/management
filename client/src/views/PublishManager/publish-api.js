import { httpHelper, guidHelper } from '@/common/utils';
const publishApi = {};
// cache_module 模块名（表名）
// cache_key 数据传入主键
// cache_data_path 存储数据路径
// cache_data_key 数据自带主键
// cache_field 数据结构

const tmpModule = 'publish_dockerfile';
publishApi.addDockerfileTemplate = data => {
  return httpHelper.post(`/api/${tmpModule}/${guidHelper.generate()}`, data);
};

export default publishApi;
