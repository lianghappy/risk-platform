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


function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const Option = Select.Option;
const { TextArea } = Input;
class AddStruc extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        onOk: PropTypes.func.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]).isRequired,
        type: PropTypes.string.isRequired,
        parent: PropTypes.array.isRequired,
    };
    state = {
        visible: this.props.visible || false,
        title: this.props.type === 'add' ? '新增类别' : '更新类别',
        parent: this.props.parent,
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
        console.log(this.state.parent);
        const options = this.state.parent ? this.state.parent.forEach((item) => {
            return (
                <Option value={item.id}>{item.name}</Option>
            );
        }) : null;
        return (
            <section>
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
                            label="类别名称"
                        >
                            {
                                getFieldDecorator('name', {
                                    rules: [
                                        { required: true, message: '请输入类别名称' },
                                    ],
                                })(<Input type="acount" placeholder="请输入类别名称" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="父类别"
                        >
                            {
                                getFieldDecorator('pid')(<Select style={{ width: 150 }} placeholder="请选择">{options}</Select>)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="类别描述"
                        >
                            {
                                getFieldDecorator('describ', {
                                    rules: [{ required: true, message: '请输入描述内容' },
                                        { max: 100, message: '描述内容最多100个字' }],
                                })(<TextArea height={100} placeholder="请输入描述内容" />)
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            </section>
        );
    }
}
export default connect()(Form.create()(AddStruc));
