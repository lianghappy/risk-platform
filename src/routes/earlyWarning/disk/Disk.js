import React from 'react';
import { Layout, Form, Select, Button } from 'antd';
import styles from './index.scss';

export default class Disk extends React.PureComponent {
    render() {
        const times = [
            {
                time: '1小时',
            }, {
                time: '1小时',
            }, {
                time: '1小时',
            }, {
                time: '1小时',
            }, {
                time: '1小时',
            }, {
                time: '1小时',
            }, {
                time: '1小时',
            }, {
                time: '1小时',
            }
        ];
        return (
            <Layout className="layoutMar">
                <div className={styles.containers}>
                    <div className={styles.left}>
                        <Form
                            layout="inline"
                        >
                            <Form.Item
                                label="当前监控大盘"
                            >
                                <Select>
                                    <Select.Option value="333">222</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className={styles.right}>
                        <Button type="primary" size="small" className={styles.create}>创建监控大盘</Button>
                        <Button type="default" size="small">删除当前表盘</Button>
                    </div>
                </div>
                <div className={styles.charts}>
                    <div className={styles.times}>
                        <div className={styles.slectTime}>
                            {
                                times.map((item, index) => {
                                    return (
                                        <Button type="default" size="small" key={index}>{item.time}</Button>
                                    );
                                })
                            }
                        </div>
                        <div className={styles.addCharts}>
                            <Button type="default">添加图表</Button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}
