import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
    Input,
    Select,
} from 'antd';
// import { connect } from 'dva';


function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const Option = Select.Option;
// const mapStateToProps = (state) => ({
//     // roleNameList: state.account.roleNameList,
// });
// @connect(mapStateToProps)
@Form.create()
export default class AddModal extends React.PureComponent {
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
                    onOk(values, resolve);
                }).then(() => {
                    this.handleCancel();
                });
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
        if (value.length > 0 && !(/\d{11}/.test(value))) {
            callback(rule.message);
        } else {
            callback();
        }
    }
    validateAccount = (rule, value, callback) => {
        if (value.length > 0 && value.length < 21 && (/[\u4e00-\u9fa5]$/.test(value))) {
            callback(rule.message);
        } else {
            callback();
        }
    }
    checkPwd = (rule, value, callback) => {
        if (value.length > 5 && value.length < 16 && !(/^(?![A-Z]+$)(?![a-z]+$)(?!\d+$)(?![\W_]+$)\S+$/.test(value))) {
            callback(rule.message);
        } else {
            callback();
        }
    }
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
        const { children, record } = this.props;
        const {
            getFieldDecorator,
            getFieldsError,
        } = forms;
        return (
            <span>
                <span role="button" tabIndex="0" onClick={this.handleShow}>
                    {children}
                </span>
                <Modal
                    title="新增"
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
                            提交
                        </Button>,
                    ]}
                >
                    <Form layout="horizontal">
                        <Form.Item
                            {...formItemLayout}
                            label="三方数据源"
                        >
                            {
                                getFieldDecorator('thirdparty', {
                                    initialValue: record.account,
                                    rules: [
                                        { required: true, message: '请选择三方数据源' },
                                    ],
                                })(<Input placeholder="请选择三方数据源" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="产品名称"
                        >
                            {
                                getFieldDecorator('productName', {
                                    initialValue: record.userName,
                                    rules: [
                                        { required: true, message: '请输入产品名称' },
                                        { max: 20, message: '最多20位' }
                                    ],
                                })(<Input placeholder="请输入产品名称" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="是否免费"
                        >
                            {
                                getFieldDecorator('isFree', {
                                    initialValue: '1',
                                    rules: [
                                        { required: true, message: '请选择是否免费' },
                                    ],
                                })(
                                    <Select>
                                        <Option value="1">免费</Option>
                                        <Option value="0">付费</Option>
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="查询/查得"
                        >
                            {
                                getFieldDecorator('costType', {
                                    initialValue: record.password,
                                    rules: [
                                        { required: true, message: '请选择查询/查得' },
                                    ],
                                })(
                                    <Select>
                                        <Option value="1">查得</Option>
                                        <Option value="2">查询</Option>
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="收费方式"
                        >
                            {
                                getFieldDecorator('chargeType', {
                                    initialValue: record.password,
                                    rules: [
                                        { required: true, message: '请选择收费方式' },
                                    ],
                                })(
                                    <Select>
                                        <Option value="1">按次收费</Option>
                                        <Option value="2">按月计费</Option>
                                        <Option value="3">按年计费</Option>
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="价格"
                        >
                            {
                                getFieldDecorator('price', {
                                    initialValue: record.password,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入价格',
                                        },
                                        {
                                            validator: this.handleConfirmPassword,
                                            message: '两次输入密码不一致',
                                        },
                                    ],
                                })(<Input type="password" placeholder="请输入价格" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="总金额"
                        >
                            {
                                getFieldDecorator('rental', {
                                    initialValue: record.role,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入总金额',
                                        },
                                    ],
                                })(
                                    <Input placeholder="请输入总金额" />
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="上线日"
                        >
                            {
                                getFieldDecorator('releaseDate', {
                                    initialValue: record.role,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择签约日',
                                        },
                                    ],
                                })(
                                    <Input />
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="签约日"
                        >
                            {
                                getFieldDecorator('startDate', {
                                    initialValue: record.role,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择签约日',
                                        },
                                    ],
                                })(
                                    <Input />
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="到期日"
                        >
                            {
                                getFieldDecorator('endDate', {
                                    initialValue: record.role,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择到期日',
                                        },
                                    ],
                                })(
                                    <Input />
                                )
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            </span>
        );
    }
}

