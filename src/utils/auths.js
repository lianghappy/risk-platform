
export const authed = [
    {
        name: '管理中心',
        key: 'system',
        id: 'R_system',
    }, {
        name: '账号管理',
        key: 'account',
        router: '/account',
        pid: 'R_system',
        id: 'R_system_acc',
    }, {
        name: '角色管理',
        key: 'role',
        router: '/role',
        id: 'R_system_role',
        pid: 'R_system',
    }, {
        name: '权限管理',
        key: 'permission',
        router: '/permission',
        pid: 'R_system',
        id: 'R_system_perm',
    }, {
        name: '订单管理',
        key: 'order',
        router: '/order',
        pid: 'R_system',
        id: 'R_system_order',
    }, {
        name: '黑白名单',
        key: 'black',
        router: '/black',
        pid: 'R_system',
        id: 'R_system_baw',
    }, {
        name: '第三方产品',
        key: 'thirdPartyManage',
        router: '/thirdPartyManage',
        pid: 'R_system',
        id: 'R_system_third',
    }, {
        name: '应用中心',
        key: 'application',
        id: 'R_apps',
    }, {
        name: '应用管理',
        key: 'app',
        router: '/app',
        pid: 'R_apps',
        id: 'R_apps_app',
    }, {
        name: '监控中心',
        key: 'earlyWarning',
        id: 'R_warn',
    }, {
        name: '监控大盘',
        key: 'disk',
        router: '/disk',
        pid: 'R_warn',
        id: 'R_warn_disk',
    }, {
        name: '报警历史',
        key: 'historyPolice',
        router: '/historyPolice',
        pid: 'R_warn',
        id: 'R_warn_hst',
    },
];
export const autheds = [
    {
        name: '策略中心',
        key: 'policy',
        id: 'R_policy',
    }, {
        name: '指标分类',
        key: 'categoryStru',
        router: '/categoryStru',
        pid: 'R_policy',
        id: 'R_policy_rule',
    }, {
        name: '指标库',
        key: 'rule',
        router: '/rule',
        pid: 'R_policy',
        id: 'R_policy_rules',
    }, {
        name: '决策引擎',
        key: 'policy',
        router: '/policy',
        id: 'R_policy_ply',
        pid: 'R_policy',
    }, {
        name: '实验中心',
        key: 'sandboxie',
        id: 'R_exp',
    }, {
        name: '策略沙箱',
        key: 'sandboxie',
        router: '/sandboxie',
        pid: 'R_exp',
        id: 'R_exp_sanb',
    }, {
        name: '实验样本',
        key: 'samples',
        router: '/samples',
        pid: 'R_exp',
        id: 'R_exp_samp',
    }, {
        name: '实验记录',
        key: 'recordHistory',
        router: '/recordHistory',
        pid: 'R_exp',
        id: 'R_exp_record',
    }, {
        name: '沙箱样本',
        key: 'sandSamples',
        router: '/sandSamples',
        pid: 'R_exp',
        id: 'R_exp_sabp',
    }, {
        name: '报警中心',
        key: 'warning',
        id: 'R_police',
    }, {
        name: '报警规则',
        key: 'warningRule',
        router: '/warningRule',
        pid: 'R_police',
        id: 'R_police_rl',
    }, {
        name: '报警对象',
        key: 'warningPeople',
        router: '/warningPeople',
        pid: 'R_police',
        id: 'R_police_obj',
    }
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
