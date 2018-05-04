import React from 'react';
import {
    Layout,
    Menu,
} from 'antd';
import { Link } from 'dva/router';
import PropTypes from 'prop-types';
import cs from 'classnames';
import authMap from 'utils/auth';
import { menuKeyPick } from 'utils/common';
import styles from './Sider.scss';
import logo from '../../assets/images/机蜜logo.svg';

const openKeys = authMap.map((item) => item.key);
// const SubMenu = Menu.SubMenu;
const Sider = ({ location }) => {
    const menuKey = menuKeyPick(location.pathname);
    return (
        <Layout.Sider breakpoint="lg" width="240" >
            <div className={styles.logo}>
                <img src={logo} alt="logo" className={styles.logoImgs} />
                <span className={styles.names}>PLD风控系统</span>
            </div>
            <Menu
                theme="dark"
                mode="inline"
                inlineIndent={10}
                className="jm-menu"
                defaultOpenKeys={openKeys}
                selectedKeys={menuKey}
                style={{ userSelect: 'none' }}
            >

                {
                    authMap.map((m) => (
                        <Menu.SubMenu
                            key={m.key}
                            title={<span><i className={cs('jm-icon', 'anticon', styles[m.key])} />{m.name}</span>}
                        >
                            {
                                m.children.map((sub) => (
                                    <Menu.Item key={sub.key}>
                                        <Link to={sub.router}>
                                            <span>{sub.name}</span>
                                        </Link>
                                    </Menu.Item>
                                ))
                            }
                        </Menu.SubMenu>
                    ))
                }
            </Menu>
        </Layout.Sider>
    );
};

Sider.propTypes = {
    location: PropTypes.object.isRequired,
};

export default Sider;
