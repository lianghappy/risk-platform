import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'structure',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        parentlist: [],
    },
    effects: {
        // 获取规则类别列表
        * getStructureList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getCategory, payload, data);
            yield put({
                type: 'getStructureListSuc',
                payload: {
                    list: response,
                    sysId: SYSID,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 增加类别
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addCategory, data);
            yield call(resolve);
        },
        * update({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.updateCategory, data);
            yield call(resolve);
        },
        // 获取父类别列表
        * getParentCategory({ payload }, { call, put }) {
            const { resolve } = payload;
            const response = yield call(post, API.getParentCategory);
            yield put({
                type: 'getParentCategorySuc',
                payload: {
                    parentlist: response,
                },
            });
            yield call(resolve);
        },
    },
    reducers: {
        getStructureListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
        getParentCategorySuc(state, { payload }) {
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
                        type: 'getStructureList',
                        payload: {
                            sysId: SYSID,
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                        },
                    });
                    /* dispatch({
                        type: 'getParentCategory',
                    }); */
                }
            });
        },
    },
};
