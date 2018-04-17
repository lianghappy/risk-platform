/* eslint-disable no-undef */

const api = {
    // 地址库
    address: 'https://product.jimistore.com/area/manageContAddrProd.json',
    // oss上传
    oss: `${API_COMMON}/api/fileUpload/accessKey/merchant`,
    // 登录
    login: `${API}/api/merchant/proxy/user/login/v1`,
    // 默认地址
    getAddress: 'https://migu.jimistore.com/api/model/explains/yihuigou',
    // 修改密码
    userResetPwd: `${API}/api/rbac/service/user/resetPwd/v1`,
    // 用户列表
    userList: `${API}/api/merchant/proxy/user/listUser/v1`,
};

export default api;
