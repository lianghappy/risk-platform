import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';

export default {
    namespace: 'experiment',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
    },
    effects: {
        // 增加策略
        * start({ payload }, { call, put }) {
            const response = yield call(post, API.startExpe, payload);
            yield put({
                type: 'getStrategyListSuc',
                payload: {
                    list: response,
                    sysId: SYSID,
                },
            });
        },
    },
    reducers: {
        startSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                const path = pathname.split('/');
                if (path[1] === '/experiment') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['策略沙箱', '开始实验'],
                    });
                }
            });
        },
    },
};
