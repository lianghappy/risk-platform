import API from 'utils/api';
import { post } from 'utils/request';
import { PAGE_SIZE } from 'utils/constants';

export default {
    namespace: 'warningPeople',
    state: {
        warningList: [],
        pageNum: 1,
        pageSize: PAGE_SIZE,
    },
    effects: {
        * getWarningList({ payload }, { call, put }) {
            const response = yield call(post, API.warningPeople, payload);
            yield put({
                type: 'querySuc',
                warningList: response,
                pageSize: PAGE_SIZE,
                pageNum: payload.pageNum,
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
                if (pathname === '/warningPeople') {
                    dispatch({
                        type: 'getWarningList',
                        payload: {
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                        }
                    });
                }
            });
        },
    },
};
