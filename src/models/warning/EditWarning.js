import API from 'utils/api';
import { post } from 'utils/request';
import { PAGE_SIZE } from 'utils/constants';
import { filterPath, setPath } from 'utils/path';
import base64 from 'utils/base64';

export default {
    namespace: 'EditWarningRule',
    state: {
        getPeopleList: [],
        pageNum: 1,
        pageSize: PAGE_SIZE,
        sleuthTargets: [],
        strategys: [],
        record: {},
    },
    effects: {
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
        * getSingleRule({ payload }, { call, put }) {
            const response = yield call(post, API.getSingleRule, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    record: response,
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
                const path = filterPath(pathname).split('/');
                if (path[1] === 'editWarningRule') {
                    const id = base64.decode(path[2]);
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [
                            {
                                name: '报警规则',
                                link: setPath('/warningRule')
                            },
                            {
                                name: '编辑报警规则',
                            }
                        ],
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
                    dispatch({
                        type: 'getSingleRule',
                        payload: {
                            id,
                        }
                    });
                }
            });
        },
    },
};
