import fetch from 'dva/fetch';
import { ENV, PASSWORD, ERR_MSG } from 'utils/constants';
import MD5 from 'utils/MD5';

// appid
const appId = {
    prod: 'merchant-proxy-prod',
    sandbox: 'merchant-proxy-sandbox',
    test: 'merchant-proxy-test',
    dev: 'merchant-proxy-test',
}[ENV];

// 公共请求头
const headers = {
    appId, // app唯一标识
    deviceId: 'null', // 设备唯一标识
    userId: 'null', // 用户id
    OSVersion: parseFloat(navigator.appVersion), // 设备系统版本
    timestamp: '', // 时间戳
    signature: '', // 签名
    'Content-Type': 'application/json',
};

// 设置用户Id
function setUserId(userId) {
    Object.assign(headers, { userId });
}

// 设置设备Id
function setDeviceId(deviceId) {
    Object.assign(headers, { deviceId });
}

// 设置token
function setToken(token) {
    if (token) Object.assign(headers, { token });
    else delete headers.token;
}

// 签名
function signature() {
    const timestamp = new Date().getTime();
    let sign = [
        `${headers.appId}=appId`,
        `${PASSWORD}=password`,
        `${headers.userId}=userId`,
        `${headers.deviceId}=deviceId`,
        `${headers.OSVersion}=OSVersion`,
        `${timestamp}=timestamp`,
    ];
    sign.sort();
    sign = sign.join('&');
    sign = MD5(sign);
    Object.assign(headers, { timestamp, signature: sign });
}

function parseJSON(response) {
    return response.json();
}

// http请求状态校验
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText || ERR_MSG);
    error.code = response.status;
    throw error;
}

/**
 * get请求方式参数解析
 *
 * @param  {object|arrry|string} data
 * @return {string}
 */
function makeGetParams(data) {
    const type = Object.prototype.toString.call(data);
    switch (type) {
    case '[object Object]': {
        const paramsArr = [];
        Object.keys(data).forEach(value => {
            paramsArr.push(`${value}=${encodeURIComponent(data[value])}`);
        });

        if (paramsArr.length) return paramsArr.join('&');
        return '';
    }
    case '[object Array]':
        return data.join('&');
    case '[object String]':
        return data;
    default:
        return '';
    }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [config]  The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
function request(url, config) {
    let requestUrl = url;
    const options = {
        method: config.method || 'POST',
        mode: 'cors', // 请求模式
        catche: 'no-cache', // 缓存
    };

    // 请求头处理
    if (config.standard) {
    // 约定的数据请求
        options.headers = { ...headers, ...config.headers };
    } else {
        options.headers = config.headers;
    }

    // 请求参数处理
    if (Object.is(config.method, 'GET')) {
        const params = makeGetParams(config.data);
        if (params !== '') {
            if (Object.is(requestUrl.indexOf('?'), -1)) requestUrl += `?${params}`;
            else requestUrl += `&${params}`;
        }
    } else if (Object.is(config.method, 'POST')) {
        if (config.data) {
            if (
                options.headers
                && Object.is(options.headers['Content-Type'], 'application/json')
                && Object.is(Object.prototype.toString.call(config.data), '[object Object]')
            ) {
                options.body = JSON.stringify(config.data);
            } else {
                options.body = config.data;
            }
        }
    }

    return fetch(encodeURI(requestUrl), options)
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => {
            if (config.standard) {
            // 约定的数据格式
                if (config.withCode) return data; // 返回所有数据【code+data/code+message】

                if (Object.is(data.code, '200')) return data.data;
                const error = new Error(data.message || ERR_MSG);
                error.code = data.code;
                throw error;
            } else {
                return data;
            }
        })
        .catch((error) => {
            throw error;
        });
}

// get请求
function get(url, data, config) {
    return request(url, {
        data,
        method: 'GET',
        standard: true, // 是否按约定的数据格式返回【code+data/code+message】
        withCode: false, // 是否返回code【response.status==200且standard:true有效】
        ...config,
    });
}

// post请求
function post(url, data, config) {
    return request(url, {
        data,
        method: 'POST',
        standard: true,
        withCode: false,
        ...config,
    });
}

export {
    setUserId,
    setDeviceId,
    setToken,
    signature,
    get,
    post,
};
