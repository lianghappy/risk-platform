// import { post } from 'utils/request';
// import API from 'utils/api';

export default {
    namespace: 'common',
    state: {
        breadcrumbItems: [],
    },
    reducers: {
        setBreadcrumb(state, { payload }) {
            return {
                ...state,
                breadcrumbItems: payload,
            };
        },
    },
};
