import { post } from 'utils/request';
import API from 'utils/api';
import { SYSID } from 'utils/constants';
import treeConvert from 'utils/treeConvert';
import { filterPath, setPath } from 'utils/path';

export default {
    namespace: 'tree',
    state: {
        list: [],
        sysId: 'risk',
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
                },
            });
        },
        // 增加
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addRole, data);
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
                if (filterPath(pathname) === '/role/addRole') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '角色管理', link: setPath('/role') }, { name: '新增角色' }],
                    });
                    dispatch({
                        type: 'getTreeList',
                        payload: {
                            sysId: SYSID,
                        },
                    });
                }
            });
        },
    },
};
