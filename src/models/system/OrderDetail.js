import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath, setPath } from 'utils/path';
import base64 from 'utils/base64';

export default {
    namespace: 'orderDetail',
    state: {
        pageNum: 1,
        pageSize: PAGE_SIZE,
        sysId: SYSID,
        orderBasic: [],
        orderList: [],
        getReport: [],
        getReportList: [],

    },
    effects: {
        // 订单基本信息
        * getOrderBasic({ payload }, { call, put }) {
            // const { data } = payload;
            const response = yield call(post, API.orderBasic, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    orderBasic: response,
                },
            });
        },
        // 关联订单列表
        * getOrderList({ payload }, { call, put }) {
            // const { data } = payload;
            const response = yield call(post, API.linkOrderList, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    orderList: response,
                    pageSize: PAGE_SIZE,
                    pageNum: payload.pageNum,
                },
            });
        },
        // 获取风控报告
        * getReport({ payload }, { call, put }) {
        // const { data } = payload;
            const response = yield call(post, API.getReport, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    getReport: response,
                    getReportList: response ? response.normList : [],
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
                const path = filterPath(pathname).split('/');
                if (path[1] === 'orderDetail') {
                    const sampleId = base64.decode(path[2]);
                    const companyId = JSON.parse(sessionStorage.userInfo).user.company;
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '订单管理', link: setPath('/order') }, { name: '订单详情' }],
                    });
                    dispatch({
                        type: 'common/setSide',
                        payload: true,
                    });
                    dispatch({
                        type: 'getOrderBasic',
                        payload: {
                            sampleId,
                        },
                    });
                    dispatch({
                        type: 'getOrderList',
                        payload: {
                            sampleId,
                            companyId,
                            pageNum: 1,
                            pageSize: 10,
                        },
                    });
                    dispatch({
                        type: 'getReport',
                        payload: {
                            sampleId,
                        },
                    });
                }
            });
        },
    },
};
