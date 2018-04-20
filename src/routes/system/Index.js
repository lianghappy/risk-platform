import React from 'react';
import { Layout, Menu } from 'antd';
import CSSModules from 'react-css-modules';
import DecisionIndex from './Account';
import RoleIndex from './Role';
import style from './index.scss';

class SystemManage extends React.PureComponent {
    state = {
        current: '.$account',
    }
    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }
    render() {
        console.log(this.state.current);
        return (
            <Layout className={style.container}>
                <Menu
                    mode="horizontal"
                    selectedKeys={[this.state.current]}
                    onClick={this.handleClick}
                >
                    <Menu.Item key="account">
                        账号管理
                    </Menu.Item>
                    <Menu.Item key="role">
                        角色管理
                    </Menu.Item>
                    <Menu.Item key="permission">
                        权限管理
                    </Menu.Item>
                </Menu>
                {
                    this.state.current === '.$account' ?
                        <DecisionIndex />
                        :
                        <RoleIndex />
                }
            </Layout>
        );
    }
}

export default CSSModules(SystemManage);
