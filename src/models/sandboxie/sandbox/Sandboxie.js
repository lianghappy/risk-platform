import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';

export default {
    namespace: 'sandboxie',
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
    },
    reducers: {
        getPolicyListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/sandboxie') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['策略沙箱'],
                    });
                    dispatch({
                        type: 'getPolicyList',
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
