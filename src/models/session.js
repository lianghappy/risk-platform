import { routerRedux } from 'dva/router';
import { setToken, post, setUserId, setDeviceId } from 'utils/request';
import API from 'utils/api';

export const getUserInfo = (state) => state.session.user;
export const getUserName = (state) => {
    if (state.session.user) {
        return state.session.user.realName;
    }
    return '';
};
export const getAuth = (state) => state.session.menus;
export const getToken = (state) => state.session.token;
export const isLogin = (state) => state.session.isLogin;
export const initSession = () => {
    let userInfo = sessionStorage.getItem('userInfo');
    let session = {
        user: null,
        menus: null,
        token: null,
        isLogin: false,
    };
    if (userInfo) {
        userInfo = JSON.parse(userInfo);
        session = { ...userInfo, isLogin: true };
        setToken(userInfo.token);
        // setUserId(userInfo.user.id);
        // setDeviceId(userInfo.user.type);
    } else {
        setToken(null);
        // setUserId(null);
        // setDeviceId(null);
    }
    return {
        session,
    };
};

export default {
    namespace: 'session',
    state: {
        user: null, // 用户信息
        // passWord: null, // 密码(已加密)
        menus: null, // 权限表
        token: null, // token
        idLogin: false,
    },
    effects: {
        // 登录
        * login({ payload }, { call, put }) {
            const response = yield call(post, API.login, payload);
            yield sessionStorage.setItem('userInfo', JSON.stringify(response));
            yield setToken(response.token);
            yield setUserId(response.user.id);
            yield setDeviceId(response.user.type);
            yield put({
                type: 'loginSuc',
                payload: response,
            });
        },
        // 登出
        * logout(action, { put }) {
            yield put(routerRedux.push('/login'));
        },
    },
    reducers: {
        loginSuc(state, { payload }) {
            return { ...state, ...payload, isLogin: true };
        },
        logoutSuc() {
            return { isLogin: false };
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname }) => {
                if (pathname === '/login') {
                    sessionStorage.clear();
                    setToken(null);
                    setUserId(null);
                    setDeviceId(null);
                    dispatch({
                        type: 'logoutSuc',
                    });
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [],
                    });
                }
            });
        },
    },
};
