import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';

export default {
    namespace: 'account',
    state: {
        list: [],
        pageNum: 1,
        pageSize: PAGE_SIZE,
        sysId: SYSID,
        roleNameList: [],
    },
    effects: {
        // 查询角色名称列表
        * getRoleNameList(action, { call, put }) {
            const response = yield call(post, API.roleNameList, {
                pageSize: 9999,
                pageNum: 1,
                sysId: SYSID,
            });
            yield put({
                type: 'querySuc',
                payload: {
                    roleNameList: response,
                },
            });
        },
        // 查询账号管理
        * queryAccountList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getAccountList, payload, data);
            yield put({
                type: 'querySuc',
                payload: {
                    list: response,
                    pageNum: payload.pageNum,
                    pageSize: payload.pageSize,
                    sysId: payload.sysId,
                },
            });
        },
        // 增加策略
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addAccount, data);
            yield call(resolve);
        },
        // 更新策略
        * update({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.updateAccount, data);
            yield call(resolve);
        },
        // 删除
        * del({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delAccount, data);
            yield call(resolve);
        },
    },
    reducers: {
        querySuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/account') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['账号管理'],
                    });
                    dispatch({
                        type: 'queryAccountList',
                        payload: {
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                            sysId: SYSID,
                        },
                    });
                    dispatch({
                        type: 'getRoleNameList',
                        payload: {
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                            sysId: SYSID,
                        },
                    });
                }
            });
        },
    },
};
