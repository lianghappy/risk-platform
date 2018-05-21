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
import { SYSID } from 'utils/constants';
import MD5 from 'utils/MD5';


function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const Option = Select.Option;
class AddAccount extends React.PureComponent {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]).isRequired,
        onOk: PropTypes.func.isRequired,
        type: PropTypes.string.isRequired,
        record: PropTypes.object.isRequired,
        visible: PropTypes.bool.isRequired,
    };

    state = {
        visible: this.props.visible || false,
    };
    handleSubmit = (e) => {
        e.preventDefault();
        const {
            form,
            record,
            type,
            onOk,
        } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => {
                    if (type === 'edit') {
                        Object.assign(values, { id: record.id });
                    }
                    Object.assign(values, { userName: values.name });
                    Object.assign(values, { sysId: SYSID });
                    Object.assign(values, { type });
                    Object.assign(values, { state: false });
                    Object.assign(values, { password: MD5(values.password) });
                    Object.assign(values, { confirm: MD5(values.confirm) });
                    Object.assign(values, { roleIds: [values.roleIds] });
                    onOk(values, resolve);
                }).then(() => {
                    this.handleCancel();
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
                                })(<Input placeholder="请输入用户账号" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="用户姓名"
                        >
                            {
                                getFieldDecorator('name', {
                                    rules: [
                                        { required: true, message: '请输入用户姓名' },
                                    ],
                                })(<Input placeholder="请输入用户姓名" />)
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
                                getFieldDecorator('company')(<Input placeholder="请输入公司名称" />)
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
                                })(<Select>
                                    {
                                        this.props.roleNameList.map((item) => {
                                            return (
                                                <Option key={item.id} value={item.id}>{item.roleName}</Option>
                                            );
                                        })
                                    }
                                   </Select>)
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            </section>
        );
    }
}
const mapStateToProps = (state) => ({
    roleNameList: state.account.roleNameList,
});
export default connect(mapStateToProps)(Form.create()(AddAccount));
