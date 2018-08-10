import React from 'react';
import CSSModules from 'react-css-modules';
import { Layout, Menu } from 'antd';
import Statistical from './Statistical';
import ThirdReport from './ThirdReport';

const MenuItem = Menu.Item;
class StatisticalIndex extends React.PureComponent {
    state = {
        current: '.$Statistical',
    };
    handleClick(e) {
        this.setState({
            current: e.key,
        });
    }
    render() {
        return (
            <Layout
                className="layoutMar"
            >
                <Menu
                    onClick={(e) => this.handleClick(e)}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                    rowId="key"
                >
                    <MenuItem key="Statistical">
                        规则命中统计
                    </MenuItem>
                    <MenuItem key="ThirdReport">
                        三方调用统计
                    </MenuItem>
                </Menu>
                {
                    this.state.current === '.$Statistical' ?
                        <Statistical />
                        :
                        <ThirdReport />
                }
            </Layout>
        );
    }
}

export default CSSModules(StatisticalIndex);
