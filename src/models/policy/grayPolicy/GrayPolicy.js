import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'grayPolicy',
    state: {
        list: [],
        pageNum: 1,
        pageSize: PAGE_SIZE,
        typeList: [],
        grayPolicyList: [],
    },
    effects: {
        // 查询
        * getGrayPolicyList({ payload }, { call, put }) {
            // const { data } = payload;
            const response = yield call(post, API.getGrayPolicyList, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    grayPolicyList: response,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 获取来源的数据
        * getChannel({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getChannel, payload, data);
            yield put({
                type: 'querySuc',
                payload: {
                    typeList: response,
                    sysId: SYSID,
                },
            });
        },
        // 增加策略
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.grayPolicyAdd, data);
            yield call(resolve);
        },
        * update({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.grayPolicyUpdate, data);
            yield call(resolve);
        },
        * del({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.grayPolicyDel, data);
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
                if (filterPath(pathname) === '/thirdPartyManage') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '灰度策略' }],
                    });
                    dispatch({
                        type: 'getGrayPolicyList',
                        payload: {
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                        },
                    });
                    dispatch({
                        type: 'getChannel',
                        payload: {
                            type: 'rule',
                        },
                    });
                }
            });
        },
    },
};
