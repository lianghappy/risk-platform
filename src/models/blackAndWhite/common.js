import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';

export default {
    namespace: 'bAWCommon',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        rosterType: [],
        rosterChannel: [],
        getBAW: [],
    },
    effects: {
        // 获取来源
        * getType({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getBlackType, payload, data);
            yield put({
                type: 'getTypeSuc',
                payload: {
                    rosterType: response,
                },
            });
        },
        // 获取来源
        * rosterChannel({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getBlackType, payload, data);
            yield put({
                type: 'getTypeSuc',
                payload: {
                    rosterChannel: response,
                },
            });
        },
        // 增加
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addBlack, data);
            yield call(resolve);
        },
        // 更新
        * update({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.updateBlack, data);
            yield call(resolve);
        },
        // 删除
        * del({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delBlack, data);
            yield call(resolve);
        },
        * getBAW({ payload }, { call, put }) {
            const { resolve } = payload;
            const response = yield call(post, API.getBAW, payload);
            yield put({
                type: 'getTypeSuc',
                payload: {
                    getBAW: response,
                }
            });
            yield call(resolve);
        }
    },
    reducers: {
        getBlackListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
        getTypeSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
};
