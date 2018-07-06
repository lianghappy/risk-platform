import { post } from 'utils/request';
import API from 'utils/api';
// import base64 from 'utils/base64';
import treeConvert from 'utils/treeConvert';
import { SYSID } from 'utils/constants';
import { filterPath, setPath } from 'utils/path';

export default {
    namespace: 'detailTree',
    state: {
        list: [],
        sysId: 'risk',
        details: {},
        datas: [],
    },
    effects: {
        * getTreeList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getMenuTreeList, payload, data);
            const treeDatas = [{
                title: '系统管理',
                key: 'R_M_system',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'R_M_system',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }, {
                title: '应用管理',
                key: 'R_M_application',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'R_M_application',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }, {
                title: '决策引擎',
                key: 'R_M_policy',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'R_M_policy',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }, {
                title: '策略沙箱',
                key: 'R_M_sandboxie',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'R_M_sandboxie',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }, {
                title: '黑白名单',
                key: 'R_M_blackAndWhite',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'R_M_blackAndWhite',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }];
            yield put({
                type: 'getTreeListSuc',
                payload: {
                    list: treeDatas,
                    sysId: payload.sysId,
                    datas: response,
                },
            });
        },
        * getDetails({ payload }, { call, put }) {
            const { resolve } = payload;
            const response = yield call(post, API.getMenuTreeDetails, payload);
            const del = {
                type: response.type,
                id: response.id,
                menus: [],
                name: response.name,
            };
            response.menus.forEach((item) => {
                if (item.checked) {
                    del.menus.push(item.id);
                }
            });
            yield put({
                type: 'getTreeListSuc',
                payload: {
                    details: del,
                    sysId: payload.sysId,
                    menus: del.menus,
                },
            });
            yield call(resolve);
        },
        // 增加
        * update({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.updateRole, data);
            yield call(resolve);
        },
    },
    reducers: {
        getTreeListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                const path = filterPath(pathname).split('/');
                if (path[1] === 'detailRole') {
                    // const id = base64.decode(path[2]);
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '角色管理', link: setPath('/role') }, { name: '角色详情' }],
                    });
                    dispatch({
                        type: 'getTreeList',
                        payload: {
                            sysId: SYSID,
                        },
                    });
                    /* dispatch({
                        type: 'getDetails',
                        payload: {
                            sysId: SYSID,
                            id,
                        },
                    }); */
                }
            });
        },
    },
};
