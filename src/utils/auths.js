
export default [
    {
        name: '系统管理',
        key: 'system',
        id: 'R_M_system',
    }, {
        name: '账号管理',
        key: 'account',
        router: '/account',
        pid: 'R_M_system',
        id: 'R_F_system_user',
    }, {
        name: '角色管理',
        key: 'role',
        router: '/role',
        id: 'R_F_system_role',
        pid: 'R_M_system',
    }, {
        name: '权限管理',
        key: 'permission',
        router: '/permission',
        pid: 'R_M_system',
        id: 'R_F_system_auth',
    }, {
        name: '应用中心',
        key: 'application',
        id: 'R_M_application',
    }, {
        name: '应用管理',
        key: 'app',
        router: '/app',
        pid: 'R_M_application',
        id: 'R_F_app_app',
    }, {
        name: '决策引擎',
        key: 'policy',
        id: 'R_M_policy',
    }, {
        name: '指标分类',
        key: 'categoryStru',
        router: '/categoryStru',
        pid: 'R_M_policy',
        id: 'R_F_PLY_catg',
    }, {
        name: '指标库',
        key: 'rule',
        router: '/rule',
        pid: 'R_M_policy',
        id: 'R_F_PLY_rule',
    }, {
        name: '策略管理',
        key: 'policy',
        router: '/policy',
        id: 'R_F_PLY_policies',
        pid: 'R_M_policy',
    }, {
        name: '策略沙箱',
        key: 'sandboxie',
        id: 'R_M_sandboxie',
    }, {
        name: '策略沙箱',
        key: 'sandboxie',
        router: '/sandboxie',
        pid: 'R_M_sandboxie',
        id: 'R_F_SB_sandbox',
    }, {
        name: '实验样本',
        key: 'samples',
        router: '/samples',
        pid: 'R_M_sandboxie',
        id: 'R_F_SB_samples',
    }, {
        name: '实验记录',
        key: 'recordHistory',
        router: '/recordHistory',
        pid: 'R_M_sandboxie',
        id: 'R_F_SB_record',
    }, {
        name: '沙箱样本',
        key: 'sandSamples',
        router: '/sandSamples',
        pid: 'R_M_sandboxie',
        id: 'R_F_SB_sandsamples',
    }, {
        name: '黑白名单',
        key: 'blackAndWhite',
        id: 'R_M_blackAndWhite',
    }, {
        name: '黑名单',
        key: 'black',
        router: '/black',
        id: 'R_F_BAW_black',
        pid: 'R_M_blackAndWhite',
    }, {
        name: '白名单',
        key: 'white',
        router: '/white',
        pid: 'R_M_blackAndWhite',
        id: 'R_F_BAW_white',
    }, {
        name: '灰名单',
        key: 'gray',
        router: '/gray',
        pid: 'R_M_blackAndWhite',
        id: 'R_F_BAW_gray',
    },
];
// export default [
//     {
//         name: '系统管理',
//         key: 'system',
//         children: [{
//             name: '账号管理',
//             key: 'account',
//             router: '/account',
//         }, {
//             name: '角色管理',
//             key: 'role',
//             router: '/role',
//         }, {
//             name: '权限管理',
//             key: 'permission',
//             router: '/permission',
//         }],
//     }, {
//         name: '应用管理',
//         key: 'application',
//         children: [{
//             name: '公司管理',
//             key: 'company',
//             router: '/company',
//         }, {
//             name: '应用管理',
//             key: 'app',
//             router: '/app',
//         }],
//     }, {
//         name: '决策引擎',
//         key: 'policy',
//         children: [{
//             name: '类别管理',
//             key: 'categoryStru',
//             router: '/categoryStru',
//         }, {
//             name: '规则库管理',
//             key: 'rule',
//             router: '/rule',
//         }, {
//             name: '策略管理',
//             key: 'policy',
//             router: '/policy',
//         }],
//     }, {
//         name: '策略沙箱',
//         key: 'sandboxie',
//         children: [{
//             name: '策略沙箱',
//             key: 'sandboxie',
//             router: '/sandboxie',
//         }, {
//             name: '实验样本',
//             key: 'samples',
//             router: '/samples',
//         }, {
//             name: '实验记录',
//             key: 'recordHistory',
//             router: '/recordHistory',
//         }, {
//             name: '沙箱样本',
//             key: 'sandSamples',
//             router: '/sandSamples',
//         }],
//     }, {
//         name: '黑白名单',
//         key: 'blackAndWhite',
//         children: [{
//             name: '黑名单',
//             key: 'black',
//             router: '/black',
//         }, {
//             name: '白名单',
//             key: 'white',
//             router: '/white',
//         }, {
//             name: '灰名单',
//             key: 'gray',
//             router: '/gray',
//         }],
//     },
// ];
