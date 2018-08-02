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
                    getStage: response,
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
