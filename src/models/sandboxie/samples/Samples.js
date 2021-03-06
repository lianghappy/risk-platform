import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'samples',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        details: [],
        selects: {},
        category: [],
        _pageNum: 1,
    },
    effects: {
        // 获取规则类别列表
        * getSamplesList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.experList, payload, data);
            yield put({
                type: 'getSamplesListSuc',
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
            const response = yield call(post, API.detailSandSamples, payload);
            yield put({
                type: 'getSamplesListSuc',
                payload: {
                    details: response,
                    _pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 样本筛选条件
        * querySelect({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.selectSandSamples, data);
            yield put({
                type: 'getSamplesListSuc',
                payload: {
                    selects: response,
                    sysId: SYSID,
                },
            });
        },
        // 获取来源
        * getType({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getBlackType, payload, data);
            yield put({
                type: 'getSamplesListSuc',
                payload: {
                    category: response,
                },
            });
        },
    },
    reducers: {
        getSamplesListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (filterPath(pathname) === '/samples') {
                    const companyId = JSON.parse(sessionStorage.userInfo).user.company;
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '实验样本' }],
                    });
                    dispatch({
                        type: 'common/setSide',
                        flag: false,
                    });
                    dispatch({
                        type: 'getSamplesList',
                        payload: {
                            sysId: SYSID,
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                            companyId,
                        },
                    });
                    dispatch({
                        type: 'getType',
                        payload: {
                            sysId: SYSID,
                            type: 'sampleSource',
                        },
                    });
                }
            });
        },
    },
};
