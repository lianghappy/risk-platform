import React from 'react';
import { Layout, Form, Select, Button, message } from 'antd';
import { connect } from 'dva';
import Line from 'components/Disk/Line';
import CreateDisk from './CreateDisk';
import AddTable from './AddTable';
import styles from './index.scss';

const mapStateToProps = (state) => {
    return {
        dashBoard: state.disk.dashBoard,
        loading: state.loading.models.disk,
        app: state.disk.app,
    };
};
@connect(mapStateToProps)
export default class Disk extends React.PureComponent {
    state = {
        dashBoardId: '',
    }
    selectChange = (value) => {
        this.props.dispatch({
            type: 'disk/getData',
            payload: {
                dashBoardId: value,
                dateType: '1h',
            }
        });
        this.setState({
            dashBoardId: value,
        });
    }
    modalOk = (data, callback) => {
        const {
            dispatch,
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
            message.success('创建成功');
            this.query({});
        });
    };
    addModal = (data, callback) => {
        const {
            dispatch,
            dashBoard,
        } = this.props;
        let dashBoardName = '';
        const { dashBoardId } = this.state;
        dashBoard.forEach(item => {
            if (item.dashBoardId === dashBoardId) {
                dashBoardName = item.dashBoardName;
            }
        });
        Object.assign(data, { dashBoardId, dashBoardName });
        new Promise((resolve) => {
            dispatch({
                type: 'disk/add',
                payload: {
                    data,
                    resolve,
                }
            });
        }).then(() => {
            message.success('添加成功');
            callback();
            this.query({});
        });
    }
    query(payload) {
        const userId = JSON.parse(sessionStorage.userInfo).user.id;
        Object.assign(payload, { userId });
        this.props.dispatch({
            type: 'disk/getdashBoard',
            payload,
        });
    }
    render() {
        const times = [
            {
                time: '1小时',
                key: '1h'
            }, {
                time: '3小时',
                key: '1h',
            }, {
                time: '6小时',
                key: '1h',
            }, {
                time: '12小时',
                key: '1h',
            }, {
                time: '1天',
                key: '1h',
            }, {
                time: '3天',
                key: '1h',
            }, {
                time: '7天',
                key: '1h',
            }, {
                time: '14天',
                key: '1h',
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
                                <Select
                                    style={{ width: '206px' }}
                                    onChange={this.selectChange}
                                >
                                    {
                                        dashBoard.map((item, index) => {
                                            return (<Select.Option value={item.dashBoardId} key={index} >{item.dashBoardName}</Select.Option>);
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className={styles.right}>
                        <CreateDisk
                            onOk={this.modalOk}
                            type="add"
                        >
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
                                        <Button type="default" size="small" className={styles.addTimed} key={index}>{item.time}</Button>
                                    );
                                })
                            }
                        </div>
                        <div className={styles.addCharts}>
                            <AddTable
                                type="add"
                                onOk={this.addModal}
                            >
                                <Button type="default" size="small">添加图表</Button>
                            </AddTable>
                        </div>
                    </div>
                    <div className={styles.disk}>
                        <div className={styles.bigDisk}>
                            <Line />
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }
}
