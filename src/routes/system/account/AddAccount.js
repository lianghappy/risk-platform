import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
    Input,
    Select,
} from 'antd';
import { connect } from 'dva';


function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const Option = Select.Option;
class AddAccount extends React.PureComponent {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]).isRequired,
        dispatch: PropTypes.func.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
    };

    state = {
        visible: this.props.visible || false,
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
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

    handleShow = () => {
        // this.props.form.validateFields();
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
        const forms = this.props.form;
        const { children } = this.props;
        const {
            getFieldDecorator,
            getFieldsError,
        } = forms;
        return (
            <section>
                <span role="button" tabIndex="0" onClick={this.handleShow}>
                    {children}
                </span>
                <Modal
                    title="新增账号"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onOk={this.handleSubmit}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>取消</Button>,
                        <Button
                            key="submit"
                            type="primary"
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
                            label="用户账号"
                        >
                            {
                                getFieldDecorator('acount', {
                                    rules: [
                                        { required: true, message: '请输入用户账号' },
                                        { max: 20, message: '*用户账号最好为姓名全拼，不能输入汉字，最多20个字符' },
                                    ],
                                })(<Input type="acount" placeholder="请输入用户账号" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="用户姓名"
                        >
                            {
                                getFieldDecorator('userName', {
                                    rules: [
                                        { required: true, message: '请输入用户姓名' },
                                    ],
                                })(<Input type="userName" placeholder="请输入用户姓名" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="用户手机号"
                        >
                            {
                                getFieldDecorator('phone', {
                                    rules: [{ required: true, message: '请输入用户手机号' }],
                                })(<Input placeholder="请输入用户手机号" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="公司名称"
                        >
                            {
                                getFieldDecorator('company', {
                                    rules: [{ required: true, message: '请输入公司名称' }],
                                })(<Input placeholder="请输入公司名称" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="密码"
                        >
                            {
                                getFieldDecorator('password', {
                                    rules: [
                                        { required: true, message: '请输入密码' },
                                        { min: 6, message: '密码最小长度为6位' },
                                    ],
                                })(<Input type="password" placeholder="请输入密码" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="确认密码"
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
                                })(<Input type="password" placeholder="请输入确认密码" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="角色名称"
                        >
                            {
                                getFieldDecorator('roleIds', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入确认密码',
                                        },
                                    ],
                                })(<Select defaultValue="请输入角色名称"><Option value="全部">全部</Option><Option value="123" >123</Option></Select>)
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            </section>
        );
    }
}
export default connect()(Form.create()(AddAccount));
