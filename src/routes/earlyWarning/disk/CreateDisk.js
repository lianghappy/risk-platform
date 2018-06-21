import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
    Input,
} from 'antd';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
@Form.create()
export default class CreateDisk extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        onOk: PropTypes.func.isRequired,
    };
    state = {
        visible: false,
    }
    handleShow = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
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

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const {
            form,
            children,
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
                    title="创建监控大盘"
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
                            创建
                        </Button>,
                    ]}
                >
                    <Form layout="horizontal">
                        <Form.Item
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator('dashBoardName', {
                                    rules: [
                                        { required: true, message: '请输入新建监控大盘名称' },
                                        { validator: this.phoneCheck, message: '请输入新建监控大盘名称' }
                                    ],
                                })(<Input placeholder="请输入新建监控大盘名称" />)
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            </span>
        );
    }
}
