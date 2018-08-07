import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE } from 'utils/constants';

export default {
    namespace: 'commonRegular',
    state: {
        pageNum: 1,
        pageSize: PAGE_SIZE,
        categories: [], // 规则类型
        channels: [], // 规则来源
        regulars: [],
        _pageNum: 1,
        compareSymbol: [],
        getUnCategory: [],
        ruleView: {},
        normList: [],
    },
    effects: {
        * query({ payload }, { call, put }) {
            const response = yield call(post, API.regular, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    list: response,
                    pageNum: payload.pageNum,
                    pageSize: payload.pageSize,
                    typeStages: response.stage.type,
                },
            });
        },
        * ruleView({ payload }, { call, put }) {
            const response = yield call(post, API.rulesView, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    ruleView: response,
                    normList: response.normList,
                },
            });
        },
        // 对于未分类的规则重写
        * getUnCategory({ payload }, { call, put }) {
            const response = yield call(post, API.getUnCategory, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    getUnCategory: response,
                    _pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 规则类型
        * queryCategory(action, { call, put }) {
            const response = yield call(post, API.getCategoryList);
            // response = treeConvert({
            //     pId: 'pid',
            //     tId: 'value',
            //     tName: 'label',
            // }, response);

            yield put({
                type: 'querySuc',
                payload: {
                    categories: response,
                },
            });
        },
        // 规则来源
        * queryChannel({ payload }, { call, put }) {
            const response = yield call(post, API.getBlackType, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    channels: response,
                },
            });
        },
        * queryCompareSymbol({ payload }, { call, put }) {
            const response = yield call(post, API.getBlackType, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    compareSymbol: response,
                },
            });
        },
        * queryRegular({ payload }, { call, put }) {
            const response = yield call(post, API.getLinkRuler, payload);
            yield put({
                type: 'querySuc',
                payload: {
                    regulars: response,
                    _pageNum: payload.pageNum,
                },
            });
        },
    },
    reducers: {
        querySuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
};
