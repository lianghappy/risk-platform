import React from 'react';
import { Layout, Form, Icon, Input, Button } from 'antd';
import { connect } from 'dva';
import { Redirect } from 'dva/router';
import CSSModules from 'react-css-modules';
import MD5 from 'utils/MD5';
import styles from './index.scss';
import imgs from '../../assets/images/背景图.svg';
import logoImg from '../../assets/images/logo.svg';
import jimi from '../../assets/images/jimi.svg';

class Login extends React.PureComponent {
  handleSubmit = e => {
      e.preventDefault();
      const { form, login } = this.props;

      form.validateFields((err, { userName, passWord }) => {
          if (!err) {
              login({ account: userName.replace(/(^\s*)|(\s*$)/g, ''), password: MD5(passWord), sysId: 'risk' });
          }
      });
  };
  render() {
      const { getFieldDecorator } = this.props.form;
      const { from } = this.props.location.state || { from: { pathname: '/' } };
      if (this.props.isLogin) {
          return <Redirect to={from} />;
      }

      return (
          <Layout styleName="layout">
              <Layout.Content styleName="content">
                  <div styleName="card">
                      <img src={imgs} alt="背景" styleName="imgs" />
                      <div styleName="logins">
                          <div>
                              <img src={logoImg} alt="logo" styleName="logoImg" />
                              <img src={jimi} alt="logo" styleName="jimiImg" />
                          </div>
                          <div styleName="inputLogin">
                              <span styleName="texts">PLD风控系统</span>
                              <Form layout="horizontal" onSubmit={this.handleSubmit}>
                                  <Form.Item>
                                      {getFieldDecorator('userName', {
                                          rules: [
                                              { required: true, message: '账号不能为空' },
                                              { max: 20, message: '账号最长为20位' },
                                          ],
                                      })(<Input
                                          prefix={<Icon type="user" />}
                                          placeholder="请输入用户名"
                                          autoFocus
                                          className={styles.antinput}
                                      />)}
                                  </Form.Item>
                                  <Form.Item>
                                      {getFieldDecorator('passWord', {
                                          rules: [
                                              { required: true, message: '密码不能为空' },
                                          ],
                                      })(<Input
                                          prefix={<Icon type="lock" />}
                                          type="password"
                                          placeholder="请输入密码"
                                          className={styles.antinput}
                                      />)}
                                  </Form.Item>
                                  <Form.Item>
                                      <Button
                                          type="primary"
                                          htmlType="submit"
                                          styleName="login"
                                          loading={this.props.loading}
                                      >
                                       立即登录
                                      </Button>
                                  </Form.Item>
                              </Form>
                          </div>
                      </div>
                  </div>
                  <p>
                      {this.props.user}
                  </p>
              </Layout.Content>
          </Layout>
      );
  }
}

const mapStateToProps = state => ({
    isLogin: state.session.isLogin,
    loading: state.loading.models.session,
});

const mapDispatchToProps = dispatch => ({
    login: data => {
        dispatch({
            type: 'session/login',
            payload: data,
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CSSModules(Login, styles, { allowMultiple: true })));
