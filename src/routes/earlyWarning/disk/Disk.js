import React from 'react';
import { Layout, Form, Select, Button } from 'antd';
import { connect } from 'dva';
import CreateDisk from './CreateDisk';
import styles from './index.scss';

const mapStateToProps = (state) => {
    return {
        dashBoard: state.disk.dashBoard,
        loading: state.loading.models.disk,
    };
};
@connect(mapStateToProps)
export default class Disk extends React.PureComponent {
    modalOk = (data, callback) => {
        const {
            dispatch,
            pageSize,
            pageNum,
            form,
        } = this.props;
        const userInfo = sessionStorage.getItem('userInfo');
        if (JSON.parse(userInfo).user.userName) {
            data.userId = JSON.parse(userInfo).user.id;
        }
        new Promise((resolve) => {
            dispatch({
                type: 'disk/create',
                payload: {
                    data,
                    resolve,
                },
            });
        }).then(() => {
            callback();
            form.validateFields((errors, values) => {
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                    type: 0,
                });
            });
        });
    };
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
        const {
            dashBoard,
        } = this.props;
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
                                <Select style={{ width: '206px' }}>
                                    {
                                        dashBoard.map((item, index) => {
                                            return (<Select.Option value={item.dashBoardId} key={index}>{item.dashBoardName}</Select.Option>);
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className={styles.right}>
                        <CreateDisk>
                            <Button type="primary" size="small" className={styles.create}>创建监控大盘</Button>
                        </CreateDisk>
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
                            <Button type="default" size="small">添加图表</Button>
                        </div>
                    </div>
                    <div className={styles.disk}>
                        <div className={styles.bigDisk}>

                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}
