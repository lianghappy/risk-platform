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
const { TextArea } = Input;
// const mapStateToProps = (state) => ({
//     // roleNameList: state.account.roleNameList,
// });
// @connect(mapStateToProps)
@Form.create()
export default class PolicyModal extends React.PureComponent {
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
        // const userId = JSON.parse(sessionStorage.userInfo).user.id;
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
                            确定
                        </Button>,
                    ]}
                >
                    <Form layout="horizontal">
                        <Form.Item
                            {...formItemLayout}
                            label="灰度策略名称"
                        >
                            {
                                getFieldDecorator('grayStrategyName', {
                                    initialValue: record.grayStrategyName,
                                    rules: [
                                        { required: true, message: '请输入灰度策略名称' },
                                    ],
                                })(<Input placeholder="请输入灰度策略名称" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="备注"
                        >
                            {
                                getFieldDecorator('remark', {
                                    initialValue: record.remark,
                                })(<TextArea placeholder="请输入灰度策略名称" />)
                            }
                        </Form.Item>
                        <Form.Item>
                            <span>添加策略</span>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="策略名称"
                        >
                            {
                                getFieldDecorator('strategyName', {
                                    rules: [
                                        { required: true, message: '请输入策略名称' },
                                    ],
                                })(
                                    <Select>
                                        <Option value="">策略</Option>
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="策略占比"
                        >
                            {
                                getFieldDecorator('ratio', {
                                    rules: [
                                        { required: true, message: '请输入策略占比' },
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

