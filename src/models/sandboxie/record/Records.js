import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';

export default {
    namespace: 'recordHistory',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        download: {},
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
            const response = yield call(post, API.download, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    download: response,
                    sysId: SYSID,
                },
            });
        },
        // * download({ payload }, { call }) {
        //     const { data, resolve } = payload;
        //     yield call(post, API.download, data);
        //     yield call(resolve);
        // },
    },
    reducers: {
        querySuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/recordHistory') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['决策引擎', '规则库管理'],
                    });
                    dispatch({
                        type: 'recordHistoryList',
                        payload: {
                            sysId: SYSID,
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                        },
                    });
                }
            });
        },
    },
};
