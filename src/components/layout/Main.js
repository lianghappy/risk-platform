import React from 'react';
import {
    LocaleProvider,
    Layout,
} from 'antd';
import PropTypes from 'prop-types';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Header from 'components/layout/Header';
import Sider from 'components/layout/Sider';

const Main = ({ children }) => (
    <LocaleProvider locale={zhCN}>
        <Layout style={{ width: '100vw', height: '100vh' }}>
            <Sider />
            <Layout>
                <Layout.Header>
                    <Header />
                </Layout.Header>
                <Layout.Content>
                    {children}
                </Layout.Content>
            </Layout>
        </Layout>
    </LocaleProvider>
);

Main.propTypes = {
    children: PropTypes.element.isRequired,
};

export default Main;
