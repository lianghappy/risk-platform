import API from 'utils/api';
import { post } from 'utils/request';
import { PAGE_SIZE } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'warningRule',
    state: {
        warningRule: [],
        pageNum: 1,
        pageSize: PAGE_SIZE,
        sleuthTargets: [],
        strategys: [],
    },
    effects: {
        * getWarningRuleList({ payload }, { call, put }) {
            const response = yield call(post, API.warningRuleList, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    warningRule: response,
                    pageSize: PAGE_SIZE,
                    pageNum: payload.pageNum,
                },
            });
        },
        * getSelect({ payload }, { call, put }) {
            const response = yield call(post, API.warningZB, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    sleuthTargets: response.sleuthTargets,
                    strategys: response.strategys,
                }
            });
        },
        * del({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delWarnRule, data);
            yield call(resolve);
        },
        * updateStatus({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.updateStatus, data);
            yield call(resolve);
        },
        // 初始化查询
        * firstQuery({ payload }, { put, select }) {
            const { type } = payload;
            const _type = {
                rule: 'getWarningRuleList',
            }[type];
            const companyId = JSON.parse(sessionStorage.userInfo).user.company;
            const appId = JSON.parse(sessionStorage.app).id;
            const productId = JSON.parse(sessionStorage.product).id;
            const searchFields = yield select(state => state.common.searchFields[type]);
            yield put({
                type: _type,
                payload: {
                    ...searchFields,
                    pageNum: searchFields.pageNum ? searchFields.pageNum : 1,
                    pageSize: PAGE_SIZE,
                    companyId,
                    appId,
                    productId,
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
                if (filterPath(pathname) === '/warningRule') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '报警规则' }],
                    });
                    dispatch({
                        type: 'common/setSide',
                        flag: false,
                    });
                    const type = 'rule';
                    const companyId = JSON.parse(sessionStorage.userInfo).user.company;
                    dispatch({
                        type: 'firstQuery',
                        payload: {
                            pageNum: 1,
                            pageSize: 10,
                            type,
                        },
                    });
                    dispatch({
                        type: 'getSelect',
                        payload: {
                            companyId,
                            isEnable: 1,
                        }
                    });
                }
            });
        },
    },
};
