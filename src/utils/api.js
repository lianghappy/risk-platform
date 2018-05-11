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
    // 增加账号
    addAccount: `${API}/api/risk/manager/user/add/v1`,
    // 删除用户
    delAccount: `${API}/api/risk/manager/user/delete/v1`,
    // 更新用户
    updateAccount: `${API}/api/risk/manager/user/update/v1`,

    // 增加角色
    addRole: `${API_RBAC}/api/rbac/service/rolePlus/addMenuRole/v2`,
    // 删除
    delRole: `${API_RBAC}/api/rbac/service/rolePlus/delCheck/v1`,

    // 权限列表
    getPermission: `${API_RBAC}/api/rbac/service/menuPlus/list/v2`,

    // 获取公司列表
    getCompanyList: `${API}/api/risk/manager/application/company/list/v1`,
    // 添加公司
    addCompany: `${API}/api/risk/manager/application/company/create/v1`,
    // 公司的id查找公司详情
    companyItem: `${API}/api/risk/manager/application/company/get/v1`,
    // 删除公司
    companyDel: `${API}/api/risk/manager/application/company/delete/v1`,
    // 更新公司
    companyUpdate: `${API}/api/risk/manager/application/company/update/v1`,

    // 获取应用列表
    getAppList: `${API}/api/risk/manager/application/app/list/v1`,
    // 添加应用
    addApp: `${API}/api/risk/manager/application/app/create/v1`,
    // 应用的id查找公司详情
    appItem: `${API}/api/risk/manager/application/company/get/v1`,
    // 删除应用
    appDel: `${API}/api/risk/manager/application/app/delete/v1`,
    // 更新应用
    appUpdate: `${API}/api/risk/manager/application/app/update/v1`,
    // 应用详情
    getAppDetail: `${API}/api/risk/manager/application/app/get/v1`,
    // 已选产品
    listSign: `${API}/api/risk/manager/application/appProduct/listSign/v1`,
    // 未选产品
    listNoSign: `${API}/api/risk/manager/application/appProduct/listNoSign/v1`,
    // 单个创建
    createPro: `${API}/api/risk/manager/application/appProduct/create/v1`,
    // 单个删除
    delPro: `${API}/api/risk/manager/application/appProduct/delete/v1`,
    // 多个添加
    listCreatePro: `${API}/api/risk/manager/application/appProduct/listCreate/v1`,
    // 多个删除
    listDeletePro: `${API}/api/risk/manager/application/appProduct/listDelete/v1`,

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
    // 类别关联规则list
    getLinkRuler: `${API}/api/risk/manager/policy/categoryAndRule/list/v1`,
    // 获取来源的接口
    getChannel: `${API}/api/risk/manager/policy/channelBank/list/v1`,
    // 单个删除规则-类别数据
    delCategoryRule: `${API}/api/risk/manager/policy/categoryAndRule/delete/v1`,
    // 批量删除规则-类别数据
    delListCategoryRule: `${API}/api/risk/manager/policy/categoryAndRule/deletes/v1`,
    // 获取全部规则类别的list
    getCategoryList: `${API}/api/risk/manager/policy/category/list/all/v1`,

    // 策略
    getPolicyList: `${API}/api/risk/manager/policy/strategy/list/v1`,
    addPolicy: `${API}/api/risk/manager/policy/strategy/create/v1`,
    updatePolicy: `${API}/api/risk/manager/policy/strategy/update/v1`,
    //  克隆策略
    clonePolicy: `${API}/api/risk/manager/policy/strategy/clone/v1`,
    updataEnable: `${API}/api/risk/manager/policy/strategy/update/enable/v1`,

    // 阶段列表
    getStrategyList: `${API}/api/risk/manager/policy/stage/list/v1`,
    addStrategy: `${API}/api/risk/manager/policy/stage/create/v1`,
    updateStrategy: `${API}/api/risk/manager/policy/stage/update/v1`,
    delStrategy: `${API}/api/risk/manager/policy/stage/delete/v1`,

    // 黑白名单
    getBlack: `${API}/api/risk/manager/blackAndWhite/list/v1`,
    // 增加
    addBlack: `${API}/api/risk/manager/blackAndWhite/create/v1`,
    // 删除
    delBlack: `${API}/api/risk/manager/blackAndWhite/delete/v1`,
    // 更新
    updateBlack: `${API}/api/risk/manager/blackAndWhite/update/v1`,
    // 来源
    getBlackType: `${API}/api/risk/manager/policy/channelBank/list/v1`,

    // 实验样本
    getSamples: `${API}/api/risk/manager/collector/analysisSample/listByWideTable/v1`,

    // 沙箱样本
    getSandSamples: `${API}/api/risk/manager/collector/analysisSample/listByWideTable/v1`,
    // 删除
    delSandSamples: `${API}/api/risk/manager/collector/analysisSample/deleteAnalysisSample/v1`,
    // 明细
    detailSandSamples: `${API}/api/risk/manager/collector/analysisSample/sampleDetail/v1`,
    // 筛选条件
    selectSandSamples: `${API}/api/risk/manager/collector/analysisSample/get/v1`,
};

export default api;
