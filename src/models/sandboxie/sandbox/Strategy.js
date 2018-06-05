import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import base64 from 'utils/base64';
import { filterPath } from 'utils/path';

export default {
    namespace: 'strategy',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
    },
    effects: {
        // 获取阶段
        * getStrategyList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getStrategyList, payload, data);
            yield put({
                type: 'getStrategyListSuc',
                payload: {
                    list: response,
                    sysId: SYSID,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 增加策略
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addStrategy, data);
            yield call(resolve);
        },
        // 更新策略
        * update({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.updateStrategy, data);
            yield call(resolve);
        },
        // 删除
        * del({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.delStrategy, data);
            yield call(resolve);
        },
    },
    reducers: {
        getStrategyListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                const path = filterPath(pathname).split('/');
                if (path[1] === 'sandboxies') {
                    const ids = base64.decode(path[2]);
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['策略沙箱', '阶段管理'],
                    });
                    dispatch({
                        type: 'getStrategyList',
                        payload: {
                            strategyId: ids,
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
