import React from 'react';
import {
    Layout,
    Menu,
    Icon,
} from 'antd';
import CSSModules from 'react-css-modules';
import styles from './Sider.scss';

const Sider = () => (
    <Layout.Sider breakpoint="lg">
        <div styleName="logo">
            <Icon type="html5" />
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
                <i className="jimi-icon anticon" styleName="icon-user" />
                <span>nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
                <Icon type="video-camera" />
                <span>nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
                <Icon type="upload" />
                <span>nav 3</span>
            </Menu.Item>
            {
            /*
            <Menu.SubMenu
                key="sub1"
                title={<span><Icon type="mail" /><span>Navigation One</span></span>}
            >
                <Menu.Item key="4">Option 4</Menu.Item>
                <Menu.Item key="5">Option 5</Menu.Item>
                <Menu.Item key="6">Option 6</Menu.Item>
                <Menu.Item key="7">Option 7</Menu.Item>
            </Menu.SubMenu>
            */
            }
        </Menu>
    </Layout.Sider>
);

export default CSSModules(Sider, styles, { allowMultiple: true });
