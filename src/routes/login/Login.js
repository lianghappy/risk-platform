import React from 'react';
import { Layout, Form, Icon, Input, Button, Card } from 'antd';
import { connect } from 'dva';
import { Redirect } from 'dva/router';
import CSSModules from 'react-css-modules';
import MD5 from 'utils/MD5';
import styles from './index.scss';

class Login extends React.PureComponent {
  handleSubmit = e => {
      e.preventDefault();
      const { form, login } = this.props;

      form.validateFields((err, { userName, passWord }) => {
          if (!err) {
              login({ userName, passWord: MD5(passWord) });
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
                  <Card title="登录" styleName="card">
                      <Form layout="horizontal" onSubmit={this.handleSubmit}>
                          <Form.Item>
                              {getFieldDecorator('userName', {
                                  rules: [{ required: true, message: '请输入用户名' }],
                              })(<Input
                                  prefix={<Icon type="user" />}
                                  placeholder="请输入用户名"
                                  autoFocus
                              />)}
                          </Form.Item>
                          <Form.Item>
                              {getFieldDecorator('passWord', {
                                  rules: [{ required: true, message: '请输入密码' }],
                              })(<Input
                                  prefix={<Icon type="lock" />}
                                  type="password"
                                  placeholder="请输入用户名"
                              />)}
                          </Form.Item>
                          <Form.Item>
                              <Button
                                  type="primary"
                                  htmlType="submit"
                                  styleName="login"
                                  loading={this.props.loading}
                              >
                  登陆
                              </Button>
                          </Form.Item>
                      </Form>
                  </Card>
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
