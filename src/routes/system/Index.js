import React from 'react';
import { Layout, Menu } from 'antd';

class SystemManage extends React.PureComponent {
    state = {
        current: this.props.current,
    }
    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }
    render() {
        return (
            <Layout>
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
            </Layout>
        );
    }
}
export default SystemManage;
