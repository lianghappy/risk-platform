import treeConvert from 'utils/treeConvert';
import { roles } from './common';

export const authss = (menus) => {
    const treedate = [];
    const lists = [];
    const main = [];
    if (menus) {
        menus.forEach((item) => {
            if (item.parentId === '') {
                main.push(item.id);
            }
        });
        main.forEach((item) => {
            treedate.push({
                name: item,
                id: treeConvert({
                    pId: 'parentId',
                    rootId: item,
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'id',
                    tName: 'name',
                }, menus),
            });
        });
        if (roles('R_M_system')) {
            const system = {
                name: '系统管理',
                key: 'system',
                children: [],
            };
            treedate.forEach((item) => {
                if (item.name === 'R_M_system') {
                    item.id.forEach((items) => {
                        switch (items.name) {
                        case '账号管理':
                            system.children.push({
                                name: '账号管理',
                                key: 'account',
                                router: '/account',
                            });
                            break;
                        case '角色管理':
                            system.children.push({
                                name: '角色管理',
                                key: 'role',
                                router: '/role',
                            });
                            break;
                        case '权限管理':
                            system.children.push({
                                name: '权限管理',
                                key: 'permission',
                                router: '/permission',
                            });
                            break;
                        default:
                            break;
                        }
                    });
                }
            });
            lists.push(system);
        }
        if (roles('R_M_application')) {
            const app = {
                name: '应用管理',
                key: 'application',
                children: [],
            };
            treedate.forEach((item) => {
                if (item.name === 'R_M_application') {
                    item.id.forEach((items) => {
                        switch (items.name) {
                        case '公司管理':
                            app.children.push({
                                name: '公司管理',
                                key: 'company',
                                router: '/company',
                            });
                            break;
                        case '应用管理':
                            app.children.push({
                                name: '应用管理',
                                key: 'app',
                                router: '/app',
                            });
                            break;
                        default:
                            break;
                        }
                    });
                }
            });
            lists.push(app);
        }
        if (roles('R_M_policy')) {
            const policy = {
                name: '决策引擎',
                key: 'policy',
                children: [],
            };
            treedate.forEach((item) => {
                if (item.name === 'R_M_policy') {
                    item.id.forEach((items) => {
                        switch (items.name) {
                        case '类别管理':
                            policy.children.push({
                                name: '类别管理',
                                key: 'categoryStru',
                                router: '/categoryStru',
                            });
                            break;
                        case '规则库管理':
                            policy.children.push({
                                name: '规则库管理',
                                key: 'rule',
                                router: '/rule',
                            });
                            break;
                        case '策略管理':
                            policy.children.push({
                                name: '策略管理',
                                key: 'policy',
                                router: '/policy',
                            });
                            break;
                        default:
                            break;
                        }
                    });
                }
            });
            lists.push(policy);
        }
        if (roles('R_M_sandboxie')) {
            const sandboxie = {
                name: '沙箱样本',
                key: 'sandboxie',
                children: [],
            };
            treedate.forEach((item) => {
                if (item.name === 'R_M_sandboxie') {
                    item.id.forEach((items) => {
                        switch (items.name) {
                        case '策略沙箱':
                            sandboxie.children.push({
                                name: '策略沙箱',
                                key: 'sandboxie',
                                router: '/sandboxie',
                            });
                            break;
                        case '实验样本':
                            sandboxie.children.push({
                                name: '实验样本',
                                key: 'samples',
                                router: '/samples',
                            });
                            break;
                        case '实验记录':
                            sandboxie.children.push({
                                name: '实验记录',
                                key: 'recordHistory',
                                router: '/recordHistory',
                            });
                            break;
                        case '沙箱样本':
                            sandboxie.children.push({
                                name: '沙箱样本',
                                key: 'sandSamples',
                                router: '/sandSamples',
                            });
                            break;
                        default:
                            break;
                        }
                    });
                }
            });
            lists.push(sandboxie);
        }
        if (roles('R_M_blackAndWhite')) {
            const black = {
                name: '黑白名单',
                key: 'blackAndWhite',
                children: [],
            };
            treedate.forEach((item) => {
                if (item.name === 'R_M_blackAndWhite') {
                    item.id.forEach((items) => {
                        switch (items.name) {
                        case '黑名单':
                            black.children.push({
                                name: '黑名单',
                                key: 'black',
                                router: '/black',
                            });
                            break;
                        case '白名单':
                            black.children.push({
                                name: '白名单',
                                key: 'white',
                                router: '/white',
                            });
                            break;
                        case '灰名单':
                            black.children.push({
                                name: '灰名单',
                                key: 'gray',
                                router: '/gray',
                            });
                            break;
                        default:
                            break;
                        }
                    });
                }
            });
            lists.push(black);
        }
    }
    return lists;
};

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
