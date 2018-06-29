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

const Option = Select.Option;
const { TextArea } = Input;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const mapStateToProps = (state) => ({
    parentlist: state.structure.parentlist,
});
@connect(mapStateToProps)
class AddStruc extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        onOk: PropTypes.func.isRequired,
        record: PropTypes.array.isRequired,
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
                        // Object.assign(values, { pid: record.pid });
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
        new Promise((resolve) => {
            this.props.dispatch({
                type: 'structure/getParentCategory',
                payload: {
                    resolve,
                }
            });
        }).then(() => {
            this.setState({
                visible: true,
            });
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
        const childrens = [];
        if (this.props.parentlist) {
            this.props.parentlist.forEach((item) => {
                childrens.push(<Option value={item.id} key={item.id}>[{item.level}]{item.name}</Option>);
            });
        }
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
                                    initialValue: record.name,
                                    rules: [
                                        { required: true, message: '请输入类别名称' },
                                        { max: 20, message: '最多输入20位' }
                                    ],
                                })(<Input type="acount" placeholder="请输入类别名称" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="父类别"
                        >
                            {
                                getFieldDecorator('pid', {
                                    initialValue: record.pid,
                                })(<Select style={{ width: 150 }} placeholder="请选择">{childrens}<Option value="">无</Option></Select>)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="类别描述"
                        >
                            {
                                getFieldDecorator('describ', {
                                    initialValue: record.describ,
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
export default Form.create()(AddStruc);
