import React from 'react';
import {
    Layout,
    Menu,
} from 'antd';
import { Link } from 'dva/router';
import PropTypes from 'prop-types';
import cs from 'classnames';
import styles from './Sider.scss';
import logo from '../../assets/images/机蜜logo.svg';

const Sider = ({ location }) => (
    <Layout.Sider breakpoint="lg" >
        <div className={styles.logo}>
            <img src={logo} alt="logo" className={styles.logoImgs} />
            <span className={styles.names}>PLD风控系统</span>
        </div>
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
        >
            <Menu.Item key="/account" className={styles.tops}>
                <Link to="/account">
                    <i className={cs('icon-xitongguanli', 'anticon', styles['icon-xitongguanli'])} />
                    <span>系统管理</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="/application" className={styles.heights}>
                <Link to="/application">
                    <i className={cs('icon-yingyongguanli', 'anticon', styles['icon-yingyongguanli'])} />
                    <span>应用管理</span>
                </Link>
            </Menu.Item>
            <Menu.Item key="/categoryStru" className={styles.heights}>
                <Link to="/categoryStru">
                    <i className={cs('icon-jueceyinqing', 'anticon', styles['icon-jueceyinqing'])} />
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
