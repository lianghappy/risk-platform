import React from 'react';
import { Layout, Form, Button, Input, Table } from 'antd';
import PeopleModal from './peopleModal';
import styles from './index.scss';

export default class People extends React.PureComponent {
    render() {
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
            {
                title: '所属报警组',
                dataIndex: 'sleuthTeamName',
                key: 'sleuthTeamName'
            },
            { title: '添加人', dataIndex: 'operators', key: 'operators' },
            { title: '添加时间', dataIndex: 'createTime', key: 'createTime' },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                render: () => (
                    <div>
                        <span>编辑</span>
                        <span>删除</span>
                    </div>
                )
            }
        ];
        return (
            <Layout>
                <Form layout="inline" className={styles.look}>
                    <Form.Item>
                        <Input placeholder="请输入要查询的收件人姓名、邮箱、手机号" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            查询
                        </Button>
                    </Form.Item>
                </Form>
                <Form layout="inline" className={styles.add}>
                    <Form.Item>
                        <PeopleModal >
                            <Button type="primary">新增收件人</Button>
                        </PeopleModal>
                    </Form.Item>
                    <Form.Item>
                        <Button type="default">批量删除联系人</Button>
                    </Form.Item>
                </Form>
                <Table columns={columns} pagination={false} />
            </Layout>
        );
    }
}
