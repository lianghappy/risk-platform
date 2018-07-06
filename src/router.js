import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
import PropTypes from 'prop-types';
import Main from 'components/layout/Main';
import { setPath } from 'utils/path';
import { isLogin } from 'models/session';

let appClone = null;

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            (isLogin(appClone._store.getState()) ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: setPath('/login'),
                        state: { from: props.location },
                    }}
                />
            ))
        }
    />
);

function RouterConfig({ history, app }) {
    appClone = app;
    const Login = dynamic({
        app,
        component: () => import('routes/login/Login'),
    });
    // 账号管理
    const Account = dynamic({
        app,
        component: () => import('routes/system/account/Account'),
        models: () => [
            import('models/system/Account'),
        ],
    });
    // 角色管理
    const Role = dynamic({
        app,
        component: () => import('routes/system/role/Role'),
        models: () => [
            import('models/system/Role'),
        ],
    });
    const User = dynamic({
        app,
        component: () => import('routes/user/User'),
    });
    // 权限管理
    const Permission = dynamic({
        app,
        component: () => import('routes/system/permission/Permission'),
        models: () => [
            import('models/system/Permission'),
        ],
    });
    // 欢迎页面
    const IndexPage = dynamic({
        app,
        component: () => import('routes/IndexPage'),
    });

    // 公司管理
    const Application = dynamic({
        app,
        component: () => import('routes/application/company/Company'),
        models: () => [
            import('models/application/Company'),
        ],
    });
    // 应用管理
    const appManage = dynamic({
        app,
        component: () => import('routes/application/app/App'),
        models: () => [
            import('models/application/App'),
        ],
    });
    // 查看应用
    const LookApp = dynamic({
        app,
        component: () => import('routes/application/app/LookApp'),
        models: () => [
            import('models/application/LookApp'),
            import('models/application/App'),
        ],
    });
    // 添加角色/编辑角色
    const AddRole = dynamic({
        app,
        component: () => import('routes/system/role/AddRole'),
        models: () => [
            import('models/system/roleMenuTree'),
        ],
    });
    // 角色详情/编辑角色
    const RoleDetail = dynamic({
        app,
        component: () => import('routes/system/role/RoleDetails'),
        models: () => [
            import('models/system/RoleDetails'),
        ],
    });
    // 类别构建
    const construct = dynamic({
        app,
        component: () => import('routes/policy/category/Index'),
        models: () => [
            import('models/policy/category/Structure'),
            import('models/policy/category/LinkRuler'),
        ],
    });
    // 规则库管理
    const Rules = dynamic({
        app,
        component: () => import('routes/policy/rule/Rule'),
        models: () => [
            import('models/policy/rule/Rule'),
        ],
    });
    // 策略管理
    const Policy = dynamic({
        app,
        component: () => import('routes/policy/policies/Policy'),
        models: () => [
            import('models/policy/policies/Policy'),
        ],
    });
    // 阶段
    const Strategy = dynamic({
        app,
        component: () => import('routes/policy/policies/Strategy'),
        models: () => [
            import('models/policy/policies/Strategy'),
        ],
    });
    // 规则管理
    const Regular = dynamic({
        app,
        component: () => import('routes/policy/policies/regular/Regular'),
        models: () => [
            import('models/policy/policies/regular'),
        ],
    });
    // 策略管理规则管理
    const Regulars = dynamic({
        app,
        component: () => import('routes/sandboxie/sandbox/regular/Regular'),
        models: () => [
            import('models/sandboxie/sandbox/regular'),
        ],
    });
    // 黑名单
    const Black = dynamic({
        app,
        component: () => import('routes/blackAndWhite/Black'),
        models: () => [
            import('models/blackAndWhite/Black'),
            import('models/blackAndWhite/common'),
        ],
    });
    // 白名单
    const White = dynamic({
        app,
        component: () => import('routes/blackAndWhite/White'),
        models: () => [
            import('models/blackAndWhite/White'),
            import('models/blackAndWhite/common'),
        ],
    });
    // 灰名单
    const Gray = dynamic({
        app,
        component: () => import('routes/blackAndWhite/Gray'),
        models: () => [
            import('models/blackAndWhite/Gray.js'),
            import('models/blackAndWhite/common'),
        ],
    });
    // 策略沙箱
    const sandboxie = dynamic({
        app,
        component: () => import('routes/sandboxie/sandbox/Sandboxie.js'),
        models: () => [
            import('models/sandboxie/Sandboxie.js'),
        ],
    });
    // 阶段
    const Strategies = dynamic({
        app,
        component: () => import('routes/sandboxie/sandbox/Strategy'),
        models: () => [
            import('models/sandboxie/sandbox/Strategy'),
        ],
    });
    // 开始实验
    const Experiment = dynamic({
        app,
        component: () => import('routes/sandboxie/sandbox/Experiment.js'),
        models: () => [
            import('models/sandboxie/sandbox/Experiment.js'),
        ],
    });
    // 实验历史记录
    const History = dynamic({
        app,
        component: () => import('routes/sandboxie/sandbox/History'),
    });
    // 实验样本
    const samples = dynamic({
        app,
        component: () => import('routes/sandboxie/samples/Samples'),
        models: () => [
            import('models/sandboxie/samples/Samples'),
        ],
    });
    // 沙箱样本
    const SandSamples = dynamic({
        app,
        component: () => import('routes/sandboxie/sandSamples/SandSamples'),
        models: () => [
            import('models/sandboxie/sandSamples/SandSamples'),
        ],
    });
    // 生成宽表
    const Create = dynamic({
        app,
        component: () => import('routes/sandboxie/sandSamples/CreateSamples'),
        models: () => [
             import('models/sandboxie/sandSamples/CreateSamples'),
        ],
    });
    // 实验记录
    const Record = dynamic({
        app,
        component: () => import('routes/sandboxie/record/Records'),
        models: () => [
            import('models/sandboxie/record/Records'),
        ],
    });
    const HistoryRecord = dynamic({
        app,
        component: () => import('routes/sandboxie/sandbox/RecordHistory'),
        models: () => [
            import('models/sandboxie/sandbox/RecordHistory')
        ],
    });
    // 报警收件人
    const WarningPeople = dynamic({
        app,
        component: () => import('routes/warningPeople/object/Index'),
        models: () => [
            import('models/warning/WarningPeople')
        ],
    });
    // 报警规则
    const warningRule = dynamic({
        app,
        component: () => import('routes/warningPeople/rule/WarningRule'),
        models: () => [
            import('models/warning/WarningRule'),
        ]
    });
    // 添加报警规则
    const addWarningRule = dynamic({
        app,
        component: () => import('routes/warningPeople/rule/AddRule'),
        models: () => [
            import('models/warning/AddWarning'),
        ],
    });
    // 监控大盘
    const Disk = dynamic({
        app,
        component: () => import('routes/earlyWarning/disk/Disk'),
        models: () => [
            import('models/earlyWarning/Disk.js')
        ],
    });
    // 报警历史
    const historyPolice = dynamic({
        app,
        component: () => import('routes/earlyWarning/history/History'),
        models: () => [
            import('models/earlyWarning/History')
        ]
    });
    // 订单管理
    const Orders = dynamic({
        app,
        component: () => import('routes/system/order/Order'),
        models: () => [
            import('models/system/Order'),
        ],
    });
    // 订单详情
    const OrderDetail = dynamic({
        app,
        component: () => import('routes/system/order/detail/OrderDetail.js'),
        models: () => [
            import('models/system/OrderDetail.js')
        ],
    });
    // 第三方产品
    const ThirdParty = dynamic({
        app,
        component: () => import('routes/system/thirdPartyManage/ThirdPartyManage'),
        models: () => [
            import('models/system/ThirdPartyManage')
        ]
    });
    // 灰度策略
    const grayPolicy = dynamic({
        app,
        component: () => import('routes/policy/grayPolicy/GrayPolicy'),
        models: () => [
            import('models/policy/grayPolicy/GrayPolicy')
        ]
    });
    return (
        <Router history={history}>
            <Switch>
                <Route path={setPath('/login')} exact component={Login} />
                <Main location={history.location}>
                    <Route
                        path="/"
                        exact
                        render={() => (
                            <Redirect to={setPath('/IndexPage')} />
                        )}
                    />
                    <PrivateRoute path={setPath('/IndexPage')} exact component={IndexPage} />
                    <PrivateRoute path={setPath('/account')} exact component={Account} />
                    <PrivateRoute path={setPath('/role')} exact component={Role} />
                    <PrivateRoute path={setPath('/addRole')} exact component={AddRole} />
                    <PrivateRoute path={setPath('/detailRole/:id')} exact component={RoleDetail} />
                    <PrivateRoute path={setPath('/user')} exact component={User} />
                    <PrivateRoute path={setPath('/app')} exact component={appManage} />
                    <PrivateRoute path={setPath('/apps/:id')} exact component={LookApp} />
                    <PrivateRoute path={setPath('/company')} exact component={Application} />
                    <PrivateRoute path={setPath('/applicationManage')} exact component={appManage} />
                    <PrivateRoute path={setPath('/categoryStru')} exact component={construct} />
                    <PrivateRoute path={setPath('/rule')} exact component={Rules} />
                    <PrivateRoute path={setPath('/policy')} exact component={Policy} />
                    <PrivateRoute path={setPath('/strategy/:id')} component={Strategy} />
                    <PrivateRoute path={setPath('/regular/:id/:strageId')} component={Regular} />
                    <PrivateRoute path={setPath('/regulars/:id/:strageId')} component={Regulars} />
                    <PrivateRoute path={setPath('/permission')} exact component={Permission} />
                    <PrivateRoute path={setPath('/black')} exact component={Black} />
                    <PrivateRoute path={setPath('/white')} exact component={White} />
                    <PrivateRoute path={setPath('/gray')} exact component={Gray} />
                    <PrivateRoute path={setPath('/sandboxie')} exact component={sandboxie} />
                    <PrivateRoute path={setPath('/experiment/:id')} exact component={Experiment} />
                    <PrivateRoute path={setPath('/strategies/:id')} exact component={Strategies} />
                    <PrivateRoute path={setPath('/history/:id')} exact component={History} />
                    <PrivateRoute path={setPath('/samples')} exact component={samples} />
                    <PrivateRoute path={setPath('/SandSamples')} exact component={SandSamples} />
                    <PrivateRoute path={setPath('/SandSamples/create')} exact component={Create} />
                    <PrivateRoute path={setPath('/recordHistory')} exact component={Record} />
                    <PrivateRoute path={setPath('/sandboxie/recordHistory/:id')} exact component={HistoryRecord} />
                    <PrivateRoute path={setPath('/warningPeople')} exact component={WarningPeople} />
                    <PrivateRoute path={setPath('/warningRule')} exact component={warningRule} />
                    <PrivateRoute path={setPath('/disk')} exact component={Disk} />
                    <PrivateRoute path={setPath('/historyPolice')} exact component={historyPolice} />
                    <PrivateRoute path={setPath('/addWarningRule')} exact component={addWarningRule} />
                    <PrivateRoute path={setPath('/order')} exact component={Orders} />
                    <PrivateRoute path={setPath('/orderDetail/:id')} exact component={OrderDetail} />
                    <PrivateRoute path={setPath('/thirdPartyManage')} exact component={ThirdParty} />
                    <PrivateRoute path={setPath('/grayPolicy')} exact component={grayPolicy} />
                </Main>
            </Switch>
        </Router>
    );
}

RouterConfig.propTypes = {
    history: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
};

export default RouterConfig;
