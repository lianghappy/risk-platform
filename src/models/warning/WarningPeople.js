import API from 'utils/api';
import { post } from 'utils/request';
import { PAGE_SIZE } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'warningPeople',
    state: {
        warningList: [],
        pageNum: 1,
        pageSize: PAGE_SIZE,
        warningTeam: [],
    },
    effects: {
        * getWarningList({ payload }, { call, put }) {
            const response = yield call(post, API.warningPeople, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    warningList: response,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        * getTeam({ payload }, { call, put }) {
            const response = yield call(post, API.warningTeamList, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    warningTeam: response,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 增加
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addPeople, data);
            yield call(resolve);
        },
        * updata({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.updataPeople, data);
            yield call(resolve);
        },
        * del({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delPeople, data);
            yield call(resolve);
        },
        * dels({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delsPeople, data);
            yield call(resolve);
        },
        // 获取 验证码
        * getCode({ payload }, { call }) {
            const { resolve } = payload;
            yield call(post, API.getCode, payload);
            yield call(resolve);
        },
        // 增加收件组
        * addTeam({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addTeam, data);
            yield call(resolve);
        },
        * updataTeam({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.updataTeam, data);
            yield call(resolve);
        },
        * delTeam({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delTeam, data);
            yield call(resolve);
        },
        * delTeamPeople({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delTeamPeople, data);
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
                if (filterPath(pathname) === '/warningPeople') {
                    const companyId = JSON.parse(sessionStorage.userInfo).user.company;
                    dispatch({
                        type: 'common/setSide',
                        flag: false,
                    });
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '报警对象' }],
                    });
                    dispatch({
                        type: 'getWarningList',
                        payload: {
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                            companyId,
                        }
                    });
                    dispatch({
                        type: 'getTeam',
                        payload: {
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                            companyId,
                        }
                    });
                }
            });
        },
    },
};
