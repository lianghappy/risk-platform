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

const { TextArea } = Input;
const Option = Select.Option;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const mapStateToProps = (state) => {
    return {
        getBAW: state.bAWCommon.getBAW
    };
};
@connect(mapStateToProps)
class AddModal extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        onOk: PropTypes.func.isRequired,
        record: PropTypes.object.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]).isRequired,
        type: PropTypes.string.isRequired,
        rosterType: PropTypes.array.isRequired,
        rosterChannel: PropTypes.array.isRequired,
        bAWCommon: PropTypes.object.isRequired,
    };
    state = {
        visible: this.props.visible || false,
        title: this.props.type === 'add' ? '新增' : '更新',
        rosterType: this.props.rosterType,
        rosterChannel: this.props.rosterChannel,
        bAWCommon: {},
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.setState({
                rosterType: nextProps.rosterType,
                rosterChannel: nextProps.rosterChannel,
            });
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {
            form,
            record,
            onOk,
            type,
        } = this.props;
        const that = this;
        form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => {
                    if (type === 'edit') {
                        Object.assign(values, { id: record.id });
                    }
                    values.title = that.props.title;
                    onOk(values, resolve);
                }).then(() => {
                    this.handleCancel();
                });
            }
        });
    };
    handleShow = () => {
        const {
            dispatch,
            record,
        } = this.props;
        if (record.id) {
            new Promise((resolve) => {
                dispatch({
                    type: 'bAWCommon/getBAW',
                    payload: {
                        id: record.id,
                        resolve,
                    }
                });
            }).then(() => {
                this.setState({
                    bAWCommon: this.props.getBAW,
                    visible: true,
                });
            });
        } else {
            this.setState({
                bAWCommon: {},
                visible: true,
            });
        }
    };

    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false,
        });
    };
    phoneCheck = (rule, value, callback) => {
        if (value && value.length > 0 && !(/^1[0-9]{10}$/.test(value))) {
            callback(rule.message);
        } else {
            callback();
        }
    }
    identityCheck = (rule, value, callback) => {
        if (value && value.length > 0 && ((/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) || (/^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/.test(value)))) {
            callback();
        } else if (value && value.length > 0) {
            callback(rule.message);
        } else {
            callback();
        }
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const {
            form,
            children,
        } = this.props;
        const { bAWCommon } = this.state;
        const {
            getFieldDecorator,
            getFieldsError,
        } = form;
        const options = [];
        const rosterChannel = [];
        this.state.rosterType.forEach((item) => {
            options.push(<Option value={item.id} key={item.id}>{item.name}</Option>);
        });
        this.state.rosterChannel.forEach((item) => {
            rosterChannel.push(<Option value={item.id} key={item.id}>{item.name}</Option>);
        });
        return (
            <span>
                <span role="button" tabIndex="0" onClick={this.handleShow}>
                    {children}
                </span>
                <Modal
                    title={this.state.title}
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
                            label="用户手机号"
                        >
                            {
                                getFieldDecorator('phone', {
                                    initialValue: bAWCommon && bAWCommon.phone,
                                    rules: [
                                        { required: true, message: '请输入用户手机号' },
                                        { max: 11, message: '最多11位' },
                                        { validator: this.phoneCheck, message: '请输入正确的手机号' }
                                    ],
                                })(<Input placeholder="请输入用户手机号" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="用户姓名"
                        >
                            {
                                getFieldDecorator('idCardName', {
                                    initialValue: bAWCommon && bAWCommon.idCardName,
                                    rules: [
                                        { required: true, message: '请输入用户姓名' },
                                        { max: 20, message: '最多20位' }
                                    ],
                                })(<Input placeholder="请输入用户姓名" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="用户身份证"
                        >
                            {
                                getFieldDecorator('idCard', {
                                    initialValue: bAWCommon && bAWCommon.idCard,
                                    rules: [
                                        { required: true, message: '请输入用户身份证' },
                                        { validator: this.identityCheck, message: '请输入正确的用户身份证' }
                                    ],
                                })(<Input placeholder="请输入用户身份证" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="名单分类"
                        >
                            {
                                getFieldDecorator('categoryId', {
                                    initialValue: bAWCommon && bAWCommon.categoryId,
                                    rules: [
                                        { required: true, message: '请输入名单分类' },
                                    ],
                                })(<Select>{options}</Select>)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="名单来源"
                        >
                            {
                                getFieldDecorator('channelId', {
                                    initialValue: bAWCommon && bAWCommon.channelId,
                                    rules: [
                                        { required: true, message: '请输入名单来源' },
                                    ],
                                })(<Select>{rosterChannel}</Select>)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="用户描述"
                        >
                            {
                                getFieldDecorator('description', {
                                    initialValue: bAWCommon && bAWCommon.description,
                                    rules: [{ required: true, message: '请描述该策略的内容及业务上的使用场景' },
                                        { max: 100, message: '描述内容最多100个字' }],
                                })(<TextArea height={100} placeholder="请描述该策略的内容及业务上的使用场景" />)
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            </span>
        );
    }
}
export default Form.create()(AddModal);
