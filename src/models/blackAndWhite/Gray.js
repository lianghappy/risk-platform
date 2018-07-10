import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'gray',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        rosterType: [],
        rosterChannel: [],
    },
    effects: {
        // 获取规则类别列表
        * getBlackList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getBlack, payload, data);
            yield put({
                type: 'getBlackListSuc',
                payload: {
                    list: response,
                    sysId: SYSID,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
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
        // 增加策略
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addBlack, data);
            yield call(resolve);
        },
        // 更新策略
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
        * getBAW({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.getBAW, data);
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
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (filterPath(pathname) === '/black') {
                    dispatch({
                        type: 'getBlackList',
                        payload: {
                            sysId: SYSID,
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                            type: 2,
                        },
                    });
                    dispatch({
                        type: 'getType',
                        payload: {
                            type: 'rosterType',
                        },
                    });
                    dispatch({
                        type: 'rosterChannel',
                        payload: {
                            type: 'rosterChannel',
                        },
                    });
                }
            });
        },
    },
};
