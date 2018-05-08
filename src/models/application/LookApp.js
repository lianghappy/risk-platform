import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import base64 from 'utils/base64';

export default {
    namespace: 'lookApp',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        listSign: [],
        listNoSign: [],
        appItem: [],
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
        // 品牌查询
        * queryAppDetail({ payload }, { call, put }) {
            const response = yield call(post, API.getCompanyList, payload);
            yield put({
                type: 'queryAppDetailSuc',
                payload: {
                    appItem: response,
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
                type: 'queryListNoSignSuc',
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
        queryListNoSignSuc(state, { payload }) {
            return { ...state, ...payload };
        },
        queryAppDetailSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                const path = pathname.split('/');
                if (path[1] === 'apps') {
                    const ids = base64.decode(path[2]);
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['应用管理', '查看应用'],
                    });
                    dispatch({
                        type: 'getAppDetailList',
                        payload: {
                            sysId: SYSID,
                            id: ids,
                        },
                    });
                    dispatch({
                        type: 'queryListSign',
                        payload: {
                            sysId: SYSID,
                            appId: ids,
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                        },
                    });
                    dispatch({
                        type: 'queryListNoSign',
                        payload: {
                            sysId: SYSID,
                            appId: ids,
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                        },
                    });
                    dispatch({
                        type: 'queryAppDetail',
                        payload: {
                            sysId: SYSID,
                            pageNum: 1,
                            pageSize: '999',
                        },
                    });
                }
            });
        },
    },
};
