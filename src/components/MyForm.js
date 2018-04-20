/**
 *
 * @author          WeiMing Huang <huangweiming@jimistore.com>
 * @date            2018-01-21 17:58:17
 * @description     表单
 *
 */

import React, { Component } from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Checkbox, Row, Col } from 'antd';

const FormItem = Form.Item;

class NewForm extends Component {
    handleSubmit(params) {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.submit(values, params);
            }
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
        const { form, list, labelspan } = this.props;
        const { getFieldDecorator } = form;

        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: labelspan || 4 } },
            wrapperCol: { xs: { span: 24 }, sm: { span: labelspan ? 24 - labelspan : 20 } },
        };
        return (
            <Form layout="horizontal">
                {
                    list.length && list.map((el) => {
                        if (el.type === 'input') {
                            return (
                                <FormItem key={el.id} {...formItemLayout} label={el.name}>
                                    {getFieldDecorator(el.key, {
                                        initialValue: el.value,
                                        rules: [{ required: el.required, message: `请输入${el.name}!` }],
                                    })(<Input disabled={el.disabled || false} placeholder={el.placeholder} readOnly={el.readonly || false} />)}
                                </FormItem>
                            );
                        } else if (el.type === 'number') {
                            return (
                                <FormItem key={el.id} {...formItemLayout} label={el.name}>
                                    {getFieldDecorator(el.key, {
                                        initialValue: el.value,
                                        rules: [{ required: el.required, validator: (rule, value, callback) => this.checksort(rule, value, callback, el) }],
                                    })(<InputNumber placeholder={el.placeholder} style={{ width: '100%' }} min={el.min || 0} />)}
                                </FormItem>
                            );
                        } else if (el.type === 'textarea') {
                            return (
                                <FormItem key={el.id} {...formItemLayout} label={el.name}>
                                    {getFieldDecorator(el.key, {
                                        initialValue: el.value,
                                        rules: [{ required: el.required, message: `请输入${el.name}!` }],
                                    })(<Input.TextArea placeholder={el.placeholder} style={{ width: '100%' }} />)}
                                </FormItem>
                            );
                        } else if (el.type === 'check') {
                            return (
                                <FormItem key={el.id} {...formItemLayout} label={el.name}>
                                    {getFieldDecorator(el.key, {
                                        initialValue: el.value,
                                        rules: [{ required: el.required, message: `请输入${el.name}!` }],
                                    })(<Checkbox.Group>
                                        <Row>
                                            {el.list && el.list.map(e =>
                                                (<Col span={24} key={e.key}><Checkbox value={e.key} >{e.value}</Checkbox></Col>))}
                                        </Row>
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
                        } else if (el.type === 'singlecheck') {
                            return (
                                <FormItem key={el.id} {...formItemLayout}>
                                    {getFieldDecorator(el.key, {
                                        valuePropName: 'checked',
                                        initialValue: el.value || false,
                                        rules: [{ required: el.required, message: `请选择${el.name}!` }],
                                    })(<Checkbox>{el.name}</Checkbox>)}
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
        );
    }
}

const MyForm = Form.create()(NewForm);

export default MyForm;
