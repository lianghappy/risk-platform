import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';

export default {
    namespace: 'lookApp',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        listSign: [],
        listNoSign: [],
    },
    effects: {
        // 根据id查询App
        * getAppDetailList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getAppDetail, payload, data);
            yield put({
                type: 'getAppDetailListSuc',
                payload: {
                    list: response,
                    sysId: SYSID,
                },
            });
        },
        // 查询已选产品
        * queryListSign({ payload }, { call, put }) {
            const response = yield call(post, API.listSign, payload);
            yield put({
                type: 'queryListSignSuc',
                payload: {
                    listSign: response,
                    sysId: SYSID,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 查询未选产品
        * queryListNoSign({ payload }, { call, put }) {
            const response = yield call(post, API.listNoSign, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    listNoSign: response,
                    sysId: SYSID,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 单个删除
        * del({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delPro, data);
            yield call(resolve);
        },
        // 单个增加
        * create({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.createPro, data);
            yield call(resolve);
        },
        // 批量添加
        * listCreate({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.listCreatePro, data);
            yield call(resolve);
        },
        // 批量删除
        * listDel({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.listDeletePro, data);
            yield call(resolve);
        },
    },
    reducers: {
        getAppDetailListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
        queryListSignSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/lookApp') {
                    dispatch({
                        type: 'getAppDetailList',
                        payload: {
                            sysId: SYSID,
                        },
                    });
                    dispatch({
                        type: 'queryListSign',
                        payload: {
                            sysId: SYSID,
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                        },
                    });
                }
            });
        },
    },
};
