import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
    Input,
    Select,
    message,
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
        const userId = JSON.parse(sessionStorage.userInfo).user.id;
        form.validateFields((err, values) => {
            if (!err) {
                if (values.password !== values.confirm) {
                    message.error('两次输入密码不一致');
                } else {
                    new Promise(resolve => {
                        if (type === 'edit') {
                            Object.assign(values, { id: record.id });
                            if (values.password === 'xxxxxx1') {
                                Object.assign(values, { password: this.props.getPassword });
                                Object.assign(values, { confirm: this.props.getPassword });
                            } else {
                                Object.assign(values, { password: MD5(values.password) });
                                Object.assign(values, { confirm: MD5(values.confirm) });
                            }
                            Object.assign(values, { state: record.state });
                        } else {
                            Object.assign(values, { password: MD5(values.password) });
                            Object.assign(values, { confirm: MD5(values.confirm) });
                            Object.assign(values, { state: false });
                        }
                        Object.assign(values, { userId });
                        Object.assign(values, { account: values.acount.replace(/(^s*)|(s*$)/g, '') });
                        Object.assign(values, { userName: values.name, realName: values.name });
                        Object.assign(values, { sysId: SYSID });
                        Object.assign(values, { type });
                        Object.assign(values, { roleIds: [values.roleIds] });
                        onOk(values, resolve);
                    }).then(() => {
                        this.handleCancel();
                    });
                }
            }
        });
    };

    handleConfirmPassword = (rule, value, callback) => {
        const { getFieldValue } = this.props.form;
        const newPwd = getFieldValue('password');
        if (!newPwd || !value) {
            callback();
        } else if (!Object.is(newPwd, value)) {
            callback(rule.message);
        } else {
            callback();
        }
    };

    phoneCheck = (rule, value, callback) => {
        if (value && value.length > 0 && !(/\d{11}/.test(value))) {
            callback(rule.message);
        } else {
            callback();
        }
    }
    validateAccount = (rule, value, callback) => {
        if (value && value.length > 0 && value.length < 21 && (/[\u4e00-\u9fa5]$/.test(value))) {
            callback(rule.message);
        } else {
            callback();
        }
    }
    checkPwd = (rule, value, callback) => {
        if (value && value.length > 5 && value.length < 15 && !(/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/.test(value))) {
            callback(rule.message);
        } else {
            callback();
        }
    }
    handleShow = () => {
        // this.props.form.validateFields();s
        if (this.props.type === 'edit') {
            const { record } = this.props;
            this.props.dispatch({
                type: 'account/getPassword',
                payload: {
                    userId: record.id,
                    sysId: SYSID,
                }
            });
        }
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
        const { children, record } = this.props;
        const {
            getFieldDecorator,
            getFieldsError,
        } = forms;
        let rolesId = '';
        if (record.roles) {
            rolesId = record.roles[0].roleId;
        }
        return (
            <span>
                <span role="button" tabIndex="0" onClick={this.handleShow}>
                    {children}
                </span>
                <Modal
                    title={this.props.type === 'add' ? '新增账号' : '更新账号'}
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
                                    initialValue: record.account,
                                    rules: [
                                        { required: true, message: '请输入用户账号' },
                                        { max: 20, message: '*用户账号最多20个字符' },
                                        { validator: this.validateAccount, message: '*用户账号最好为姓名全拼，不能输入汉字' }
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
                                    initialValue: record.userName,
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
                                    initialValue: record.phone,
                                    rules: [
                                        { required: true, message: '请输入用户手机号' },
                                        { validator: this.phoneCheck, message: '请输入正确的手机号' }
                                    ],
                                })(<Input placeholder="请输入用户手机号" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="密码"
                        >
                            {
                                getFieldDecorator('password', {
                                    initialValue: this.props.type === 'edit' ? this.props.getPassword && 'xxxxxx1' : '',
                                    rules: [
                                        { required: true, message: '请输入密码' },
                                        { min: 6, message: '密码最小长度为6位' },
                                        { max: 15, message: '密码最大长度15位' },
                                        { validator: this.checkPwd, message: '*您输入的密码不符合规则，密码需包含：大写字母、小写字母、数字中的两种' }
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
                                    initialValue: this.props.type === 'edit' ? this.props.getPassword && 'xxxxxx1' : '',
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
                                    initialValue: rolesId,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择角色名称',
                                        },
                                    ],
                                })(
                                    <Select>
                                        {
                                            this.props.roleNameList.map((item) => {
                                                return (
                                                    <Option key={item.id} value={item.id}>{item.roleName}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            </span>
        );
    }
}
const mapStateToProps = (state) => ({
    roleNameList: state.account.roleNameList,
    getPassword: state.account.getPassword,
});
export default connect(mapStateToProps)(Form.create()(AddAccount));
