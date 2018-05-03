import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
import PropTypes from 'prop-types';
import Main from 'components/layout/Main';
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
                        pathname: '/login',
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
    const Index = dynamic({
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
    // 类别构建
    const construct = dynamic({
        app,
        component: () => import('routes/policy/category/Structure'),
        models: () => [
            import('models/policy/category/Structure'),
        ],
    });
    // 关联规则
    const LinkRuler = dynamic({
        app,
        component: () => import('routes/policy/category/LinkRuler'),
        models: () => [
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
    // 黑名单
    const Black = dynamic({
        app,
        component: () => import('routes/blackAndWhite/Black.js'),
        models: () => [
            import('models/blackAndWhite/Black.js'),
        ],
    });
    return (
        <Router history={history}>
            <Switch>
                <Route path="/login" exact component={Login} />
                <Main location={history.location}>
                    <Route
                        path="/"
                        exact
                        render={() => (
                            <Redirect to="/index" />
                        )}
                    />
                    <PrivateRoute path="/index" exact component={Index} />
                    <Route path="/account" exact component={Account} />
                    <Route path="/role" component={Role}>
                        <Route path="/addRole" component={AddRole} />
                    </Route>
                    <Route path="/user" exact component={User} />
                    <Route path="/app" component={appManage} />
                    <Route path="/app/:id" exact component={LookApp} />
                    <Route path="/company" exact component={Application} />
                    <Route path="/applicationManage" exact component={appManage} />
                    <Route path="/categoryStru" exact component={construct} />
                    <Route path="/linkRuler" exact component={LinkRuler} />
                    <Route path="/rule" exact component={Rules} />
                    <Route path="/policy" exact component={Policy} />
                    <Route path="/policy/:id" component={Strategy} />
                    <Route path="/permission" exact component={Permission} />
                    <Route path="/black" exact component={Black} />
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
