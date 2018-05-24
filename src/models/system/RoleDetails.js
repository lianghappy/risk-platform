import { post } from 'utils/request';
import API from 'utils/api';
import base64 from 'utils/base64';
import treeConvert from 'utils/treeConvert';
import { SYSID } from 'utils/constants';

export default {
    namespace: 'tree',
    state: {
        list: [],
        sysId: 'risk',
        details: [],
    },
    effects: {
        * getTreeList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getMenuTreeList, payload, data);
            const treeDatas = [{
                title: '系统管理',
                key: 'M_system',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'M_system',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }, {
                title: '应用管理',
                key: 'M_application',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'M_application',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }, {
                title: '决策引擎',
                key: 'M_policy',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'M_policy',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }, {
                title: '策略沙箱',
                key: 'M_sandboxie',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'M_sandboxie',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }, {
                title: '黑白名单',
                key: 'M_blackAndWhite',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'M_blackAndWhite',
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
                },
            });
        },
        * getDetails({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getMenuTreeDetails, payload, data);
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
                },
            });
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
                const path = pathname.split('/');
                if (path[2] === 'detailRole') {
                    const id = base64.decode(path[3]);
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['角色管理', '角色详情'],
                    });
                    dispatch({
                        type: 'getTreeList',
                        payload: {
                            sysId: SYSID,
                        },
                    });
                    dispatch({
                        type: 'getDetails',
                        payload: {
                            sysId: SYSID,
                            id,
                        },
                    });
                }
            });
        },
    },
};