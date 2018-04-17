import React from 'react';
import {
    LocaleProvider,
    Layout,
} from 'antd';
import PropTypes from 'prop-types';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Header from 'components/layout/Header';
import Sider from 'components/layout/Sider';

const Main = ({ children, location }) => (
    <LocaleProvider locale={zhCN}>
        <Layout style={{ width: '100vw', height: '100vh' }}>
            <Sider location={location} />
            <Layout>
                <Layout.Header>
                    <Header />
                </Layout.Header>
                <Layout.Content id="ui-content" style={{ overflow: 'auto' }}>
                    {children}
                </Layout.Content>
            </Layout>
        </Layout>
    </LocaleProvider>
);

Main.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.array,
    ]).isRequired,
    location: PropTypes.object.isRequired,
};

export default Main;
