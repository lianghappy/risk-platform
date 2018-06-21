import API from 'utils/api';
import { post } from 'utils/request';
import { PAGE_SIZE } from 'utils/constants';
import { filterPath, setPath } from 'utils/path';

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
            const mockData = [];
            response.forEach(item => {
                const data = {
                    key: item.sleuthTeamId,
                    title: item.sleuthTeamName,
                    description: item.sleuthTeamName,
                };
                mockData.push(data);
            });
            yield put({
                type: 'querySuc',
                payload: {
                    getPeopleList: mockData,
                    pageSize: PAGE_SIZE,
                    pageNum: payload.pageNum,
                }
            });
        },
        * add({ payload }, { call }) {
            // const urls = 'http://192.168.10.37:21095/api/risk/manager/monitor/sleuthConfig/create/v1';
            const { data, resolve } = payload;
            yield call(post, API.addWarnRule, data);
            // yield call(post, urls, data);
            yield call(resolve);
        },
        * update({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.updateWarnRule, data);
            yield call(resolve);
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
                if (filterPath(pathname) === '/addWarningRule') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '报警规则', link: setPath('/warningRule') }, { name: '新增报警规则' }],
                    });
                    dispatch({
                        type: 'common/setSide',
                        flag: false,
                    });
                    const companyId = JSON.parse(sessionStorage.userInfo).user.company;
                    const appId = JSON.parse(sessionStorage.app).id;
                    const productId = JSON.parse(sessionStorage.product).id;
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
