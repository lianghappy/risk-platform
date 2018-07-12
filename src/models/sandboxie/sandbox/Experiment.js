import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath, setPath } from 'utils/path';

export default {
    namespace: 'experiment',
    state: {
        list: {},
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        details: [],
        exprList: [],
        experSelect: {},
        success: {},
        categories: [],
    },
    effects: {
        // 选择样本
        * start({ payload }, { call, put }) {
            const response = yield call(post, API.startExpe, payload);
            yield put({
                type: 'startSuc',
                payload: {
                    list: response,
                    sysId: SYSID,
                },
            });
        },
        // 选择样本明细
        * details({ payload }, { call, put }) {
            const response = yield call(post, API.experDetails, payload);
            yield put({
                type: 'startSuc',
                payload: {
                    details: response,
                    sysId: SYSID,
                    pageNum: payload.pageNum,
                    pageSize: 5,
                },
            });
        },
        * queryList({ payload }, { call, put }) {
            const response = yield call(post, API.experList, payload);
            yield put({
                type: 'startSuc',
                payload: {
                    exprList: response,
                    sysId: SYSID,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 样本筛选条件
        * selectQuery({ payload }, { call, put }) {
            const response = yield call(post, API.experSelect, payload);
            yield put({
                type: 'startSuc',
                payload: {
                    experSelect: response,
                    sysId: SYSID,
                },
            });
        },
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addStartExpers, data);
            yield call(resolve);
        },
        * startsExper({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.oldStartExpers, data);
            yield call(resolve);
        },
        // 获取来源
        * getType({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getBlackType, payload, data);
            yield put({
                type: 'startSuc',
                payload: {
                    categories: response,
                },
            });
        },

    },
    reducers: {
        startSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                const path = filterPath(pathname).split('/');
                if (path[1] === 'experiment') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '策略沙箱', link: setPath('/sandboxie') }, { name: '开始实验' }],
                    });
                    dispatch({
                        type: 'common/setSide',
                        flag: false,
                    });
                    dispatch({
                        type: 'getType',
                        payload: {
                            sysId: SYSID,
                            type: 'sampleSource',
                        },
                    });
                }
            });
        },
    },
};
