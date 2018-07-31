import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'disk',
    state: {
        dashBoard: [],
        pageNum: 1,
        pageSize: PAGE_SIZE,
        sysId: SYSID,
        strategy: [],
        sleuthTarget: [],
        app: [],
        product: [],
        getDiskData: [],
        singleData: {},
        createDisk: {},
    },
    effects: {
        * getSelect({ payload }, { call, put }) {
            const response = yield call(post, API.warningZB, payload);
            const apps = response.apps;
            yield put({
                type: 'querySrc',
                payload: {
                    sleuthTarget: response.sleuthTargets,
                    strategy: response.strategys,
                    app: apps,
                    product: response.products,
                }
            });
        },
        * getdashBoard({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.dashBoard, payload, data);
            yield put({
                type: 'querySrc',
                payload: {
                    dashBoard: response,
                    pageNum: payload.pageNum,
                    pageSize: payload.pageSize,
                    sysId: payload.sysId,
                },
            });
        },
        * getData({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.dashBoardData, payload, data);
            yield put({
                type: 'querySrc',
                payload: {
                    getDiskData: response,
                },
            });
        },
        * getSingleData({ payload }, { call, put }) {
            const response = yield call(post, API.SingleDisk, payload);
            yield put({
                type: 'querySrc',
                payload: {
                    singleData: response,
                },
            });
        },
        // 创建大盘
        * create({ payload }, { call, put }) {
            const { data, resolve } = payload;
            const response = yield call(post, API.addDisks, data);
            yield put({
                type: 'querySrc',
                payload: {
                    createDisk: response,
                },
            });
            yield call(resolve);
        },
        // 添加
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addDiskTable, data);
            yield call(resolve);
        },
        // 添加
        * del({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delDisk, data);
            yield call(resolve);
        },
        * delTable({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delTableDisk, data);
            yield call(resolve);
        },
    },
    reducers: {
        querySrc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (filterPath(pathname) === '/disk') {
                    const companyId = JSON.parse(sessionStorage.userInfo).user.company;
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '监控大盘' }],
                    });
                    dispatch({
                        type: 'getdashBoard',
                        payload: {
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                        },
                    });
                    dispatch({
                        type: 'getSelect',
                        payload: {
                            companyId,
                            isEnable: 1,
                        },
                    });
                }
            });
        },
    },
};
