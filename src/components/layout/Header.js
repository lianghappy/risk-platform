import React from 'react';
import {
    Dropdown,
    Menu,
    Icon,
} from 'antd';
import UpdatePwd from 'components/UpdatePwd';

class Header extends React.Component {
    static defaultProps = {
        userName: 'admin',
    };

    state = {
        visible: false, // 更新密码对话框显示标识
    };

    handleOk = () => {
        this.setState({
            visible: false,
        });
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    menuClick = ({ key }) => {
        if (Object.is(key, 'password')) {
        // 修改密码
            this.setState({
                visible: true,
            });
        } else {
        // 退出登录

        }
    };

    render() {
        const menu = (
            <Menu onClick={this.menuClick}>
                <Menu.Item key="password">修改密码</Menu.Item>
                <Menu.Item key="logout">退出登录</Menu.Item>
            </Menu>
        );
        const { userName } = this.props;

        return (
            <section style={{ float: 'right' }}>
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#">
                        {userName}
                        <Icon type="down" />
                    </a>
                </Dropdown>
                <UpdatePwd
                    visible={this.state.visible}
                    handleOk={this.handleOk}
                    handleCancel={this.handleCancel}
                />
            </section>
        );
    }
}

export default Header;
