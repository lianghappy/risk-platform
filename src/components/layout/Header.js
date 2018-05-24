import React from 'react';
import {
    Dropdown,
    Menu,
    Icon,
    Breadcrumb,
} from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import UpdatePwd from 'components/UpdatePwd';
import { getUserName } from 'models/session';

function Header({ userName, logout, breadcrumbItems }) {
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
        <section>
            <div className="jm-clearfix" style={{ float: 'right' }}>
                <Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" href="">
                        {userName}
                        <Icon type="down" />
                    </a>
                </Dropdown>
            </div>
            <Breadcrumb separator=">">
                {
                    breadcrumbItems.map((name, index) => (
                        <Breadcrumb.Item key={index + name}>
                            {name}
                        </Breadcrumb.Item>
                    ))
                }
            </Breadcrumb>
        </section>
    );
}

Header.propTypes = {
    userName: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
    breadcrumbItems: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    userName: getUserName(state),
    breadcrumbItems: state.common.breadcrumbItems,
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
