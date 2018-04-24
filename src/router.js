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
    // 欢迎页面
    const Index = dynamic({
        app,
        component: () => import('routes/IndexPage'),
    });
    // const Decision = dynamic({
    //     app,
    //     component: () => import('routes/system/account/Account'),
    // });
    // 公司管理
    const Application = dynamic({
        app,
        component: () => import('routes/application/Index'),
    });
    // 应用管理
    const appManage = dynamic({
        app,
        component: () => import('routes/application/Application'),
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
    // 规则库管理
    const Rules = dynamic({
        app,
        component: () => import('routes/policy/rule/Rule'),
        models: () => [
            import('models/policy/rule/Rule'),
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
                    <Route path="/role" exact component={Role} />
                    <Route path="/addRole" exact component={AddRole} />
                    <Route path="/user" exact component={User} />
                    {/* <Route path="/decision" exact component={Decision} /> */}
                    <Route path="/application" exact component={Application} />
                    <Route path="/applicationManage" exact component={appManage} />
                    <Route path="/categoryStru" exact component={construct} />
                    <Route path="/rule" exact component={Rules} />
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
