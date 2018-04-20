import React from 'react';
import {
    Dropdown,
    Menu,
    Icon,
} from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import UpdatePwd from 'components/UpdatePwd';
import { getUserName } from 'models/session';

function Header({ userName, logout }) {
    const menu = (
        <Menu>
            <Menu.Item key="password">
                <UpdatePwd visible={false}>修改密码</UpdatePwd>
            </Menu.Item>
            <Menu.Item key="logout">
                <span role="button" tabIndex="-1" onClick={logout}>
                    退出登录
                </span>
            </Menu.Item>
        </Menu>
    );

    return (
        <section style={{ float: 'right', height: '80px' }}>
            <Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" href="">
                    {userName}
                    <Icon type="down" />
                </a>
            </Dropdown>
        </section>
    );
}

Header.propTypes = {
    userName: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    userName: getUserName(state),
});

const mapDispatchToProps = (dispatch) => ({
    logout: () => {
        dispatch({
            type: 'session/logout',
        });
    },
    resetPwd: (data) => {
        dispatch({
            type: 'user/resetPwd',
            payload: data,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
