import dva from 'dva';
import createHistory from 'history/createBrowserHistory';
import createLoading from 'dva-loading';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { message } from 'antd';
import { DURATION } from 'utils/constants';
// import { signature } from 'utils/request';
import { initSession } from 'models/session';
import './index.css';

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
        message.error(e.message, DURATION);
    },
});

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
