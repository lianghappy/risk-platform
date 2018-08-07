import { post } from 'utils/request';
import API from 'utils/api';
// import { PAGE_SIZE } from 'utils/constants';

export default {
    namespace: 'warnCommon',
    state: {
        getAllType: [],
    },
    effects: {
        * getAllType({ payload }, { call, put }) {
            const response = yield call(post, API.getBlackType, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    getAllType: response,
                },
            });
        },
    },
    reducers: {
        querySuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
};
