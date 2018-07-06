const PORT = process.env.PORT || 8000;
const JIMI_ENV = process.env.JIMI_ENV || 'dev';
const VERSION = '1.0';
const PATHS = process.env.PATHS || '';
// 秘钥
const PASSWORD = {
    prod: 'XwxQ7i4T65BVaPqeX2Bc0XxSMHYGWuP6',
    sandbox: 'ZDqKURwRpSj070WjujeSaZfJsnh0ETk7',
    test: 'sY0KVp5jLtYDtpFquh29Nuc0lAJOQOsF',
    dev: 'YpVlYlPHOzDWSBKoEoDPoQirHvBc4rnr',
}[JIMI_ENV];
// rbac接口
const API_RBAC = {
    dev: 'http://rbac-api.dev.jimistore.com',
    test: 'http://rbac-api.test.jimistore.com',
    prod: 'https://rbac-api.jimistore.com',
    sandbox: 'https://114.55.95.151:23061',
}[JIMI_ENV];
// 平台接口
const API = {
    dev: 'http://platform-risk.dev.jimistore.com',
    test: 'http://platform-risk.test.jimistore.com',
    sandbox: 'https://testmsp-api.jimistore.com',
    prod: 'https://msp-api.jimistore.com',
}[JIMI_ENV];
// 公用
const API_COMMON = {
    dev: 'http://api.test.jimistore.com:4999',
    test: 'http://api.test.jimistore.com:4999',
    sandbox: 'https://testcommon.jimistore.com',
    prod: 'https://common.jimistore.com',
}[JIMI_ENV];
// 用户
const API_USER = {
    dev: 'http://user.dev.jimistore.com',
    test: 'http://user.test.jimistore.com',
    sandbox: 'https://testcommon.jimistore.com',
    prod: 'https://user-api.jimistore.com',
}[JIMI_ENV];

exports.PORT = PORT;
exports.JIMI_ENV = JIMI_ENV;
exports.PATHS = PATHS;
exports.VERSION = VERSION;
exports.API = API;
exports.API_COMMON = API_COMMON;
exports.API_USER = API_USER;
exports.API_RBAC = API_RBAC;
exports.PASSWORD = PASSWORD;
