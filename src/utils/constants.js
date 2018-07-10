/* eslint-disable no-undef */

// 环境变量
export const ENV = jimiEnv;
console.log(ENV);

// 版本号
export const VERSION = version;
// 秘钥
export const PASSWORD = password;
// 表格每页条数
export const PAGE_SIZE = 10;
// 错误提示
export const ERR_MSG = '系统错误，请稍后重试';
// 全局提示延时时间(秒)
export const DURATION = 3;
// 系统参数sysId
export const SYSID = 'risk';
// 基于根目录的项目路径
export const PATHS = paths;
// 上下架
export const OPRA = [{
    key: '0',
    value: '未上架',
}, {
    key: '1',
    value: '已上架',
}, {
    key: '2',
    value: '已下架',
}];
