import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';

export default {
    namespace: 'samples',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
    },
    effects: {
        // 获取规则类别列表
        * getSamplesList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getSamples, payload, data);
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
    },
    reducers: {
        getSamplesListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/samples') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['沙箱样本'],
                    });
                    dispatch({
                        type: 'getSamplesList',
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
