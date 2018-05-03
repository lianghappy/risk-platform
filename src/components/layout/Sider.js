import React from 'react';
import {
    Layout,
    Menu,
    Icon,
} from 'antd';
import { Link } from 'dva/router';
import PropTypes from 'prop-types';
// import cs from 'classnames';
import styles from './Sider.scss';
import logo from '../../assets/images/机蜜logo.svg';

const SubMenu = Menu.SubMenu;
const Sider = ({ location }) => (
    <Layout.Sider breakpoint="lg" width="240" >
        <div className={styles.logo}>
            <img src={logo} alt="logo" className={styles.logoImgs} />
            <span className={styles.names}>PLD风控系统</span>
        </div>
        <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
        >
            <SubMenu key="system" title={<span><Icon type="mail" /><span>系统管理</span></span>}>
                <Menu.Item key="/account">
                    <Link to="/account">
                        <span>账号管理</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/role">
                    <Link to="/role">
                        <span>角色管理</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/permission">
                    <Link to="/permission">
                        <span>权限管理</span>
                    </Link>
                </Menu.Item>
            </SubMenu>
            <SubMenu key="application" title={<span><Icon type="mail" /><span>应用管理</span></span>}>
                <Menu.Item key="/company">
                    <Link to="/company">
                        <span>公司管理</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/app">
                    <Link to="/app">
                        <span>应用管理</span>
                    </Link>
                </Menu.Item>
            </SubMenu>
            <SubMenu key="policies" title={<span><Icon type="mail" /><span>决策引擎</span></span>}>
                <Menu.Item key="/categoryStru">
                    <Link to="/categoryStru">
                        <span>类别管理</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/rule">
                    <Link to="/rule">
                        <span>规则库管理</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/policy">
                    <Link to="/policy">
                        <span>策略管理</span>
                    </Link>
                </Menu.Item>
            </SubMenu>
            <SubMenu key="sandboxie" title={<span><Icon type="mail" /><span>策略沙箱</span></span>}>
                <Menu.Item key="/sandboxie">
                    <Link to="/sandboxie">
                        <span>策略沙箱</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/samples">
                    <Link to="/samples">
                        <span>实验样本</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/records">
                    <Link to="/records">
                        <span>实验记录</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/sandSamples">
                    <Link to="/sandSamples">
                        <span>沙箱样本</span>
                    </Link>
                </Menu.Item>
            </SubMenu>
            <SubMenu key="blackAndWhite" title={<span><Icon type="mail" /><span>黑白名单</span></span>}>
                <Menu.Item key="/black">
                    <Link to="/black">
                        <span>黑名单</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/white">
                    <Link to="/white">
                        <span>白名单</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/gray">
                    <Link to="/gray">
                        <span>灰名单</span>
                    </Link>
                </Menu.Item>
            </SubMenu>
        </Menu>
    </Layout.Sider>
);

Sider.propTypes = {
    location: PropTypes.object.isRequired,
};

export default Sider;
