import { post } from 'utils/request';
import API from 'utils/api';
import { PAGE_SIZE, SYSID } from 'utils/constants';
import { filterPath } from 'utils/path';

export default {
    namespace: 'permission',
    state: {
        list: [],
        sysId: SYSID,
        pageNum: 1,
        pageSize: PAGE_SIZE,
    },
    effects: {
        // 获取规则类别列表
        * getPermissionList({ payload }, { call, put }) {
            const { data } = payload;
            const response = yield call(post, API.getPermission, payload, data);
            yield put({
                type: 'getPermissionListSuc',
                payload: {
                    list: response,
                    sysId: SYSID,
                    pageNum: payload.pageNum,
                    pageSize: PAGE_SIZE,
                },
            });
        },
    },
    reducers: {
        getPermissionListSuc(state, { payload }) {
            return { ...state, ...payload };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (filterPath(pathname) === '/permission') {
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [{ name: '权限管理' }],
                    });
                    dispatch({
                        type: 'common/setSide',
                        payload: true,
                    });
                    dispatch({
                        type: 'getPermissionList',
                        payload: {
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
