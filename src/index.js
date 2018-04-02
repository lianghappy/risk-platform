import dva from 'dva';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { message } from 'antd';
import './index.css';

moment.locale('zh-cn');

// 1. Initialize
const app = dva({
    onError(e) {
        console.log('onError');
        message.error(e.message, /* duration */3);
    },
});

// 2. Plugins
// app.use({});

// 3. Model
// app.model(require('./models/example').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
