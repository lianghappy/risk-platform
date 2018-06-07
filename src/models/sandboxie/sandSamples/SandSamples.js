import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'sandSamples',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        details: [],
        selects: {},
    },
    effects: {
        // 获取规则类别列表
        * getSandSamplesList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getSandSamples, payload, data);
            yield put({
                type: 'getSandSamplesListSuc',
                payload: {
                    list: response,
                    sysId: SYSID,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 删除
        * del({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delSandSamples, data);
            yield call(resolve);
        },
        // 明细
        * queryDetail({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.detailSandSamples, data);
            yield put({
                type: 'queryDetailSuc',
                payload: {
                    details: response,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 样本筛选条件
        * querySelect({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.selectSandSamples, data);
            yield put({
                type: 'querySelectSuc',
                payload: {
                    selects: response,
                    sysId: SYSID,
                },
            });
        },
    },
    reducers: {
        getSandSamplesListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
        querySelectSuc(state, { payload }) {
            return { ...state, ...payload };
        },
        queryDetailSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (filterPath(pathname) === '/sandSamples') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '沙箱样本' }],
                    });
                    dispatch({
                        type: 'getSandSamplesList',
                        payload: {
                            sysId: SYSID,
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                            type: 1,
                        },
                    });
                }
            });
        },
    },
};
