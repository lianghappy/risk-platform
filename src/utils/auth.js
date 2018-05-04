export default [
    {
        name: '系统管理',
        key: 'system',
        children: [{
            name: '账号管理',
            key: 'account',
            router: '/account',
        }, {
            name: '角色管理',
            key: 'role',
            router: '/role',
        }, {
            name: '权限管理',
            key: 'permission',
            router: '/permission',
        }],
    }, {
        name: '应用管理',
        key: 'application',
        children: [{
            name: '公司管理',
            key: 'company',
            router: '/company',
        }, {
            name: '应用管理',
            key: 'app',
            router: '/app',
        }],
    }, {
        name: '决策引擎',
        key: 'policy',
        children: [{
            name: '类别管理',
            key: 'categoryStru',
            router: '/categoryStru',
        }, {
            name: '规则库管理',
            key: 'rule',
            router: '/rule',
        }, {
            name: '策略管理',
            key: 'policy',
            router: '/policy',
        }],
    }, {
        name: '策略沙箱',
        key: 'sandboxie',
        children: [{
            name: '策略沙箱',
            key: 'sandboxie',
            router: '/sandboxie',
        }, {
            name: '实验样本',
            key: 'samples',
            router: '/samples',
        }, {
            name: '实验记录',
            key: 'records',
            router: '/records',
        }, {
            name: '沙箱样本',
            key: 'sandSamples',
            router: '/sandSamples',
        }],
    }, {
        name: '黑白名单',
        key: 'blackAndWhite',
        children: [{
            name: '黑名单',
            key: 'black',
            router: '/black',
        }, {
            name: '白名单',
            key: 'white',
            router: '/white',
        }, {
            name: '灰名单',
            key: 'gray',
            router: '/gray',
        }],
    },
];
