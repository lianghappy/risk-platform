import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';

export default {
    namespace: 'account',
    state: {
        list: [],
        pageNum: 1,
        pageSize: PAGE_SIZE,
        sysId: SYSID,
        roleNameList: [],
    },
    effects: {
        // 查询角色名称列表
        * getRoleNameList(action, { call, put }) {
            const response = yield call(post, API.roleNameList, {
                pageSize: 9999,
                pageNum: 1,
                sysId: SYSID,
            });
            yield put({
                type: 'querySuc',
                payload: {
                    roleNameList: response,
                },
            });
        },
        // 查询账号管理
        * queryAccountList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getAccountList, payload, data);
            yield put({
                type: 'querySuc',
                payload: {
                    list: response,
                    pageNum: payload.pageNum,
                    pageSize: payload.pageSize,
                    sysId: payload.sysId,
                },
            });
        },
    },
    reducers: {
        querySuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/account') {
                    dispatch({
                        type: 'queryAccountList',
                        payload: {
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                            sysId: SYSID,
                        },
                    });
                    dispatch({
                        type: 'getRoleNameList',
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
