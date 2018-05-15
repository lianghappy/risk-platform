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
        category: PropTypes.array.isRequired,
    };
    state = {
        visible: this.props.visible || false,
        title: this.props.title === 'add' ? '新增' : '更新',
        category: this.props.category,
        // type: this.props.type,
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps) {
            this.setState({
                category: nextProps.category,
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
        const {
            form,
            children,
            record,
        } = this.props;
        const {
            getFieldDecorator,
            getFieldsError,
        } = form;
        const options = [];
        this.state.category.forEach((item) => {
            options.push(<Option value={item.id} key={item.id}>{item.name}</Option>);
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
                                    initialValue: record.phone,
                                    rules: [
                                        { required: true, message: '请输入用户手机号' },
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
                                    initialValue: record.idCardName,
                                    rules: [
                                        { required: true, message: '请输入用户姓名' },
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
                                    initialValue: record.idCard,
                                    rules: [
                                        { required: true, message: '请输入用户身份证' },
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
                                    initialValue: record.categoryId,
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
                                    initialValue: record.channelId,
                                    rules: [
                                        { required: true, message: '请输入名单来源' },
                                    ],
                                })(<Select>{options}</Select>)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="用户描述"
                        >
                            {
                                getFieldDecorator('description', {
                                    initialValue: record.describ,
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
export default connect()(Form.create()(AddModal));
