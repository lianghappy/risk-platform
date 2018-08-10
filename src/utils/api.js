/* eslint-disable no-undef */

// console.log(jimiEnv);
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
    // 获取账号信息
    getPassword: `${API}/api/risk/manager/user/get/v1`,

    // 增加角色
    addRole: `${API_RBAC}/api/rbac/service/rolePlus/addMenuRole/v2`,
    // 详情
    getMenuTreeDetails: `${API_RBAC}/api/rbac/service/rolePlus/get/v2`,
    // 更新角色
    updateRole: `${API_RBAC}/api/rbac/service/rolePlus/update/v2`,
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
    // 新增规则-类别数据
    categoryAndRule: `${API}/api/risk/manager/policy/categoryAndRule/create/v1`,
    updateCategory: `${API}/api/risk/manager/policy/category/update/v1`,
    // 未分类的关联规则数据
    getUnCategory: `${API}/api/risk/manager/policy/ruleBank/list/unCategory/v1`,
    // 规则查询
    ruleView: `${API}/api/risk/manager/policy/norm/get/v1`,

    // 策略
    getPolicyList: `${API}/api/risk/manager/policy/strategy/list/v1`,
    addPolicy: `${API}/api/risk/manager/policy/strategy/create/v1`,
    updatePolicy: `${API}/api/risk/manager/policy/strategy/update/v1`,
    //  克隆策略
    clonePolicy: `${API}/api/risk/manager/policy/strategy/clone/v1`,
    updataEnable: `${API}/api/risk/manager/policy/strategy/update/enable/v1`,
    // 获取策略详情
    getPolicyDetail: `${API}/api/risk/manager/policy/strategy/get/v1`,
    // 删除策略
    delPolicy: `${API}/api/risk/manager/policy/strategy/delete/v1`,

    // 阶段列表
    getStrategyList: `${API}/api/risk/manager/policy/stage/list/v1`,
    addStrategy: `${API}/api/risk/manager/policy/stage/create/v1`,
    updateStrategy: `${API}/api/risk/manager/policy/stage/update/v1`,
    delStrategy: `${API}/api/risk/manager/policy/stage/delete/v1`,

    /* ---------- 阶段管理-规则管理 ----------*/
    regular: `${API}/api/risk/manager/policy/norm/list/v1`,
    regularDel: `${API}/api/risk/manager/policy/norm/delete/v1`,
    regularAdd: `${API}/api/risk/manager/policy/norm/create/v1`,
    regularUpdate: `${API}/api/risk/manager/policy/norm/update/v1`,
    regularClone: `${API}/api/risk/manager/policy/norm/clone/v1`,
    // 新增规则组
    AddRegulars: `${API}/api/risk/manager/policy/normGroup/create/v1`,
    // list规则
    regularList: `${API}/api/risk/manager/policy/normGroup/list/v1`,
    rulesView: `${API}/api/risk/manager/policy/normGroup/get/v1`,
    regularDels: `${API}/api/risk/manager/policy/normGroup/delete/v1`,
    updateRegulars: `${API}/api/risk/manager/policy/normGroup/update/v1`,
    cloneRegulars: `${API}/api/risk/manager/policy/normGroup/clone/v1`,
    regularsDels: `${API}/api/risk/manager/policy/normGroup/delete/v1`,


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
    // 获取黑白名单的具体数据
    getBAW: `${API}/api/risk/manager/blackAndWhite/getOne/v1`,

    /* ---------- 策略沙箱-开始实验 ----------*/
    // 实验样本
    getSamples: `${API}/api/risk/manager/collector/analysisSample/listByWideTable/v1`,
    experDetails: `${API}/api/risk/manager/collector/analysisSample/trainingSampleDetail/v1`,
    experList: `${API}/api/risk/manager/collector/analysisSample/list/v1`,
    //  样本筛选条件
    experSelect: `${API}/api/risk/manager/collector/analysisSample/get/v1`,
    // 开始实验
    addStartExpers: `${API}/api/risk/manager/analysis/analysisRecord/start/without/v1`,
    // 实验记录
    recordHistoryList: `${API}/api/risk/manager/analysis/analysisRecord/list/v1`,
    // 下载实验结果
    download: `${API}/api/risk/manager/analysis/analysisRecord/download/v1`,
    // 下载规则命中统计
    downCount: `${API}/api/risk/manager/analysis/analysisRecord/downloadHitNormNums/v1`,

    /* ---------- 沙箱样本 ----------*/
    // 沙箱样本
    getSandSamples: `${API}/api/risk/manager/collector/analysisSample/listByWideTable/v1`,
    // 删除
    delSandSamples: `${API}/api/risk/manager/collector/analysisSample/deleteAnalysisSample/v1`,
    // 明细
    detailSandSamples: `${API}/api/risk/manager/collector/analysisSample/sampleDetail/v1`,
    // 筛选条件
    selectSandSamples: `${API}/api/risk/manager/collector/analysisSample/get/v1`,
    // 获取所有的数据源
    getAllType: `${API}/api/risk/manager/policy/getAllChannelBank/list/v1`,
    // 沙箱样本创建样本
    addCreateSamples: `${API}/api/risk/manager/collector/analysisSample/createWideTableAnalysisSample/v1`,
    // 已有的样本开始实验
    oldStartExpers: `${API}/api/risk/manager/analysis/analysisRecord/start/with/v1`,

    // 沙箱实验
    startExpe: `${API}/api/risk/manager/collector/analysisSample/selectSample/v1`,

    /* ---------- 报警对象-报警收件人 ----------*/
    warningPeople: `${API}/api/risk/manager/monitor/getSleuthPersonListByReq/v1`,
    // 新增收件人
    addPeople: `${API}/api/risk/manager/monitor/createPerson/v1`,
    // 获取验证码
    getCode: `${API}/api/risk/manager/monitor/getVerificationCodeByReq/v1`,
    // 编辑报警收件人
    updataPeople: `${API}/api/risk/manager/monitor/updateSleuthPersonByReq/v1`,
    // 删除报警收件人
    delPeople: `${API}/api/risk/manager/monitor/deleteOneSleuthPersonByReq/v1`,
    delsPeople: `${API}/api/risk/manager/monitor/deleteSleuthPersonByReq/v1`,
    // 获取报警组
    warningTeamList: `${API}/api/risk/manager/monitor/getAllTeamAndPerson/v1`,
    addTeam: `${API}/api/risk/manager/monitor/createByRequest/v1`,
    updataTeam: `${API}/api/risk/manager/monitor/updateByRequest/v1`,
    delTeam: `${API}/api/risk/manager/monitor/deleteSleuthTeamByRequest/v1`,
    // 删除报警收件组里面的收件人
    delTeamPeople: `${API}/api/risk/manager/monitor/deletePersonInTeam/v1`,

    /* ---------- 监控-报警历史 ----------*/
    historyPolice: `${API}/api/risk/manager/monitor/sleuthHistory/list/v1`,

    /* ----------------报警规则------------------- */
    getNoPeoples: `${API}/api/risk/manager/monitor/getAllTeamAndPerson/v1`,
    // 监控指标
    warningZB: `${API}/api/risk/manager/monitor/monitorItem/all/v1`,
    // 更新报警规则
    updateWarnRule: `${API}/api/risk/manager/monitor/sleuthConfig/update/v1`,
    // 创建报警规则
    addWarnRule: `${API}/api/risk/manager/monitor/sleuthConfig/create/v1`,
    delWarnRule: `${API}/api/risk/manager/monitor/sleuthConfig/delete/v1`,
    // 更改状态
    updateStatus: `${API}/api/risk/manager/monitor/sleuthConfig/change/v1`,
    getSingleRule: `${API}/api/risk/manager/monitor/sleuthConfig/get/v2`,
    warningRuleList: `${API}/api/risk/manager/monitor/sleuthConfig/list/v2`,

    /* --------------------订单管理--------------------- */
    // 订单管理列表
    orderList: `${API}/api/risk/manager/collector/sample/list/v1`,
    // 订单基本信息
    orderBasic: `${API}/api/risk/manager/collector/sample/info/byId/v1`,
    linkOrderList: `${API}/api/risk/manager/collector/sample/relation/byId/v1`,
    // 风控报告
    getReport: `${API}/api/risk/manager/collector/sample/riskReport/v1`,

    /* ------------------------监控大盘-------------------------- */
    UserdashBoard: `${API}/api/risk/manager/monitor/dashBoard/list/byUser/v1`,
    dashBoard: `${API}/api/risk/manager/monitor/dashBoard/list/v1`,
    addDisks: `${API}/api/risk/manager/monitor/dashBoard/create/v1`,
    addDiskTable: `${API}/api/risk/manager/monitor/boardAndSleuth/create/v1`,
    dashBoardData: `${API}/api/risk/manager/monitor/dashBoard/data/list/v1`,
    delDisk: `${API}/api/risk/manager/monitor/dashBoard/delete/v1`,
    delTableDisk: `${API}/api/risk/manager/monitor/boardAndSleuth/delete/v1`,
    // 单个大盘操作
    SingleDisk: `${API}/api/risk/manager/monitor/dashBoard/chart/data/v1`,

    /* ---------------------------第三方产品------------------------------ */
    getThirdPartyList: `${API}/api/risk/manager/collector/thirdpartyManage/list/v1`,
    addThirdParty: `${API}/api/risk/manager/collector/thirdpartyManage/create/v1`,

    /* -------------------------------灰度策略----------------------------------- */
    getGrayPolicyList: `${API}/api/risk/manager/strategy/grayStrategy/list/v1`,
    grayPolicyAdd: `${API}/api/risk/manager/strategy/grayStrategy/create/v1`,
    grayPolicyUpdate: `${API}/api/risk/manager/strategy/grayStrategy/update/v1`,
    grayPolicyDel: `${API}/api/risk/manager/strategy/grayStrategy/delete/v1`,
    grayPolicyDetails: `${API}/api/risk/manager/strategy/grayStrategy/details/v1`,
    // 更改状态
    grayPlyChangeStatus: `${API}/api/risk/manager/strategy/grayStrategy/modifyStatus/v1`,

    /* ------------------------------------数据报表---------------------------------------- */
    getReportList: `${API}/api/risk/manager/policy/normHit/normHitStatistic/v1`,
    // 规则命中统计的下拉菜单
    NormHitChannal: `${API}/api/risk/manager/policy/normHit/NormHitChannal/v1`,
    // 根据策略查找阶段
    normHit: `${API}/api/risk/manager/policy/normHit/StageChannal/v1`,
    // 三方统计
    dailyRecord: `${API}/api/risk/manager/collector/thirdpartyManage/dailyRecord/v1`,

};

export default api;
