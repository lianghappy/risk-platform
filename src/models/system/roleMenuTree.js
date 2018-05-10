import { post } from 'utils/request';
import API from 'utils/api';
import { SYSID } from 'utils/constants';

export default {
    namespace: 'tree',
    state: {
        list: [],
        sysId: 'merchant',
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
    },
    reducers: {
        getTreeListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/role/addRole') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['系统管理', '角色管理', '新增角色'],
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
