import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';

export default {
    namespace: 'common',
    state: {
        typeList: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
    },
    effects: {
        // 获取来源的数据
        * getChannel({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getChannel, payload, data);
            yield put({
                type: 'getChannelSuc',
                payload: {
                    typeList: response,
                    sysId: SYSID,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
    },
    reducers: {
        getChannelSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/linkRuler') {
                    dispatch({
                        type: 'getChannel',
                        payload: {
                            sysId: SYSID,
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                            type: 'rule',
                        },
                    });
                }
            });
        },
    },
};
