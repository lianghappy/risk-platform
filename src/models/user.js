import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE } from 'utils/constants';

export default {
    namespace: 'user',
    state: {
        list: [],
        pageNum: 1,
    },
    effects: {
        * resetPwd({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.userResetPwd, data);
            resolve();
        },
        * getUserList({ payload }, { call, put }) {
            const response = yield call(post, API.userList, payload);
            yield put({
                type: 'getUserListSuc',
                payload: {
                    list: response,
                    pageNum: payload.pageNum,
                },
            });
        },
    },
    reducers: {
        getUserListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/user') {
                    dispatch({
                        type: 'getUserList',
                        payload: {
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                        },
                    });
                }
            });
        },
    },
};
