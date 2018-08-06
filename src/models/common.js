// import { post } from 'utils/request';
// import API from 'utils/api';

export default {
    namespace: 'common',
    state: {
        breadcrumbItems: [],
        flag: true,
        searchFields: {
            order: {}, // 订单列表
            rule: {}, // 指标列表
            policy: {}, // 策略列表
        },
    },
    reducers: {
        setBreadcrumb(state, { payload }) {
            return {
                ...state,
                breadcrumbItems: payload,
            };
        },
        setSide(state, { payload }) {
            return {
                ...state,
                flag: payload,
            };
        },
        setSearchFields(state, { payload }) {
            const { type, searchFields } = payload;
            return {
                ...state,
                searchFields: {
                    ...state.searchFields,
                    [type]: {
                        ...searchFields,
                    }
                }
            };
        },
    },
};
