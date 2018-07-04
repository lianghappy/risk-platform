import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'thirdParty',
    state: {
        list: [],
        pageNum: 1,
        pageSize: PAGE_SIZE,
    },
    effects: {
        // 查询
        * getThirdParty({ payload }, { call, put }) {
            // const { data } = payload;
            const response = yield call(post, API.getThirdPartyList, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    list: response,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 增加策略
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addAccount, data);
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
                        payload: [{ name: '第三方产品' }],
                    });
                    dispatch({
                        type: 'getThirdParty',
                        payload: {
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                        },
                    });
                }
            });
        },
    },
};
