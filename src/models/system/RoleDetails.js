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
            const treeDatas = treeConvert({
                pId: 'pid',
                tId: 'key',
                tName: 'title',
            }, response);
            /* [{
                title: '监控中心',
                key: 'R_warn',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'R_warn',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }, {
                title: '管理中心',
                key: 'R_system',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'R_system',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }, {
                title: '管理中心',
                key: 'R_system',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'R_system',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }, {
                title: '应用中心',
                key: 'R_apps',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'R_apps',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }, {
                title: '策略中心',
                key: 'R_policy',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'R_policy',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }, {
                title: '实验中心',
                key: 'R_policy',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'R_policy',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }, {
                title: '策略中心',
                key: 'R_policy',
                children: treeConvert({
                    pId: 'pid',
                    rootId: 'R_policy',
                    id: 'id', // 原始数据Id
                    name: 'name',
                    tId: 'key',
                    tName: 'title',
                }, response),
            }]; */
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
                        type: 'common/setSide',
                        payload: true,
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
