import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
    Input,
    Select,
    InputNumber,
} from 'antd';
import { connect } from 'dva';

const { TextArea } = Input;
const Option = Select.Option;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class AddStrategy extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        onOk: PropTypes.func.isRequired,
        record: PropTypes.object.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]).isRequired,
        type: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    };
    state = {
        visible: this.props.visible || false,
        title: this.props.title === 'add' ? '新增阶段' : '更新阶段',
        type: Number(this.props.type),
    };
    onSelect = (value) => {
        this.setState({
            type: Number(value),
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {
            form,
            record,
            title,
            onOk,
        } = this.props;
        const that = this;
        form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => {
                    if (title === 'edit') {
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
        console.log(this.state.title);
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
                    width={800}
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
                            label="阶段排序"
                        >
                            {
                                getFieldDecorator('sort', {
                                    initialValue: record.sort,
                                    rules: [
                                        { required: true, message: '请输入阶段排序的序号' },
                                    ],
                                })(<Input type="acount" placeholder="请输入阶段排序的序号" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="阶段名称"
                        >
                            {
                                getFieldDecorator('name', {
                                    initialValue: record.name,
                                    rules: [
                                        { required: true, message: '请输入阶段名称' },
                                        { max: 20, message: '阶段名称最多20个字' },
                                    ],
                                })(<Input type="acount" placeholder="请输入阶段名称" />)
                            }
                        </Form.Item>
                        {
                            this.props.title === 'add' ?
                                <Form.Item
                                    {...formItemLayout}
                                    label="阶段模式"
                                >
                                    {
                                        getFieldDecorator('type', {
                                            initialValue: record.type,
                                            setFieldsValue: '1',
                                        })(<Select onSelect={this.onSelect}><Option value="1">最坏匹配</Option><Option value="2">权重匹配</Option></Select>)
                                    }
                                </Form.Item>
                                :
                                <Form.Item
                                    {...formItemLayout}
                                    label="阶段模式"
                                >
                                    {
                                        getFieldDecorator('type', {
                                            initialValue: record.type,
                                            setFieldsValue: '1',
                                        })(<span>{Number(record.type) === 1 ? '最坏匹配' : '权重匹配'}</span>)
                                    }
                                </Form.Item>
                        }
                        {
                            Number(this.state.type) === 2 ?
                                <Form.Item
                                    {...formItemLayout}
                                    label="风险阈值"
                                >
                                    <div>
                                        <span>-∝&lt;   拒绝 ≤ </span>
                                        {
                                            getFieldDecorator('refuseScore', {
                                                initialValue: record.refuseScore,
                                                rules: [
                                                    { required: true, message: '请输入拒绝分数' },
                                                ],
                                            })(<InputNumber width={50} />)
                                        }
                                        <span> &lt;   需人审  ≤ </span>
                                        {
                                            getFieldDecorator('passScore', {
                                                initialValue: record.passScore,
                                                rules: [
                                                    { required: true, message: '请输入通过分数' },
                                                ],
                                            })(<InputNumber width={50} />)
                                        }
                                        <span>&lt;   通过  ≤</span>
                                    </div>
                                </Form.Item>
                                :
                                null
                        }
                        <Form.Item
                            {...formItemLayout}
                            label="权重"
                        >
                            {
                                getFieldDecorator('weight', {
                                    initialValue: record.weight,
                                    rules: [
                                        { required: true, message: '请输入阶段权重' },
                                    ],
                                })(<Input type="acount" placeholder="请输入阶段权重" />)
                            }
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
export default connect()(Form.create()(AddStrategy));
