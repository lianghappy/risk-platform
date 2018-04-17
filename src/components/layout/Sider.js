import React from 'react';
import {
    Layout,
    Menu,
    Icon,
} from 'antd';
import { Link } from 'dva/router';
import PropTypes from 'prop-types';
import cs from 'classnames';
import styles from './Sider.scss';

const Sider = ({ location }) => (
    <Layout.Sider breakpoint="lg" >
        <div className={styles.logo}>
            <Icon type="html5" />
        </div>
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
        >
            <Menu.Item key="/systemManage">
                <Link to="/systemManage">
                    <i className={cs('jimi-icon', 'anticon', styles['icon-user'])} />
                    <span>系统管理</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="/indexPage">
                <Link to="/indexPage">
                    <Icon type="video-camera" />
                    <span>应用管理</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="/decision">
                <Link to="/decision">
                    <Icon type="video-camera" />
                    <span>决策引擎</span>
                </Link>
            </Menu.Item>
        </Menu>
    </Layout.Sider>
);

Sider.propTypes = {
    location: PropTypes.object.isRequired,
};

export default Sider;
