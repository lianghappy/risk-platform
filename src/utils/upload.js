/**
 *
 * @author          WeiMing Huang <huangweiming@jimistore.com>
 * @date            2018-02-02 15:31:03
 * @description     文件上传通用方法
 *
 */


import fetch from 'dva/fetch';
import { message } from 'antd';
import { post } from '../utils/request';
import { getUUID } from './common';

function uploadResult(params, formData, host, fname) {
    let data = '';
    const fetchtimeOut = (requestPromise, timeout = 30000) => {
        let timeoutAction = null;
        const timerPromise = new Promise((resolve, reject) => {
            timeoutAction = () => {
                reject(new Error('timeout'));
            };
        });
        setTimeout(() => {
            timeoutAction();
        }, timeout);
        return Promise.race([requestPromise, timerPromise]);
    };

    const myFetch = fetch(host, {
        method: 'POST',
        body: formData,
    }).then((re) => {
        if (re.status === 200) {
            data = `${host}/${params.type}/${fname}`;
        } else data = 'error';
        return data;
    })
        .catch(() => {
            return 'error';
        });

    return fetchtimeOut(myFetch);
}
export default function upload(params) {
    const file = params.file;

    // 首页入口配置：index
    // 商品配置：视频：video,图片：leaseProduct
    // 回收商品：recycleProduct
    // 每日签到，图文配置：leaseProduct
    // 其他上传图片：manual
    /* eslint-disable no-undef */
    const url = `${API_COMMON}/api/fileUpload/accessKey/${params.type}`;
    post(url, null, {
        standard: false,
    }).then((res) => {
        const fname = getUUID();
        const formData = new window.FormData();
        formData.append('name', fname);
        formData.append('key', `${params.type}/${fname}`);
        formData.append('policy', res.policy);
        formData.append('OSSAccessKeyId', res.accessid);
        formData.append('success_action_status', '200');
        formData.append('signature', res.signature);
        formData.append('bucket', res.bucket);
        formData.append('file', file); // file必须放在表单域后面

        return uploadResult(params, formData, res.host, fname);
    }).then((data) => {
        if (data === 'error') {
            return message.error('上传文件失败');
        } else if (data === 'timeout') {
            return message.error('上传文件超时！');
        }
        return params.success(params.key, data);
    }).catch(error => params.success(params.key, error));
    // getOssKey(params.type).then((res) => {
    //     const fname = common.getUUID();
    //     const formData = new window.FormData();
    //     formData.append('name', fname);
    //     formData.append('key', `${params.type}/${fname}`);
    //     formData.append('policy', res.policy);
    //     formData.append('OSSAccessKeyId', res.accessid);
    //     formData.append('success_action_status', '200');
    //     formData.append('signature', res.signature);
    //     formData.append('bucket', res.bucket);
    //     formData.append('file', file); // file必须放在表单域后面
    //
    //     return uploadResult(params, formData, res.host, fname);
    // }).then((data) => {
    //     if (data === 'error') {
    //         return message.error('上传文件失败！');
    //     } else if (data === 'timeout') {
    //         return message.error('上传文件超时！');
    //     }
    //     return params.success(params.key, data);
    // }).catch(error => params.success(params.key, error));
}
