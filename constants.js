
exports.PORT = process.env.PORT || 8000;
exports.JIMI_ENV = process.env.JIMI_ENV || 'test';
exports.VERSION = '1.0';

// 秘钥
exports.PASSWORD = {
    prod: '2150b489f07f43b78fc6fb5b13b2480b',
    sandbox: '2150b489f07f43b78fc6fb5b13b2480b',
    test: '318b04a58d9c4b54af076a3874c5483a',
    dev: '318b04a58d9c4b54af076a3874c5483a',
}[exports.JIMI_ENV];

// 平台接口
exports.API = {
    dev: 'http://msp-api.dev.jimistore.com',
    test: 'http://msp-api.test.jimistore.com',
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

//用户
exports.API_USER = {
    dev: 'http://user.dev.jimistore.com',
    test: 'http://user.test.jimistore.com',
    sandbox: 'https://testcommon.jimistore.com',
    prod: 'https://user-api.jimistore.com',
}[exports.JIMI_ENV];
