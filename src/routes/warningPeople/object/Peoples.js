import React from 'react';
import { Layout, Select, Button, Form, Table } from 'antd';
import cs from 'classnames';
import styles from './index.scss';

export default class Peoples extends React.PureComponent {
    render() {
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 },
        };
        const columns = [
            {
                title: '收件人姓名',
                dataIndex: 'sleuthPersonName',
                key: 'sleuthPersonName'
            },
            {
                title: '收件人手机号',
                dataIndex: 'sleuthPersonPhone',
                key: 'sleuthPersonPhone'
            },
            { title: '钉钉机器人', dataIndex: 'dingRebot', key: 'dingRebot' },
            { title: '添加人', dataIndex: 'operators', key: 'operators' },
            { title: '添加时间', dataIndex: 'createTime', key: 'createTime' },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                render: () => (
                    <div>
                        <span>删除</span>
                    </div>
                )
            }
        ];
        return (
            <Layout>
                <div className={cs(styles.look, styles.peoples)}>
                    <Form type="inline">
                        <Form.Item
                            label="收件组名"
                            {...formItemLayout}
                        >
                            <Select>
                                <Select.Option value="全部">
                            全部
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Form>
                    <Button type="primary" className={styles.adds}>新增收件组</Button>
                </div>
                <div className={styles.lists}>
                    <div className={styles.header}>
                        <span className={styles.name}>风控组</span>
                        <div>
                            <Button type="primary" className={styles.edits}>编辑</Button>
                            <Button type="default">删除</Button>
                        </div>
                    </div>
                    <Table columns={columns} pagination={false} />
                </div>
            </Layout>
        );
    }
}
