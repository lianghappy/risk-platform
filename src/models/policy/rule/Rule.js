import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'rulePly',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
    },
    effects: {
        // 获取规则类别列表
        * getRuleList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getRules, payload, data);
            yield put({
                type: 'getRuleListSuc',
                payload: {
                    list: response,
                    sysId: SYSID,
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
                type: 'getChannelSuc',
                payload: {
                    typeList: response,
                    sysId: SYSID,
                },
            });
        },
    },
    reducers: {
        getRuleListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
        getChannelSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (filterPath(pathname) === '/rule') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '规则库管理' }],
                    });
                    dispatch({
                        type: 'getRuleList',
                        payload: {
                            sysId: SYSID,
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
