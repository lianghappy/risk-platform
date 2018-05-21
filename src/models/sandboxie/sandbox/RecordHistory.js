import { post } from 'utils/request';
import API from 'utils/api';
import base64 from 'utils/base64';
import { PAGE_SIZE, SYSID } from 'utils/constants';

export default {
    namespace: 'recordHistory',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
    },
    effects: {
        // 获取规则类别列表
        * recordHistoryList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.recordHistoryList, payload, data);
            yield put({
                type: 'querySuc',
                payload: {
                    list: response,
                    sysId: SYSID,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
        // 增加策略
        * download({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.download, data);
            yield call(resolve);
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
                const path = pathname.split('/');
                if (path[2] === 'recordHistory') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['策略沙箱', '开始实验', '实验历史记录'],
                    });
                    console.log(base64.decode(path[3]));
                    const strategyId = base64.decode(path[3]);
                    dispatch({
                        type: 'recordHistoryList',
                        payload: {
                            sysId: SYSID,
                            pageNum: 1,
                            pageSize: PAGE_SIZE,
                            strategyId,
                        },
                    });
                }
            });
        },
    },
};
