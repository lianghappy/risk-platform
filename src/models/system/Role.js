import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'role',
    state: {
        list: [],
        pageNum: 1,
        pageSize: PAGE_SIZE,
        sysId: SYSID,
    },
    effects: {
        * getRoleList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getRoleList, payload, data);
            yield put({
                type: 'getRoleListSuc',
                payload: {
                    list: response,
                    pageNum: payload.pageNum,
                    pageSize: payload.pageSize,
                    sysId: payload.sysId,
                },
            });
        },
        // 删除
        * del({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delRole, data);
            yield call(resolve);
        },
    },
    reducers: {
        getRoleListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (filterPath(pathname) === '/role') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['角色管理'],
                    });
                    dispatch({
                        type: 'getRoleList',
                        payload: {
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                            sysId: SYSID,
                        },
                    });
                }
            });
        },
    },
};
