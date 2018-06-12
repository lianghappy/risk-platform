import API from 'utils/api';
import { post } from 'utils/request';
import { PAGE_SIZE } from 'utils/constants';

export default {
    namespace: 'warningRule',
    state: {
        warningRule: [],
        pageNum: 1,
        pageSize: PAGE_SIZE,
    },
    effects: {
        * getWarningRuleList({ payload }, { call, put }) {
            const response = yield call(post, API.warningRuleList, payload);
            yield put({
                type: 'querySuc',
                warningRule: response,
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
                if (pathname === '/warningRule') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '报警规则' }],
                    });
                    const companyId = JSON.parse(sessionStorage.userInfo).user.company;
                    const appId = '3';
                    const productId = '22';
                    dispatch({
                        type: 'getWarningRuleList',
                        payload: {
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                            companyId,
                            appId,
                            productId,
                        }
                    });
                }
            });
        },
    },
};
