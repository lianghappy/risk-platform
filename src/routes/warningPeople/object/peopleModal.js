import React from 'react';
import { Modal, Form, Input, Radio, Button } from 'antd';
import styles from './index.scss';

@Form.create()
export default class PeopleModal extends React.PureComponent {
    state = {
        visible: false,
    }
    showModelHandler = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    render() {
        const {
            children,
            form,
        } = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 15 },
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
                    title="新增收件人"
                >
                    <table className={styles.tables}>
                        <tr className={styles.objects}>
                            <td className={styles.title}>通知对象</td>
                            <td className={styles.operate}>
                                <Radio.Group>
                                    <Radio value={1}>通知人</Radio>
                                    <Radio value={2}>通知机器人</Radio>
                                </Radio.Group>
                            </td>
                        </tr>
                        <tr>
                            <td className={styles.title}>信息填写</td>
                            <td className={styles.operate} style={{ paddingTop: '20px' }}>
                                <Form>
                                    <Form.Item
                                        label="姓名"
                                        {...formItemLayout}
                                    >
                                        {
                                            getFieldDecorator('name',
                                                {
                                                    rules: [
                                                        { required: true, message: '请输入姓名' }
                                                    ]
                                                }
                                            )(
                                                <Input placeholder="请输入姓名" />
                                            )
                                        }
                                    </Form.Item>
                                    <Form.Item
                                        label="手机号"
                                        {...formItemLayout}
                                    >
                                        {
                                            getFieldDecorator('phone',
                                                {
                                                    rules: [
                                                        { required: true, message: '请输入手机号' },
                                                    ]
                                                })(
                                                <Input placeholder="请输入手机号" />
                                            )
                                        }
                                    </Form.Item>
                                    <Form.Item
                                        label="验证码"
                                        {...formItemLayout}
                                    >
                                        {
                                            getFieldDecorator('code',
                                                {
                                                    rules: [
                                                        { required: true, message: '请输入验证码' }
                                                    ]
                                                })(
                                                <div>
                                                    <Input placeholder="请输入验证码" />
                                                    <Button type="primary">获取验证码</Button>
                                                </div>
                                            )
                                        }
                                    </Form.Item>
                                </Form>
                            </td>
                        </tr>
                    </table>
                </Modal>
            </span>
        );
    }
}
