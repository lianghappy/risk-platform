/* eslint-disable no-undef */

const api = {
    // 地址库
    address: 'https://product.jimistore.com/area/manageContAddrProd.json',
    // oss上传
    oss: `${API_COMMON}/api/fileUpload/accessKey/merchant`,
    // 登录
    login: `${API}/api/risk/manager/user/login/v1`,
    // 默认地址
    getAddress: 'https://migu.jimistore.com/api/model/explains/yihuigou',
    // 修改密码
    userResetPwd: `${API}/api/risk/manager/user/updatePass/v1`,
    // 用户列表
    userList: `${API}/api/merchant/proxy/user/listUser/v1`,
    // 添加用户
    addUser: `${API}/api/risk/manager/user/add/v1`,
    // 修改用户
    editUser: `${API}/api/risk/manager/user/update/v1`,
    // 查询用户
    selectUser: `${API}/api/risk/manager/user/select/v1`,
    // 获取公司列表
    getCompanyList: `${API}/api/risk/manager/application/company/list/v1`,
    // 添加公司
    addCompany: `${API}/api/risk/manager/application/company/create/v1`,
    // 角色名称的列表
    roleNameList: `${API_RBAC}/api/rbac/service/rolePlus/list/v2`,
    // 账号列表
    getAccountList: `${API}/api/risk/manager/user/select/v1`,
    // 角色列表
    getRoleList: `${API_RBAC}/api/rbac/service/rolePlus/list/v2`,
    // 权限树
    getMenuTreeList: `${API_RBAC}/api/rbac/service/rolePlus/menuTreeList/v2`,
    // 获取规则类别的接口
    getCategory: `${API}/api/risk/manager/policy/category/list/v1`,
    // 新增类别操作保存数据接口
    addCategory: `${API}/api/risk/manager/policy/category/create/v1`,
    // 获取父类别列表
    getParentCategory: `${API}/api/risk/manager/policy/category/parent/list/v1`,
    // 获取规则库列表
    getRules: `${API}/api/risk/manager/policy/ruleBank/list/v1`,
};

export default api;
