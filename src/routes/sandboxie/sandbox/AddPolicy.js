import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
    Input,
    message,
} from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class AddPolicy extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        onOk: PropTypes.func.isRequired,
        record: PropTypes.object.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]).isRequired,
        type: PropTypes.string.isRequired,
    };
    state = {
        visible: this.props.visible || false,
        title: this.props.type === 'add' ? '新增策略' : '更新策略',
    };
    handleSubmit = (e) => {
        e.preventDefault();
        const {
            form,
            record,
            type,
            onOk,
        } = this.props;
        const that = this;
        form.validateFields((err, values) => {
            if (!err) {
                if (Number(values.refuseScore) < Number(values.passScore) || Number(values.refuseScore) < Number(values.passScore)) {
                    new Promise(resolve => {
                        if (type === 'edit' || type === 'clone') {
                            Object.assign(values, { isEnable: record.isEnable });
                            Object.assign(values, { id: record.id });
                        }
                        values.type = that.props.type;
                        onOk(values, resolve);
                    }).then(() => {
                        this.handleCancel();
                    });
                } else {
                    message.error('通过分大于等于拒绝分');
                }
            }
        });
    };

    handleShow = () => {
        // this.props.form.validateFields();
        this.setState({
            visible: true,
        });
    };
    checkNum = (rule, value, callback) => {
        if (value && value.length > 0 && !(/^[0-9]*$/.test(value))) {
            callback(rule.message);
        } else {
            callback();
        }
    }
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
                    width="60%"
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
                            label="策略名称"
                        >
                            {
                                getFieldDecorator('name', {
                                    initialValue: record.name,
                                    rules: [
                                        { required: true, message: '请输入策略名称' },
                                        { max: 20, message: '策略名称最多20位' },
                                    ],
                                })(<Input type="acount" placeholder="请输入策略名称" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="风险阈值"
                        >
                            <div>
                                <span>-∞&lt;   拒绝 &lt; </span>
                                {
                                    getFieldDecorator('refuseScore', {
                                        initialValue: record.refuseScore,
                                        rules: [
                                            { required: true, message: '请输入拒绝分数' },
                                            { validator: this.checkNum, message: '请输入数字' }
                                        ],
                                    })(<Input style={{ width: '50px' }} />)
                                }
                                <span> ≤   需人审  &lt; </span>
                                {
                                    getFieldDecorator('passScore', {
                                        initialValue: record.passScore,
                                        rules: [
                                            { required: true, message: '请输入通过分数' },
                                        ],
                                    })(<Input style={{ width: '50px' }} />)
                                }
                                <span>≤   通过  &lt; +∞</span>
                            </div>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="策略描述"
                        >
                            {
                                getFieldDecorator('describ', {
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
export default connect()(Form.create()(AddPolicy));
