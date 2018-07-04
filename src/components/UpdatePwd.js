import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
    Input,
} from 'antd';
import { connect } from 'dva';
import MD5 from 'utils/MD5';
import { getUserInfo } from 'models/session';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class UpdatePwd extends React.PureComponent {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]).isRequired,
    };

    state = {
        visible: this.props.visible || false,
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { form, userInfo, resetPwd, logout } = this.props;

        form.validateFields((err, { oldPwd, newPwd }) => {
            if (!err) {
                new Promise((resolve) => {
                    resetPwd({
                        data: {
                            id: userInfo.id,
                            oldPwd: MD5(oldPwd),
                            newPwd: MD5(newPwd),
                            userId: userInfo.id,
                        },
                        resolve,
                    });
                }).then(() => {
                    this.handleCancel();
                    sessionStorage.clear();
                    Modal.success({
                        title: '系统提示',
                        content: '密码修改成功，请重新登录！',
                        onOk: () => {
                            logout();
                        },
                    });
                });
            }
        });
    };

    handleConfirmPassword = (rule, value, callback) => {
        const { getFieldValue } = this.props.form;
        const newPwd = getFieldValue('new');
        if (!newPwd || !value) {
            callback();
        } else if (!Object.is(newPwd, value)) {
            callback(rule.message);
        }
    };
    checkPwd = (rule, value, callback) => {
        if (value && value.length > 5 && value.length < 15 && !(/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/.test(value))) {
            callback(rule.message);
        } else {
            callback();
        }
    }
    handleShow = () => {
        this.props.form.validateFields();
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false,
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const { form, children } = this.props;
        const {
            getFieldDecorator,
            getFieldsError,
            getFieldError,
            isFieldTouched,
        } = form;

        const oldError = isFieldTouched('oldPwd') && getFieldError('oldPwd');
        const newError = isFieldTouched('newPwd') && getFieldError('newPwd');
        const confirmError = isFieldTouched('confirm') && getFieldError('confirm');

        return (
            <section>
                <span role="button" tabIndex="0" onClick={this.handleShow}>
                    {children}
                </span>
                <Modal
                    title="更新密码"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onOk={this.handleSubmit}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>取消</Button>,
                        <Button
                            key="submit"
                            type="primary"
                            loading={this.props.loading}
                            disabled={hasErrors(getFieldsError())}
                            onClick={this.handleSubmit}
                        >
                            确定
                        </Button>,
                    ]}
                >
                    <Form layout="horizontal">
                        <Form.Item
                            {...formItemLayout}
                            label="原密码"
                            validateStatus={oldError ? 'error' : ''}
                            help={oldError || ''}
                        >
                            {
                                getFieldDecorator('oldPwd', {
                                    rules: [{ required: true, message: '请输入原密码' }],
                                })(<Input type="password" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="新密码"
                            validateStatus={newError ? 'error' : ''}
                            help={newError || ''}
                        >
                            {
                                getFieldDecorator('newPwd', {
                                    rules: [
                                        { required: true, message: '请输入新密码' },
                                        { min: 6, message: '密码最小长度为6位' },
                                        { max: 15, message: '密码最大长度15位' },
                                        { validator: this.checkPwd, message: '*您输入的密码不符合规则，密码需包含：大写字母、小写字母、数字中的两种' }
                                    ],
                                })(<Input type="password" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="确认密码"
                            validateStatus={confirmError ? 'error' : ''}
                            help={confirmError || ''}
                        >
                            {
                                getFieldDecorator('confirm', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入确认密码',
                                        },
                                        {
                                            validator: this.handleConfirmPassword,
                                            message: '两次输入密码不一致',
                                        },
                                    ],
                                })(<Input type="password" />)
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            </section>
        );
    }
}

const mapStateToProps = (state) => ({
    userInfo: getUserInfo(state),
    loading: state.loading.models.session,
});

const mapDispatchToProps = (dispatch) => ({
    resetPwd: (data) => {
        dispatch({
            type: 'user/resetPwd',
            payload: data,
        });
    },
    logout: () => {
        dispatch({
            type: 'session/logout',
        });
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Form.create()(UpdatePwd));
