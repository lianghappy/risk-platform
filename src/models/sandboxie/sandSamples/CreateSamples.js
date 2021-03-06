import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath, setPath } from 'utils/path';

export default {
    namespace: 'creates',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
        channelType: [],
        strategys: [],
    },
    effects: {
        // 获取下拉菜单
        * getSelect({ payload }, { call, put }) {
            const response = yield call(post, API.getAllType, payload);
            yield put({
                type: 'getSelectSuc',
                payload: {
                    list: response.channelBanks,
                    strategys: response.strategys,
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
                if (filterPath(pathname) === '/sandSamples/create') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '沙箱样本', link: setPath('/sandSamples') }, { name: '创建样本' }],
                    });
                    dispatch({
                        type: 'getSelect',
                    });
                    dispatch({
                        type: 'common/setSide',
                        flag: false,
                    });
                }
            });
        },
    },
};
