import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
    Input,
} from 'antd';

const FormItem = Form.Item;

class UpdatePwd extends React.Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        handleOk: PropTypes.func.isRequired,
        handleCancel: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.form.validateFields();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        let isRight = true;

        this.props.form.validateFields((err) => {
            if (err) isRight = false;
        });

        if (isRight) this.props.handleOk();
    }

    handleConfirmPassword = (rule, value, callback) => {
        const { getFieldValue } = this.props.form;
        const newPwd = getFieldValue('new');
        if (!newPwd || !value) {
            callback();
        } else if (!Object.is(newPwd, value)) {
            callback(rule.message);
        }
    };

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const {
            visible,
            handleCancel,
            form,
        } = this.props;
        const {
            getFieldDecorator,
        } = form;

        return (
            <Modal
                title="更新密码"
                visible={visible}
                onCancel={handleCancel}
                onOk={this.handleSubmit}
                destroyOnClose
                footer={[
                    <Button key="back" onClick={handleCancel}>取消</Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={this.handleSubmit}
                    >
                        确定
                    </Button>,
                ]}
            >
                <Form layout="horizontal">
                    <FormItem
                        {...formItemLayout}
                        label="原密码"
                    >
                        {
                            getFieldDecorator('old', {
                                rules: [{ required: true, message: '请输入原密码' }],
                            })(<Input type="password" />)
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="新密码"
                    >
                        {
                            getFieldDecorator('new', {
                                rules: [
                                    { required: true, message: '请输入新密码' },
                                    { min: 6, message: '密码最小长度为6位' },
                                ],
                            })(<Input type="password" />)
                        }
                    </FormItem>
                    <FormItem
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
                            })(<Input type="password" />)
                        }
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

export default Form.create()(UpdatePwd);
