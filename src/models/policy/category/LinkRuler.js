import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import treeConvert from 'utils/treeConvert';
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
        treeDatas: [],
        _pageNum: 1,
        getUnCategory: [],
    },
    effects: {
        // 获取类别关联规则信息
        * getLinkRulerList({ payload }, { call, put }) {
            const response = yield call(post, API.getLinkRuler, payload);
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
            const response = yield call(post, API.getCategoryList, payload);
            let categoryLists = [];
            categoryLists = treeConvert({
                pId: 'pid',
                tId: 'key',
                tName: 'title',
            }, response);
            categoryLists.push({
                key: '0',
                title: '未分类',
            });
            // categoryLists.push();
            yield put({
                type: 'getCategoryListSuc',
                payload: {
                    categoryList: response,
                    sysId: SYSID,
                    treeDatas: categoryLists,
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
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
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
                if (filterPath(pathname) === '/categoryStru') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '类别管理' }],
                    });
                    dispatch({
                        type: 'getChannel',
                        payload: {
                            type: 'rule',
                        },
                    });
                    dispatch({
                        type: 'common/setSide',
                        flag: false,
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
