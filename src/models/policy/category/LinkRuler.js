import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'linkRuler',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        typeList: [],
        categoryList: [],
        regulars: [],
    },
    effects: {
        // 获取类别关联规则信息
        * getLinkRulerList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getLinkRuler, payload, data);
            yield put({
                type: 'getLinkRulerListSuc',
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
        // 获取规则类目的列表
        * getCategoryList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getCategoryList, payload, data);
            yield put({
                type: 'getCategoryListSuc',
                payload: {
                    categoryList: response,
                    sysId: SYSID,
                },
            });
        },
        // 单个删除类别规则
        * del({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delCategoryRule, data);
            yield call(resolve);
        },
        // 单个删除类别规则
        * delList({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delListCategoryRule, data);
            yield call(resolve);
        },
        * queryRegular({ payload }, { call, put }) {
            const response = yield call(post, API.getRules, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    regulars: response,
                    _pageNum: payload.pageNum,
                },
            });
        },
        // 增加规则
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.categoryAndRule, data);
            yield call(resolve);
        },
    },
    reducers: {
        getLinkRulerListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
        getChannelSuc(state, { payload }) {
            return { ...state, ...payload };
        },
        getCategoryListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
        querySuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (filterPath(pathname) === '/linkRuler') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['类别管理'],
                    });
                    dispatch({
                        type: 'getLinkRulerList',
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
                    dispatch({
                        type: 'getCategoryList',
                        payload: {
                            sysId: SYSID,
                        },
                    });
                }
            });
        },
    },
};
