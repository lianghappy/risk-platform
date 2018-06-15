import React from 'react';
import { Layout, Menu } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import People from './People';
import Peoples from './Peoples';
import styles from './index.scss';

export default class PeopleIndex extends React.PureComponent {
    state = {
        current: 'people'
    };
    handleClick = e => {
        this.setState({
            current: e.key
        });
    };
    render() {
        return (
            <Layout className={styles.layout}>
                <Menu
                    mode="horizontal"
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                >
                    <MenuItem key="people">报警收件人</MenuItem>
                    <MenuItem key="peoples">报警收件组</MenuItem>
                </Menu>
                {this.state.current === 'people' ? <People {...this.props} /> : <Peoples />}
            </Layout>
        );
    }
}
