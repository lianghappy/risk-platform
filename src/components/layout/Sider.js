import React from 'react';
import { connect } from 'dva';
import { Layout, Menu } from 'antd';
import { Link } from 'dva/router';
import PropTypes from 'prop-types';
import cs from 'classnames';
import { authss } from 'utils/auth';
import { menuKeyPick } from 'utils/common';
import styles from './Sider.scss';
import logo from '../../assets/images/机蜜logo.svg';

const mapStateToProps = state => ({
    auths: state.session.menus
});
@connect(mapStateToProps)
export default class Sider extends React.PureComponent {
    static propTypes = {
        auths: PropTypes.array.isRequired,
        location: PropTypes.object.isRequired
    };
    render() {
        const { auths, location } = this.props;
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
                    style={{ userSelect: "none" }}
                >
                    {authss(auths).map(m => (
                        <Menu.SubMenu
                            key={m.key}
                            title={
                                <span>
                                    <i
                                        className={cs(
                                            "jm-icon",
                                            "anticon",
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
