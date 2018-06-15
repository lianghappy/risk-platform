import API from 'utils/api';
import { post } from 'utils/request';
import { PAGE_SIZE } from 'utils/constants';

export default {
    namespace: 'addWarningRule',
    state: {
        getPeopleList: [],
        pageNum: 1,
        pageSize: PAGE_SIZE,
        sleuthTargets: [],
        strategys: [],
    },
    effects: {
        * getSelect({ payload }, { call, put }) {
            const response = yield call(post, API.warningZB, payload);
            console.log(response.sleuthTargets);
            yield put({
                type: 'querySuc',
                payload: {
                    sleuthTargets: response.sleuthTargets,
                    strategys: response.strategys,
                }
            });
        },
        * getPeople({ payload }, { call, put }) {
            const response = yield call(post, API.getNoPeoples, payload);
            yield put({
                type: 'querySuc',
                getPeopleList: response,
                pageSize: PAGE_SIZE,
                pageNum: payload.pageNum,
            });
        },
        * add({ payload }, { call }) {
            const { resolve } = payload;
            yield call(post, API.addWarnRule, payload);
            yield call(resolve);
        }
    },
    reducers: {
        querySuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/addWarningRule') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '报警规则' }, { name: '新增报警规则' }],
                    });
                    dispatch({
                        type: 'common/setSide',
                        flag: true,
                    });
                    const companyId = JSON.parse(sessionStorage.userInfo).user.company;
                    const appId = '3';
                    const productId = '22';
                    dispatch({
                        type: 'getPeople',
                        payload: {
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                            companyId,
                            appId,
                            productId,
                        }
                    });
                    dispatch({
                        type: 'getSelect',
                        payload: {
                            companyId,
                        }
                    });
                }
            });
        },
    },
};
