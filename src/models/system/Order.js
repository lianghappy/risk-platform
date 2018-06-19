import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'order',
    state: {
        pageNum: 1,
        pageSize: PAGE_SIZE,
        sysId: SYSID,
        orderList: [],
    },
    effects: {
        // 查询角色名称列表
        * getOrderList({ payload }, { call, put }) {
            // const { data } = payload;
            const response = yield call(post, API.orderList, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    orderList: response,
                    pageSize: PAGE_SIZE,
                    pageNum: payload.pageNum,
                },
            });
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
                if (filterPath(pathname) === '/order') {
                    const companyId = JSON.parse(sessionStorage.userInfo).user.company;
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '订单管理' }],
                    });
                    dispatch({
                        type: 'getOrderList',
                        payload: {
                            pageNum: 1,
                            pageSize: 10,
                            companyId,
                        },
                    });
                }
            });
        },
    },
};
