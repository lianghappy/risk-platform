import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE } from 'utils/constants';
// import base64 from 'utils/base64';
// import treeConvert from 'utils/treeConvert';
import { filterPath, setPath } from 'utils/path';

export default {
    namespace: 'editRegularPly',
    state: {
        list: {}, // 规则列表
        pageNum: 1,
        pageSize: PAGE_SIZE,
        categories: [], // 规则类型
        channels: [], // 规则来源
        regulars: [],
        _pageNum: 1,
        status: '',
        compareSymbol: [],
        getUnCategory: [],
        typeStages: '',
        ruleView: {},
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
        * getPolicyDetail({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getPolicyDetail, payload, data);
            yield put({
                type: 'querySuc',
                payload: {
                    status: response.isEnable,
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
        * update({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.updateRegulars, data);
            console.log('111');
            yield call(resolve);
        },
        * clone({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.cloneRegulars, data);
            console.log('111');
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
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                const path = filterPath(pathname).split('/');
                if (path[1] === 'editRegular') {
                    // const id = base64.decode(path[2]);
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '策略管理', link: setPath('/sandboxie') },
                            { name: '阶段管理', link: setPath(`/strategies/${path[3]}`) },
                            { name: '规则管理', link: setPath(`/regulars/${path[2]}/${path[3]}`) },
                            { name: '编辑规则' }],
                    });
                    /*                   const id = sessionStorage.regular ? JSON.parse(sessionStorage.regular).id : '';
                    dispatch({
                        type: 'ruleView',
                        payload: {
                            id,
                        }
                    }); */
                    dispatch({
                        type: 'common/setSide',
                        flag: false,
                    });
                }
            });
        },
    },
};
