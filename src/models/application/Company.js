import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';

export default {
    namespace: 'company',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        companyItem: [],
    },
    effects: {
        // 获取规则类别列表
        * getCompanyList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getCompanyList, payload, data);
            yield put({
                type: 'getCompanyListSuc',
                payload: {
                    list: response,
                    sysId: SYSID,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 品牌查询
        * queryCompanyDetail({ payload }, { call, put }) {
            const response = yield call(post, API.companyItem, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    companyItem: response,
                },
            });
        },
        // 删除
        * del({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.companyDel, data);
            yield call(resolve);
        },
        // 增加公司
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addCompany, data);
            yield call(resolve);
        },
        // 更新公司
        * update({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.companyUpdate, data);
            yield call(resolve);
        },
    },
    reducers: {
        getCompanyListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/company') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['应用管理', '公司管理'],
                    });
                    dispatch({
                        type: 'getCompanyList',
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
