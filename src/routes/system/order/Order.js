import React from 'react';
import { Layout, Form, Input, Table, Button } from 'antd';
import styles from './index.scss';

@Form.create()
export default class Order extends React.PureComponent {
    state = {
        better: false,
    }
    render() {
        const {
            form,
        } = this.props;
        const { getFieldDecorator } = form;
        const columns = [
            { title: '风控订单ID', dataIndex: 'workTime', key: 'workTime' },
            { title: '调用方唯一标识', dataIndex: 'workTime', key: 'workTime' },
            { title: '风控产品ID', dataIndex: 'workTime', key: 'workTime' },
            { title: '风控审核状态', dataIndex: 'workTime', key: 'workTime' },
            { title: '风控下单时间', dataIndex: 'workTime', key: 'workTime' },
            { title: '风控审核结束时间', dataIndex: 'workTime', key: 'workTime' },
            { title: '公司名称', dataIndex: 'workTime', key: 'workTime' },
            { title: '策略标识', dataIndex: 'workTime', key: 'workTime' },
            { title: '策略名称', dataIndex: 'workTime', key: 'workTime' },
            { title: '用户手机号', dataIndex: 'workTime', key: 'workTime' },
            { title: '用户身份证姓名', dataIndex: 'workTime', key: 'workTime' },
            { title: '用户身份证号码', dataIndex: 'workTime', key: 'workTime' },
        ];
        return (
            <Layout className="layoutMar">
                <Form
                    layout="inline"
                    className={styles.forms}
                >
                    <Form.Item
                        label="风控订单ID"
                    >
                        {
                            getFieldDecorator('name')(
                                <Input />
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="调用方唯一标识"
                    >
                        {
                            getFieldDecorator('name')(
                                <Input />
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="用户手机号"
                    >
                        {
                            getFieldDecorator('name')(
                                <Input />
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="用户身份证姓名"
                    >
                        {
                            getFieldDecorator('name')(
                                <Input />
                            )
                        }
                    </Form.Item>
                    {
                        this.state.better &&
                        <Form.Item
                            label="风控下单时间"
                        >
                            {
                                getFieldDecorator('name')(
                                    <Input />
                                )
                            }
                        </Form.Item>
                    }
                    {
                        this.state.better &&
                    <Form.Item
                        label="风控审核状态"
                    >
                        {
                            getFieldDecorator('name')(
                                <Input />
                            )
                        }
                    </Form.Item>
                    }
                    {
                        this.state.better &&
                    <Form.Item
                        label="身份证号"
                    >
                        {
                            getFieldDecorator('name')(
                                <Input />
                            )
                        }
                    </Form.Item>
                    }
                    {
                        this.state.better &&
                    <Form.Item
                        label="风控审核结束时间"
                    >
                        {
                            getFieldDecorator('name')(
                                <Input />
                            )
                        }
                    </Form.Item>
                    }
                    <Form.Item>
                        <Button type="primary">查询</Button>
                        <Button type="default">重置</Button>
                    </Form.Item>
                </Form>
                <Table
                    columns={columns}
                    pagination={false}
                />
            </Layout>
        );
    }
}
