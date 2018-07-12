import React from 'react';
import CSSModules from 'react-css-modules';
import { Layout, Menu } from 'antd';
import Black from './Black';
import Gray from './Gray';
import White from './White';
import styles from './index.scss';

const MenuItem = Menu.Item;
class Index extends React.PureComponent {
    state = {
        current: '.$black',
    };
    handleClick(e) {
        this.setState({
            current: e.key,
        });
    }
    render() {
        return (
            <Layout className={styles.containers}>
                <Menu
                    onClick={(e) => this.handleClick(e)}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                >
                    <MenuItem key="black">
                        黑名单
                    </MenuItem>
                    <MenuItem key="gray">
                        灰名单
                    </MenuItem>
                    <MenuItem key="white">
                        白名单
                    </MenuItem>
                </Menu>
                {
                    this.state.current === '.$black' &&
                        <Black />
                }
                {
                    this.state.current === '.$gray' &&
                        <Gray />
                }
                {
                    this.state.current === '.$white' &&
                        <White />
                }
            </Layout>
        );
    }
}

export default CSSModules(Index);
