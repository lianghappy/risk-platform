import dva from 'dva';
import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { message } from 'antd';
import { DURATION } from 'utils/constants';
// import { signature } from 'utils/request';
import { initSession } from 'models/session';
import './index.scss';

moment.locale('zh-cn');
// signature(); // 签名

// 1. Initialize
const app = dva({
    history: createHistory(),
    initialState: initSession(),
    onError(e, dispatch) {
        if (e.code === '5057001') {
        // 登录失效
            dispatch({
                type: 'session/logout',
            });
        }
        if (e.code === '40101') {
            // token失效
            dispatch({
                type: 'session/logout',
            });
            message.error('登录超时，请重新登录', DURATION);
        }
        if (e.code === '41501') {
            message.error('疑似sql注入攻击，本次请求已记录日志，请联系公司法务部门取证！', DURATION);
        }
        if (e.code === '41502') {
            message.error('疑似XSS脚本攻击，本次请求已记录日志，请联系公司法务部门取证！', DURATION);
        }
        // if (e.message === 'Failed to fetch') e.message = ERR_MSG;
        if (e.code !== '40101' && e.code !== '41501' && e.code !== '41502') message.error(e.message, DURATION);
    },
});
export default app;
// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/session').default);
app.model(require('./models/user').default);
app.model(require('./models/common').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
