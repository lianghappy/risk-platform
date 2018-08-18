import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'statistical',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        NormHitChannal: {},
        getStage: [],
        dailyRecord: [],
        portChannal: [],
        dateSources: [],
        allPortChannal: [],
    },
    effects: {
        // 获取策略
        * getReportList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getReportList, payload, data);
            yield put({
                type: 'querySuc',
                payload: {
                    list: response,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 获取策略
        * getSelect({ payload }, { call, put }) {
            const response = yield call(post, API.NormHitChannal, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    NormHitChannal: response,
                },
            });
        },
        // 获取阶段
        * getStage({ payload }, { call, put }) {
            const response = yield call(post, API.normHit, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    getStage: response.stages,
                    dateSources: response.dateSources,
                },
            });
        },
        // 获取三方数据源的下拉菜单
        * portChannal({ payload }, { call, put }) {
            const response = yield call(post, API.portChannal, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    portChannal: response,
                },
            });
        },
        // 获取第三方数据
        * dailyRecord({ payload }, { call, put }) {
            const response = yield call(post, API.dailyRecord, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    dailyRecord: response,
                },
            });
        },
        * allPortChannal({ payload }, { call, put }) {
            const response = yield call(post, API.allPortChannal, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    allPortChannal: response,
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
                if (filterPath(pathname) === '/statistical') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '统计报表' }],
                    });
                    dispatch({
                        type: 'common/setSide',
                        flag: false,
                    });
                }
            });
        },
    },
};
