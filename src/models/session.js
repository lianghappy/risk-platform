import { routerRedux } from 'dva/router';
import { setToken, post, setUserId, setDeviceId, signature } from 'utils/request';
import treeConvert from 'utils/treeConvert';
import API from 'utils/api';
import authed from 'utils/auths';
import { setPath, filterPath } from 'utils/path';

const compare = (property) => {
    return function (obj1, obj2) {
        const value1 = obj1[property];
        const value2 = obj2[property];
        return value1 - value2; // 升序
    };
};
// 权限解析
const authConvert = (menus) => {
    // let rootId = '';
    /* menus.some((el) => {
        if (el.parentId === 'recycler') {
            rootId = 'auctionRoot';
            return true;
        }
        return false;
    }); */
    let auths = [];
    const auth = []; // 新权限数组
    if (menus.length > 0) {
        menus.forEach(item => {
            authed.forEach(it => {
                if (it.id === item.id) {
                    it.sort = item.sort;
                    it.router = setPath(it.router);
                    auth.push(it);
                }
            });
        });
        auths = treeConvert({
            pId: 'pid',
            otherKeys: ['key', 'router', 'sort'],
        }, auth);
        auths.forEach(item => {
            item.children.sort(compare('sort'));
        });
    }
    return auths.sort(compare('sort'));
};

/* eslint-disable consistent-return */
const pickAuth = (menus) => {
    for (let i = 0, iLen = menus.length; i < iLen; i++) {
        if (menus[i].children) {
            for (let j = 0, jLen = menus[i].children.length; j < jLen; j++) {
                return pickAuth(menus[i].children);
            }
        } else {
            return menus[i].key;
        }
    }
};

// export const initAuth = (state) => {
//     const { auths } = state.session;
//     let auth = 'login';
//     if (auths.length > 0) {
//         auth = pickAuth(auths);
//     }
//     return auth;
// };

export const getUserInfo = (state) => state.session.user;
export const getUserName = (state) => {
    if (state.session.user) {
        return state.session.user.account;
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
        auths: [],
        token: null,
        isLogin: false,
    };
    if (userInfo) {
        userInfo = JSON.parse(userInfo);
        session = { ...userInfo, isLogin: true, auths: authConvert(userInfo.menus), };

        setToken(userInfo.token);
        setUserId(userInfo.user.id);
        setDeviceId(userInfo.user.sysId);
    } else {
        setToken(null);
    }
    signature(); // 签名

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
        auths: [],
    },
    effects: {
        // 登录
        * login({ payload }, { call, put }) {
            const response = yield call(post, API.login, payload);
            yield sessionStorage.setItem('userInfo', JSON.stringify(response));
            yield call(setToken, response.token);
            yield call(setUserId, response.user.id);
            yield call(setDeviceId, response.user.sysId);
            yield call(signature);
            yield put({
                type: 'loginSuc',
                payload: {
                    ...response,
                    auths: authConvert(response.menus),
                },
            });
        },
        // 登出
        * logout(action, { put }) {
            yield put(routerRedux.push(setPath('/login')));
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
                if (filterPath(pathname) === '/login') {
                    sessionStorage.clear();
                    setToken(null);
                    dispatch({
                        type: 'logoutSuc',
                    });
                    dispatch({
                        type: 'common/setBreadcrumb',
                        payload: [],
                    });
                    dispatch({
                        type: 'common/setSide',
                        payload: true,
                    });
                }
            });
        },
    },
};
