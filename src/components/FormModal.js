/**
 *
 * @author          WeiMing Huang <huangweiming@jimistore.com>
 * @date            2018-01-21 17:58:17
 * @description     表单弹框
 *
 */

import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Select, Checkbox } from 'antd';

const FormItem = Form.Item;

class FormModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible || false,
        };
    }

    showModal(e) {
        if (e) e.stopPropagation();
        this.setState({ visible: true });
    }

    handleCreate() {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            this.props.onSubmit(values);
            form.resetFields();
            this.setState({ visible: false });
        });
    }

    checksort = (rule, value, callback, el) => {
        const min = el.min || 0;
        if (!value && value !== 0) {
            callback(`请输入${el.name}!`);
        } else if (value < min) {
            callback(`${el.name}值不能小于${min}!`);
        } else if (el.max && value > el.max) {
            callback(`${el.name}值不能大于${el.max}!`);
        } else {
            callback();
        }
    }

    render() {
        const ModalForm = Form.create()((props) => {
            const { visible, onCancel, onCreate, form, title, list, layout } = props;
            const { getFieldDecorator } = form;

            const formItemLayout = {
                labelCol: { xs: { span: 24 }, sm: { span: layout === 'horizontal' ? 4 : 24 } },
                wrapperCol: { xs: { span: 24 }, sm: { span: layout === 'horizontal' ? 20 : 24 } },
            };

            return (
                <Modal
                    width={650}
                    visible={visible}
                    title={title}
                    onCancel={onCancel}
                    onOk={onCreate}
                >
                    {this.props.renderTop}
                    <Form layout={layout}>
                        {
                            list.length && list.map((el) => {
                                if (el.type === 'input') {
                                    return (
                                        <FormItem key={el.id} {...formItemLayout} label={el.name}>
                                            {getFieldDecorator(el.key, {
                                                initialValue: el.value,
                                                rules: [{ required: el.required, validator: el.validator || null, message: el.validator ? '' : `请输入${el.name}!` }],
                                            })(<Input disabled={el.disabled || false} placeholder={el.placeholder} />)}
                                        </FormItem>
                                    );
                                } else if (el.type === 'number') {
                                    return (
                                        <FormItem key={el.id} {...formItemLayout} label={el.name}>
                                            {getFieldDecorator(el.key, {
                                                initialValue: el.value,
                                                rules: [{ required: el.required, validator: (rule, value, callback) => this.checksort(rule, value, callback, el) }],
                                            })(<InputNumber placeholder={el.placeholder} style={{ width: '100%' }} />)}
                                        </FormItem>
                                    );
                                } else if (el.type === 'textarea') {
                                    return (
                                        <FormItem key={el.id} {...formItemLayout} label={el.name}>
                                            {getFieldDecorator(el.key, {
                                                initialValue: el.value,
                                                rules: [{ required: el.required, message: `请输入${el.name}!` }],
                                            })(<Input.TextArea disabled={el.disabled || false} placeholder={el.placeholder} style={{ width: '100%' }} />)}
                                        </FormItem>
                                    );
                                } else if (el.type === 'check') {
                                    return (
                                        <FormItem key={el.id} {...formItemLayout} label={el.name}>
                                            {getFieldDecorator(el.key, {
                                                initialValue: el.value,
                                                rules: [{ required: el.required, message: `请输入${el.name}!` }],
                                            })(<Checkbox.Group>
                                                {el.list && el.list.map(e => <Checkbox value={e.key} key={e.key}>{e.value}</Checkbox>)}
                                               </Checkbox.Group>)}
                                        </FormItem>
                                    );
                                } else if (el.type === 'date') {
                                    return (
                                        <FormItem key={el.id} {...formItemLayout} label={el.name}>
                                            {getFieldDecorator(el.key, {
                                                initialValue: el.value,
                                                rules: [{ required: el.required, message: `请输入${el.name}!` }],
                                            })(<DatePicker.RangePicker />)}
                                        </FormItem>
                                    );
                                } else if (el.type === 'singledate') {
                                    return (
                                        <FormItem key={el.id} {...formItemLayout} label={el.name}>
                                            {getFieldDecorator(el.key, {
                                                initialValue: el.value,
                                                rules: [{ required: el.required, message: `请输入${el.name}!` }],
                                            })(<DatePicker style={{ width: '100%' }} />)}
                                        </FormItem>
                                    );
                                } else if (el.type === 'select') {
                                    return (
                                        <FormItem key={el.id} {...formItemLayout} label={el.name}>
                                            {getFieldDecorator(el.key, {
                                                initialValue: el.value,
                                                rules: [{ required: el.required, message: `请选择${el.name}!` }],
                                            })(<Select
                                                showSearch
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            >
                                                {el.list && el.list.map(e =>
                                                    <Select.Option value={e.key} key={e.key}>{e.value}</Select.Option>)}
                                               </Select>)}
                                        </FormItem>
                                    );
                                }
                                return null;
                            })
                        }
                    </Form>
                </Modal>
            );
        });

        return (
            <span>
                <span
                    onClick={e => this.showModal(e)}
                    role="button"
                    tabIndex="0"
                >
                    {this.props.children}
                </span>
                <ModalForm
                    layout={this.props.layout || 'horizontal'}
                    renderTop={this.props.renderTop}
                    title={this.props.title}
                    placeholder={this.props.placeholder}
                    list={this.props.list}
                    ref={(form) => this.form === form}
                    visible={this.state.visible}
                    onCancel={() => this.setState({ visible: false })}
                    onCreate={() => this.handleCreate()}
                />
            </span>
        );
    }
}

export default FormModal;
