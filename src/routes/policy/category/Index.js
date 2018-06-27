import React from 'react';
import CSSModules from 'react-css-modules';
import { Layout, Menu } from 'antd';
import Structure from './Structure';
import LinkRuler from './LinkRuler';
import styles from './index.scss';

const MenuItem = Menu.Item;
class Index extends React.PureComponent {
    state = {
        current: '.$category',
    };
    handleClick(e) {
        this.setState({
            current: e.key,
        });
    }
    render() {
        return (
            <Layout className={styles.containerss}>
                <Menu
                    onClick={(e) => this.handleClick(e)}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                >
                    <MenuItem key="category">
                        类别管理
                    </MenuItem>
                    <MenuItem key="linkRole">
                        关联规则
                    </MenuItem>
                </Menu>
                {
                    this.state.current === '.$category' ?
                        <Structure />
                        :
                        <LinkRuler />
                }
            </Layout>
        );
    }
}

export default CSSModules(Index);
