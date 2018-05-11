import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';

export default {
    namespace: 'sandSamples',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
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
        // 删除
        * queryDetail({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.detailSandSamples, data);
            yield call(resolve);
        },
    },
    reducers: {
        getSandSamplesListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/sandSamples') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['策略沙箱', '沙箱样本'],
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
