import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';

export default {
    namespace: 'black',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        category: [],
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
                    category: response,
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
                if (pathname === '/black') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['黑白名单', '黑名单'],
                    });
                    dispatch({
                        type: 'getBlackList',
                        payload: {
                            sysId: SYSID,
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                            type: 0,
                        },
                    });
                    dispatch({
                        type: 'getType',
                        payload: {
                            type: 'rule',
                        },
                    });
                }
            });
        },
    },
};