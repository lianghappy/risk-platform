import React from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';

const compareSymbol = ['<', '>', '=', '<=', '>=', '<>'];

@connect((state) => ({
    loading: state.loading.effects['regular/update'] || state.loading.effects['regular/clone'] || false,
    channels: state.regular.channels,
}))
@Form.create()
export default class RegularEdit extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        record: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        onOk: PropTypes.func.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]).isRequired,
        stageType: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
    };

    state = {
        visible: false,
        title: this.props.type === 'update' ? '编辑规则' : '克隆规则',
    };

    showModelHandler = () => {
        if (this.props.disabled) return;
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
    checkChannel = (code) => {
        let name = '';
        this.props.channels.forEach(item => {
            if (item.code === code) {
                name = item.name;
            }
        });
        return name;
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {
            form,
            record,
            type,
            onOk,
        } = this.props;
        const {
            createTime,
            updateTime,
            stageId,
            ...oldValue
        } = record;

        form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => {
                    onOk(type, {
                        ...oldValue,
                        ...values
                    }, resolve);
                }).then(() => {
                    this.handleCancel();
                });
            }
        });
    };

    render() {
        const {
            children,
            form,
            record,
            loading,
            stageType,
        } = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };

        return (
            <span>
                <span
                    role="button"
                    tabIndex="-1"
                    onClick={this.showModelHandler}
                >
                    { children }
                </span>
                <Modal
                    title={this.state.title}
                    width={600}
                    visible={this.state.visible}
                    confirmLoading={loading}
                    onCancel={this.handleCancel}
                    onOk={this.handleSubmit}
                >
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item
                            {...formItemLayout}
                            label="规则类型"
                        >
                            <span>{record.categoryName}</span>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="规则名称"
                        >
                            {
                                getFieldDecorator('name', {
                                    initialValue: record.name,
                                    rules: [{ required: true, message: '请输入规则名称' }],
                                })(<Input />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="风险代码"
                        >
                            <span>{record.code}</span>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="规则来源"
                        >
                            <span>{this.checkChannel(record.channel)}</span>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="规则值类型"
                        >
                            <span>{record.valueType}</span>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="判定规则key"
                        >
                            <span>{record.judgeKey}</span>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="判定符号"
                        >
                            {
                                getFieldDecorator('compareSymbol', {
                                    initialValue: record.compareSymbol,
                                    rules: [{ required: true, message: '请选择判断符号' }],
                                })(
                                    <Select>
                                        {compareSymbol.map(item => (
                                            <Select.Option
                                                value={item}
                                                key={item}
                                            >
                                                {item}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="判定阈值"
                        >
                            {
                                getFieldDecorator('judgeValue', {
                                    initialValue: record.judgeValue,
                                    rules: [{ required: true, message: '请输入判断阈值' }],
                                })(<Input />)
                            }
                        </Form.Item>
                        {
                            stageType === '2' &&
                            <Form.Item
                                {...formItemLayout}
                                label="分值"
                            >
                                {
                                    getFieldDecorator('score', {
                                        initialValue: record.score,
                                        rules: [{ required: true, message: '请输入分值' }],
                                    })(<Input type="number" />)
                                }
                            </Form.Item>
                        }
                        {
                            stageType === '2' &&
                            <Form.Item
                                {...formItemLayout}
                                label="权重"
                            >
                                {
                                    getFieldDecorator('weight', {
                                        initialValue: record.weight,
                                        rules: [{ required: true, message: '请输入权重' }],
                                    })(<Input type="number" />)
                                }
                            </Form.Item>
                        }
                    </Form>
                </Modal>
            </span>
        );
    }
}
