import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'recordSand',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        download: {},
        downCount: {},
    },
    effects: {
        // 获取规则类别列表
        * recordHistoryList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.recordHistoryList, payload, data);
            yield put({
                type: 'querySuc',
                payload: {
                    list: response,
                    sysId: SYSID,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        * download({ payload }, { call, put }) {
            const { data, resolve } = payload;
            yield call(post, API.download, data);
            const response = yield call(post, API.download, data);
            yield put({
                type: 'querySuc',
                payload: {
                    download: response,
                    sysId: SYSID,
                },
            });
            yield call(resolve);
        },
        * downCount({ payload }, { call, put }) {
            const { data, resolve } = payload;
            yield call(post, API.downCount, data);
            const response = yield call(post, API.downCount, data);
            yield put({
                type: 'querySuc',
                payload: {
                    downCount: response,
                    sysId: SYSID,
                },
            });
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
                if (filterPath(pathname) === '/recordHistory') {
                    const companyId = JSON.parse(sessionStorage.userInfo).user.company;
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '实验记录' }],
                    });
                    dispatch({
                        type: 'common/setSide',
                        flag: false,
                    });
                    dispatch({
                        type: 'recordHistoryList',
                        payload: {
                            sysId: SYSID,
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                            companyId,
                        },
                    });
                }
            });
        },
    },
};
