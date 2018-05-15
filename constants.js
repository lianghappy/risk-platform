
exports.PORT = process.env.PORT || 8000;
exports.JIMI_ENV = process.env.JIMI_ENV || 'dev';
exports.VERSION = '1.0';

// 秘钥
exports.PASSWORD = {
    prod: 'XwxQ7i4T65BVaPqeX2Bc0XxSMHYGWuP6',
    sandbox: 'ZDqKURwRpSj070WjujeSaZfJsnh0ETk7',
    test: 'sY0KVp5jLtYDtpFquh29Nuc0lAJOQOsF',
    dev: 'YpVlYlPHOzDWSBKoEoDPoQirHvBc4rnr',
}[exports.JIMI_ENV];

// rbac接口
exports.API_RBAC = {
    dev: 'http://rbac-api.dev.jimistore.com',
    test: 'http://rbac-api.test.jimistore.com',
    prod: 'http://rbac-api.jimistore.com',
    sandbox: 'https://user-api.jimistore.com',
}[exports.JIMI_ENV];

// 平台接口
exports.API = {
    dev: 'http://platform-risk.dev.jimistore.com',
    test: 'http://platform-risk.test.jimistore.com',
    sandbox: 'https://testmsp-api.jimistore.com',
    prod: 'https://msp-api.jimistore.com',
}[exports.JIMI_ENV];

// 公用
exports.API_COMMON = {
    dev: 'http://api.test.jimistore.com:4999',
    test: 'http://api.test.jimistore.com:4999',
    sandbox: 'https://testcommon.jimistore.com',
    prod: 'https://common.jimistore.com',
}[exports.JIMI_ENV];

// 用户
exports.API_USER = {
    dev: 'http://user.dev.jimistore.com',
    test: 'http://user.test.jimistore.com',
    sandbox: 'https://testcommon.jimistore.com',
    prod: 'https://user-api.jimistore.com',
}[exports.JIMI_ENV];
