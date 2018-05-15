const path = require('path');
const constants = require('./constants');

export default {
    entry: 'src/index.js',
    html: {
        template: 'src/index.ejs',
    },
    extraBabelPlugins: [
        ['import', {libraryName: 'antd', style: true }],
    ],
    env: {
        development: {
            extraBabelPlugins: ['dva-hmr'],
            publicPath: '/',
        },
        production: {
            outputPath: path.join(__dirname, `dist/${constants.VERSION}`),
            publicPath: `/${constants.VERSION}/`,
            html: {
                template: 'src/index.ejs',
                filename: '../index.html',
            },
        },
    },
    browserslist: [
        'last 5 versions',
        'last 5 Chrome versions',
        'Firefox >= 17',
        'ie >= 8',
        'iOS >= 8',
        'Android >= 4',
    ],
    hash: true,
    define: {
        jimiEnv: constants.JIMI_ENV, //环境变量
        version: constants.VERSION, // 版本号
        password: constants.PASSWORD, // 签名秘钥
        API: constants.API,
        API_COMMON: constants.API_COMMON,
        API_USER: constants.API_USER,
        API_RBAC: constants.API_RBAC,
    },
    alias: {
        assets: path.join(__dirname, 'src/assets'),
        components: path.join(__dirname, 'src/components'),
        models: path.join(__dirname, 'src/models'),
        routes: path.join(__dirname, 'src/routes'),
        services: path.join(__dirname, 'src/services'),
        utils: path.join(__dirname, 'src/utils'),
    },
}
