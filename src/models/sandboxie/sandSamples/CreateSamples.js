import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';

export default {
    namespace: 'creates',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
    },
    effects: {
        // 获取下拉菜单
        * getSelect({ payload }, { call, put }) {
            const response = yield call(post, API.getAllType, payload);
            yield put({
                type: 'getSelectSuc',
                payload: {
                    list: response,
                    sysId: SYSID,
                },
            });
        },
        // 增加
        * add({ payload }, { call }) {
            const { data, resolve } = payload;
            yield call(post, API.addCreateSamples, data);
            yield call(resolve);
        },
    },
    reducers: {
        getSelectSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/sandSamples/create') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: ['沙箱样本', '创建样本'],
                    });
                    dispatch({
                        type: 'getSelect',
                    });
                }
            });
        },
    },
};
