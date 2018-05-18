import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';

export default {
    namespace: 'app',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        appItem: [],
    },
    effects: {
        // 获取规则类别列表
        * getAppList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getAppList, payload, data);
            yield put({
                type: 'getAppListSuc',
                payload: {
                    list: response,
                    sysId: SYSID,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
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
        // 删除
        * del({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.appDel, data);
            yield call(resolve);
        },
        // 增加公司
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addApp, data);
            yield call(resolve);
        },
        // 更新公司
        * update({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.appUpdate, data);
            yield call(resolve);
        },
    },
    reducers: {
        getAppListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
        queryAppDetailSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/app') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['应用管理'],
                    });
                    dispatch({
                        type: 'getAppList',
                        payload: {
                            sysId: SYSID,
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
