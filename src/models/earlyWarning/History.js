import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'history',
    state: {
        list: [],
        pageNum: 1,
        pageSize: PAGE_SIZE,
        sysId: SYSID,
    },
    effects: {
        * getHistoryList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.historyPolice, payload, data);
            yield put({
                type: 'querySrc',
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
        querySrc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (filterPath(pathname) === '/historyPolice') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '报警历史' }],
                    });
                    const companyId = JSON.parse(sessionStorage.userInfo).user.company;
                    dispatch({
                        type: 'getHistoryList',
                        payload: {
                            companyId,
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                        },
                    });
                }
            });
        },
    },
};
