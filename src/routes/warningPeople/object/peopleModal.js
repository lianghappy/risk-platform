import React from 'react';
import { Modal, Form, Input, Radio, Button, message } from 'antd';
import styles from './index.scss';

@Form.create()
export default class PeopleModal extends React.PureComponent {
    state = {
        visible: false,
        value: this.props.record.dingRebot ? 2 : 1,
    }
    onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    }
    getCode = () => {
        const {
            form,
            dispatch,
        } = this.props;
        if (!form.getFieldValue('sleuthPersonPhone')) {
            message.error('请输入手机号');
        } else {
            new Promise((resolve) => {
                dispatch({
                    type: 'warningPeople/getCode',
                    payload: {
                        phone: form.getFieldValue('sleuthPersonPhone'),
                        resolve,
                    }
                });
            }).then(() => {
                message.success('验证码发送成功');
            });
        }
    }
    getLink = (rule, value, callback) => {
        if (value && !((value.indexOf('http://') === 0) || (value.indexOf('https://') === 0))) {
            callback(rule.message);
        } else {
            callback();
        }
    }
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
                new Promise(resolve => {
                    if (type === 'edit') {
                        Object.assign(values, { personId: record.sleuthPersonId });
                    }
                    values.type = that.props.type;
                    onOk(values, resolve);
                }).then(() => {
                    this.handleCancel();
                });
            }
        });
    };
    showModelHandler = () => {
        this.props.form.resetFields();
        this.setState({
            visible: true,
        });
    }
    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false,
        });
    }
    checkPhone = (rule, value, callback) => {
        if (value && value.length > 0 && !(/\d{11}/.test(value))) {
            callback(rule.message);
        } else {
            callback();
        }
    }
    render() {
        const {
            children,
            form,
            record,
        } = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 14 },
        };
        return (
            <span>
                <span
                    onClick={this.showModelHandler}
                    role="button"
                    tabIndex="-1"
                >
                    {children}
                </span>
                <Modal
                    width="680px"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    title={this.props.type === 'add' ? '新增收件人' : '编辑收件人'}
                    onOk={this.handleSubmit}
                >
                    <table className={styles.tables}>
                        <tr className={styles.objects}>
                            <td className={styles.title}>通知对象</td>
                            <td className={styles.operate}>
                                <Radio.Group
                                    onChange={this.onChange}
                                    value={this.state.value}
                                >
                                    <Radio value={1}>通知人</Radio>
                                    <Radio value={2}>通知机器人</Radio>
                                </Radio.Group>
                            </td>
                        </tr>
                        <tr>
                            <td className={styles.title}>信息填写</td>
                            <td className={styles.operate} style={{ paddingTop: '20px', paddingLeft: 0 }}>
                                <Form>
                                    <Form.Item
                                        label={this.state.value === 1 ? '姓名' : '钉钉机器人'}
                                        {...formItemLayout}
                                    >
                                        {
                                            getFieldDecorator('sleuthPersonName',
                                                {
                                                    initialValue: record.sleuthPersonName,
                                                    rules: [
                                                        { required: true, message: this.state.value === 1 ? '请输入姓名' : '请输入' }
                                                    ]
                                                }
                                            )(
                                                <Input placeholder={this.state.value === 1 ? '请输入姓名' : '请输入'} />
                                            )
                                        }
                                    </Form.Item>
                                    {
                                        this.state.value === 1 &&
                                        <Form.Item
                                            label="手机号"
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator('sleuthPersonPhone',
                                                    {
                                                        initialValue: record.sleuthPersonPhone,
                                                        rules: [
                                                            { required: true, message: '请输入手机号' },
                                                            { validator: this.checkPhone, message: '请输入正确的手机号' },
                                                        ]
                                                    })(
                                                    <Input placeholder="请输入手机号" />
                                                )
                                            }
                                        </Form.Item>
                                    }
                                    {
                                        this.state.value === 1 &&
                                        <Form.Item
                                            label="验证码"
                                            {...formItemLayout}
                                        >

                                            <div>
                                                {
                                                    getFieldDecorator('verificationCode',
                                                        {
                                                            rules: [
                                                                { required: true, message: '请输入验证码' }
                                                            ]
                                                        })(
                                                        <Input style={{ width: '150px', marginRight: '10px' }} placeholder="请输入验证码" />
                                                    )
                                                }
                                                <Button type="primary" onClick={() => this.getCode()}>获取验证码</Button>
                                            </div>


                                        </Form.Item>
                                    }
                                    {
                                        this.state.value === 2 &&
                                        <Form.Item
                                            label="钉钉机器人链接"
                                            {...formItemLayout}
                                        >
                                            {
                                                getFieldDecorator('dingRebot',
                                                    {
                                                        initialValue: record.dingRebot,
                                                        rules: [
                                                            { required: true, message: '请输入链接' },
                                                            { validator: this.getLink, message: '请输入正确的链接' },
                                                        ]
                                                    })(
                                                    <Input />
                                                )
                                            }
                                        </Form.Item>
                                    }
                                </Form>
                            </td>
                        </tr>
                    </table>
                </Modal>
            </span>
        );
    }
}
