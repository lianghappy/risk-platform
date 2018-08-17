import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
    Input,
    Select,
    DatePicker,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';


function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const Option = Select.Option;
const mapStateToProps = (state) => ({
    typeList: state.thirdParty.typeList,
});
@connect(mapStateToProps)
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
            onOk,
        } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => {
                    if (values && values.releaseDate) {
                        Object.assign(values, { releaseDate: moment(values.releaseDate._d).format('X') });
                    }
                    if (values && values.startDate) {
                        Object.assign(values, { startDate: moment(values.startDate._d).format('X') });
                    }
                    if (values && values.endDate) {
                        Object.assign(values, { endDate: moment(values.endDate._d).format('X') });
                    }
                    Object.assign(values, {
                        price: ((values.price) * 1000) / 10,
                        rental: ((values.rental) * 1000) / 10
                    });
                    onOk(values, resolve);
                }).then(() => {
                    this.handleCancel();
                });
            }
        });
    };

    checkNum = (rule, value, callback) => {
        if (value && (!/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value))) {
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
        const {
            children,
            typeList,
        } = this.props;
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
                                    rules: [
                                        { required: true, message: '请选择三方数据源' },
                                    ],
                                })(
                                    <Select>
                                        {
                                            typeList.map((item) => {
                                                return (<Option value={item.code} key={item.code}>{item.name}</Option>);
                                            })
                                        }
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="服务名称"
                        >
                            {
                                getFieldDecorator('productName', {
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
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入价格',
                                        },
                                        {
                                            max: 20,
                                            message: '字段超长',
                                        },
                                        { validator: this.checkNum, message: '请输入有效数值，支持两位小数' },
                                    ],
                                })(<Input placeholder="请输入价格" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="总金额"
                        >
                            {
                                getFieldDecorator('rental', {
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
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择签约日',
                                        },
                                    ],
                                })(
                                    <DatePicker />
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="签约日"
                        >
                            {
                                getFieldDecorator('startDate', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择签约日',
                                        },
                                    ],
                                })(
                                    <DatePicker />
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="到期日"
                        >
                            {
                                getFieldDecorator('endDate', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择到期日',
                                        },
                                    ],
                                })(
                                    <DatePicker />
                                )
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            </span>
        );
    }
}

