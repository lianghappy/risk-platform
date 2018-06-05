import { post } from 'utils/request';
import API from 'utils/api';
import { SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

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
            yield put({
                type: 'getTreeListSuc',
                payload: {
                    list: response,
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
                        payload: ['角色管理', '新增角色'],
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
