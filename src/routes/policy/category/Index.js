import React from 'react';
import CSSModules from 'react-css-modules';
import { Layout, Menu } from 'antd';

class Index extends React.PureComponent {
    state = {
        current: 'category',
    };
    handleClick(e) {
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
                        类别管理
                    </Menu.Item>
                    <Menu.Item key="role">
                        规则管理
                    </Menu.Item>
                    <Menu.Item key="permission">
                        策略管理
                    </Menu.Item>
                </Menu>
            </Layout>
        );
    }
}

export default CSSModules(Index);
