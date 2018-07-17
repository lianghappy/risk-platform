import React from 'react';
import { connect } from 'dva';
import { Layout, Menu } from 'antd';
import { Link } from 'dva/router';
import PropTypes from 'prop-types';
import cs from 'classnames';
import { menuKeyPick } from 'utils/common';
import { authFirst, authsSecond } from 'utils/auth';
import { setPath } from 'utils/path';
import styles from './Sider.scss';
import logo from '../../assets/images/机蜜logo.svg';

const mapStateToProps = state => ({
    auths: state.session.auths,
    flag: state.common.flag,
});
@connect(mapStateToProps)
export default class Sider extends React.PureComponent {
    static propTypes = {
        // auths: PropTypes.array.isRequired,
        location: PropTypes.object.isRequired,
        flag: PropTypes.bool.isRequired,
    };
    render() {
        const { location, auths } = this.props;
        let auth = [];
        if (auths) {
            auth = this.props.flag ? authFirst : authsSecond;
        }
        const menuKey = menuKeyPick(location);

        return (
            <Layout.Sider breakpoint="lg" className="jm-sider">
                <div className={styles.logo}>
                    <img src={logo} alt="logo" className={styles.logoImgs} />
                    <span className={styles.names}>PLD风控系统</span>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    inlineIndent={10}
                    className="jm-menu"
                    selectedKeys={menuKey}
                    style={{ userSelect: 'none' }}
                >
                    {
                        !this.props.flag &&
                    <Menu.Item>
                        <Link to={setPath('/account')} >
                            <span>首页</span>
                        </Link>
                    </Menu.Item>
                    }
                    { auth && auth.map(m => (
                        <Menu.SubMenu
                            key={m.key}
                            title={
                                <span>
                                    <i
                                        className={cs(
                                            'jm-icon',
                                            'anticon',
                                            styles[m.key]
                                        )}
                                    />
                                    {m.name}
                                </span>
                            }
                        >
                            {m.children.map(sub => (
                                <Menu.Item key={sub.key}>
                                    <Link to={sub.router}>
                                        <span>{sub.name}</span>
                                    </Link>
                                </Menu.Item>
                            ))}
                        </Menu.SubMenu>
                    ))}
                </Menu>
            </Layout.Sider>
        );
    }
}
