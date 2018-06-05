import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE } from 'utils/constants';
import base64 from 'utils/base64';
// import treeConvert from 'utils/treeConvert';
import { filterPath } from 'utils/path';

export default {
    namespace: 'regular',
    state: {
        list: {}, // 规则列表
        pageNum: 1,
        pageSize: PAGE_SIZE,
        categories: [], // 规则类型
        channels: [], // 规则来源
        regulars: [],
        _pageNum: 1,
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
                },
            });
        },
        * del({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.regularDel, data);
            yield call(resolve);
        },
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.regularAdd, data);
            yield call(resolve);
        },
        * update({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.regularUpdate, data);
            yield call(resolve);
        },
        * clone({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.regularClone, data);
            yield call(resolve);
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
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                const path = filterPath(pathname).split('/');
                if (path[1] === 'regular') {
                    const id = base64.decode(path[2]);

                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['策略管理', '阶段管理', '规则管理'],
                    });
                    dispatch({
                        type: 'query',
                        payload: {
                            stageId: id,
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                        },
                    });
                    dispatch({ type: 'queryCategory' });
                    dispatch({
                        type: 'queryChannel',
                        payload: {
                            type: 'rule',
                        },
                    });
                }
            });
        },
    },
};
