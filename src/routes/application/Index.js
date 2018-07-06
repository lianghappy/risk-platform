import React from 'react';
import { Layout, Menu } from 'antd';
import CSSModules from 'react-css-modules';
import CompanyIndex from './Company';
import style from './index.scss';

class Application extends React.PureComponent {
    state = {
        current: 'company',
    }
    handleClick = (e) => {
        this.setState({
            current: e.key,
        });
    }
    render() {
        return (
            <Layout className={style.container}>
                <Menu
                    mode="horizontal"
                    selectedKeys={[this.state.current]}
                    onClick={this.handleClick}
                >
                    <Menu.Item key="company">
                        公司管理
                    </Menu.Item>
                    <Menu.Item key="application">
                        应用管理
                    </Menu.Item>
                </Menu>
                <CompanyIndex />
            </Layout>
        );
    }
}

export default CSSModules(Application);
