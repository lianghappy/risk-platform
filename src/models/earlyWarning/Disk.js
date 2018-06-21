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
    },
    effects: {
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
        // 增加策略
        * create({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addDisks, data);
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
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '监控大盘' }],
                    });
                    const userId = JSON.parse(sessionStorage.userInfo).user.id;
                    dispatch({
                        type: 'getdashBoard',
                        payload: {
                            userId,
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                        },
                    });
                }
            });
        },
    },
};
