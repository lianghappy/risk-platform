import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
    Input,
    Select,
    Tooltip,
    Icon,
    message,
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
    };
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
                if (values && Number(values.weight) > 100) {
                    message.error('输入权重不能超过100');
                    return;
                }
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
    checkNum = (rule, value, callback) => {
        if (value && value.length > 0 && !(/^[0-9]*$/).test(value)) {
            callback(rule.message);
        } else {
            callback();
        }
    }
    checkRecord = (rule, value, callback) => {
        if (value && value.length > 0 && !(/^[0-9]*$/).test(value)) {
            callback(rule.message);
        } else {
            callback();
        }
    }
    checkType = (num) => {
        let name = '';
        switch (Number(num)) {
        case 1:
            name = '最坏匹配';
            break;
        case 2:
            name = '权重匹配';
            break;
        case 3:
            name = '最好匹配';
            break;
        case 4:
            name = '预阶段';
            break;
        default:
            break;
        }
        return name;
    }
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
                                        { max: 20, message: '最多20位' },
                                        { validator: this.checkNum, message: '请输入数字' }
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
                                            initialValue: record.type !== undefined
                                                ? record.type : '1',
                                            setFieldsValue: '1',
                                        })(
                                            <Select onSelect={this.onSelect} defaultValue="1">
                                                <Option value="1">最坏匹配</Option>
                                                <Option value="2">权重匹配</Option>
                                                <Option value="3">最好匹配</Option>
                                                <Option value="4">预阶段</Option>
                                            </Select>
                                        )
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
                                        })(<span>{this.checkType(record.type)}</span>)
                                    }
                                </Form.Item>
                        }
                        <Form.Item
                            {...formItemLayout}
                            label={(
                                <span>
                                    skip&nbsp;
                                    <Tooltip title="即使命中该阶段，仍然会执行下一阶段。">
                                        <Icon type="question-circle-o" />
                                    </Tooltip>
                                </span>
                            )}
                        >
                            {
                                getFieldDecorator('resultSkip', {
                                    initialValue: record.resultSkip !== undefined
                                        ? record.resultSkip : '1',
                                    rule: [
                                        {
                                            required: true,
                                            message: '请选择skip'
                                        }
                                    ]
                                })(
                                    <Select onSelect={this.onSelect} defaultValue="1">
                                        <Option value="1">是</Option>
                                        <Option value="0">否</Option>
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="阶段结果优先级"
                        >
                            {
                                getFieldDecorator('resultLevel', {
                                    initialValue: record.resultLevel !== undefined
                                        ? record.type : '',
                                    rules: [
                                        { required: true, message: '请输入阶段阶段结果优先级' },
                                        { validator: this.checkRecord, message: '请输入数字' }
                                    ],
                                })(
                                    <Input />
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="权重"
                        >
                            {
                                getFieldDecorator('weight', {
                                    initialValue: record.weight !== undefined ? record.weight / 100 : '',
                                    rules: [
                                        { required: true, message: '请输入阶段权重' },
                                        { validator: this.checkRecord, message: '请输入数字' }
                                    ],
                                })(<Input type="acount" placeholder="请输入阶段权重" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="阶段描述"
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
