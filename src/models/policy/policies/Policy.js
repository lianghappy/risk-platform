import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'policy',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
    },
    effects: {
        // 获取策略
        * getPolicyList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getPolicyList, payload, data);
            yield put({
                type: 'getPolicyListSuc',
                payload: {
                    list: response,
                    sysId: SYSID,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 增加策略
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addPolicy, data);
            yield call(resolve);
        },
        * del({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delPolicy, data);
            yield call(resolve);
        },
        // 更新策略
        * update({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.updatePolicy, data);
            yield call(resolve);
        },
        // 更新策略
        * clone({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.clonePolicy, data);
            yield call(resolve);
        },
        // 更新上架状态
        * updataEnable({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.updataEnable, data);
            yield call(resolve);
        },
        // 初始化查询
        * firstQuery({ payload }, { put, select }) {
            const { type } = payload;
            const _type = {
                policy: 'getPolicyList',
            }[type];
            const companyId = JSON.parse(sessionStorage.userInfo).user.company;
            const searchFields = yield select(state => state.common.searchFields[type]);
            yield put({
                type: _type,
                payload: {
                    ...searchFields,
                    pageNum: searchFields.pageNum ? searchFields.pageNum : 1,
                    pageSize: PAGE_SIZE,
                    companyId,
                },
            });
        },
    },
    reducers: {
        getPolicyListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (filterPath(pathname) === '/policy') {
                    const type = 'policy';
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '策略管理' }],
                    });
                    dispatch({
                        type: 'common/setSide',
                        flag: false,
                    });
                    dispatch({
                        type: 'firstQuery',
                        payload: {
                            pageNum: 1,
                            pageSize: 10,
                            type,
                        },
                    });
                }
            });
        },
    },
};
