// import { post } from 'utils/request';
// import API from 'utils/api';

export default {
    namespace: 'common',
    state: {
        breadcrumbItems: [],
        flag: true,
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
        }
    },
};
