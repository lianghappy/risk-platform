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
    },
    effects: {
        * getRoleNameList({ payload }, { call, put }) {
            const response = yield call(post, API.roleNameList, payload);
            yield put({
                type: 'getRoleNameListSuc',
                payload: {
                    list: response,
                    pageNum: payload.pageNum,
                    pageSize: '100',
                },
            });
        },
        * getAccountList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getAccountList, payload, data);
            yield put({
                type: 'getAccountListSuc',
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
        getRoleNameListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
        getAccountListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/systemManage') {
                    dispatch({
                        type: 'getAccountList',
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
