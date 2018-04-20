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
    const SystemManage = dynamic({
        app,
        component: () => import('routes/system/Index'),
        models: () => [
            import('models/system/Account'),
        ],
    });
    const User = dynamic({
        app,
        component: () => import('routes/user/User'),
    });
    const Index = dynamic({
        app,
        component: () => import('routes/IndexPage'),
    });
    const Decision = dynamic({
        app,
        component: () => import('routes/system/Account'),
    });
    const Application = dynamic({
        app,
        component: () => import('routes/application/Index'),
    });
    const appManage = dynamic({
        app,
        component: () => import('routes/application/Application'),
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
                    <Route path="/systemManage" exact component={SystemManage} />
                    <Route path="/user" exact component={User} />
                    <Route path="/decision" exact component={Decision} />
                    <Route path="/application" exact component={Application} />
                    <Route path="/applicationManage" exact component={appManage} />
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
