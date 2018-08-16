import React from 'react';
import { Layout, Form, Select, Button, message, Popconfirm, Spin, Icon, Tooltip } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import noMessage from 'assets/images/noMessage.svg';
import { roles } from 'utils/common';
import { DURATION } from 'utils/constants';
// import Lines from './Line';
import CreateDisk from './CreateDisk';
import AddTable from './AddTable';
import SingleDisk from './SingleDisk';
import styles from './index.scss';


const times = [
    {
        time: '1小时',
        key: '1m',
        hour: [1, 'h'],
    }, {
        time: '3小时',
        key: '1m',
        hour: [3, 'h'],
    }, {
        time: '6小时',
        key: '1m',
        hour: [6, 'h'],
    }, {
        time: '12小时',
        key: '1m',
        hour: [12, 'h'],
    }, {
        time: '1天',
        key: '1h',
        hour: [1, 'd'],
    }, {
        time: '3天',
        key: '1h',
        hour: [3, 'd'],
    }, {
        time: '7天',
        key: '6h',
        hour: [7, 'd'],
    }
];
const mapStateToProps = (state) => {
    return {
        dashBoard: state.disk.dashBoard,
        loading: state.loading.effects['disk/getdashBoard'] || state.loading.effects['disk/getData'],
        app: state.disk.app,
        getDiskData: state.disk.getDiskData,
        createDisk: state.disk.createDisk,
    };
};
@connect(mapStateToProps)
export default class Disk extends React.PureComponent {
    state = {
        dashBoardId: '',
        dateType: '1m',
        startTime: moment().subtract(times[0].hour[0], times[0].hour[1]).format('X'),
        endTime: moment().format('X'),
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'disk/getdashBoard',
            payload: {
                pageNum: 1,
                pageSize: 999
            },
        }).then(() => {
            this.init();
        });
        this.props.dispatch({
            type: 'disk/getData',
            payload: {
                dashBoardId: '',
                dateType: '1m',
            },
        });
    }

    onDelete = () => {
        if (!this.state.dashBoardId) {
            message.error('请先选择监控大盘', DURATION);
            return;
        }
        if (!this.state.dateType) {
            message.error('请选择监控频率', DURATION);
            return;
        }
        const { dashBoardId, dateType } = this.state;
        new Promise((resolve) => {
            this.props.dispatch({
                type: 'disk/del',
                payload: {
                    data: {
                        dashBoardId
                    },
                    resolve,
                }
            });
        }).then(() => {
            message.success('删除成功', DURATION);
            this.setState({ dashBoardId: '' });
            this.query({});
            this.queryData({
                dashBoardId: '',
                dateType,
            });
        });
    }

    init = () => {
        if (this.props.dashBoard.length > 0) {
            const dashBoardId = this.props.dashBoard[0].dashBoardId;
            const { dateType, startTime, endTime } = this.state;
            this.setState({
                dashBoardId,
            });
            this.queryData({
                dashBoardId,
                dateType,
                startTime,
                endTime,
            });
        }
    }

    creates = () => {
        message.error('请选择监控大盘', DURATION);
    }

    selectChange = (value) => {
        this.setState({
            dashBoardId: value,
        });
        const { dateType, startTime, endTime } = this.state;
        if (!dateType) {
            message.error('请选择监控频率', DURATION);
            return;
        }
        this.props.dispatch({
            type: 'disk/getData',
            payload: {
                dashBoardId: value,
                dateType,
                startTime,
                endTime,
            }
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
            this.query({});
            const { createDisk } = this.props;
            this.setState({
                dashBoardId: createDisk.dashBoardId,
            });
            message.success('创建成功');
            const { dateType, startTime, endTime } = this.state;
            this.queryData({
                dashBoardId: createDisk.dashBoardId,
                dateType,
                startTime,
                endTime,
            });
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
            const { dateType, startTime, endTime } = this.state;
            this.queryData({
                dashBoardId,
                dateType,
                startTime,
                endTime,
            });
        });
    }

    query(payload) {
        /* const userId = JSON.parse(sessionStorage.userInfo).user.id;
        Object.assign(payload, { userId }); */
        this.props.dispatch({
            type: 'disk/getdashBoard',
            payload,
        });
    }

    queryData(payload) {
        this.props.dispatch({
            type: 'disk/getData',
            payload,
        });
    }

    render() {
        const {
            dashBoard,
            getDiskData,
            loading,
        } = this.props;

        const { dashBoardId } = this.state;
        return (
            <Layout className={styles.chart}>
                <Spin spinning={loading} delay={500} tip="Loading..." />
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
                                    value={this.state.dashBoardId}
                                >
                                    {
                                        dashBoard.map((item, index) => {
                                            return (
                                                <Select.Option
                                                    value={item.dashBoardId}
                                                    key={index}
                                                >
                                                    {item.dashBoardName}
                                                </Select.Option>
                                            );
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Form>
                    </div>
                    <div className={styles.right}>
                        {
                            roles('R_warn_disk_create') &&
                            <span>

                                <CreateDisk
                                    onOk={this.modalOk}
                                    type="add"
                                >
                                    <Button
                                        type="primary"
                                        size="small"
                                        className={styles.create}
                                    >
                                    创建监控大盘
                                    </Button>
                                </CreateDisk>

                            </span>
                        }
                        {
                            roles('R_warn_disk_del') &&
                            <Popconfirm
                                placement="topRight"
                                title="您确定要删除吗？"
                                onConfirm={() => this.onDelete()}
                            >
                                <Button
                                    type="default"
                                    size="small"
                                    style={{ marginRight: '20px' }}
                                >
                                删除当前表盘
                                </Button>
                            </Popconfirm>

                        }
                    </div>
                </div>
                {
                    !loading &&
                <div className={styles.charts}>
                    {
                        this.state.dashBoardId ?
                            <AddTable
                                type="add"
                                onOk={this.addModal}
                            >
                                <Button
                                    type="primary"
                                    size="small"
                                    style={{ marginBottom: '12px' }}
                                >添加图表
                                </Button>
                            </AddTable>
                            :
                            <Button
                                type="primary"
                                size="small"
                                onClick={() => this.creates()
                                }
                                style={{ marginBottom: '12px' }}
                            >
                                             添加图表
                            </Button>
                    }
                    <Tooltip
                        title="如果图表的起点不是从筛选条件的开始时间起，即图表缺少部分时间段，表示该时间段没有数据。"
                    >
                        <Icon type="question-circle-o" style={{ marginLeft: '12px' }} />
                    </Tooltip>

                    {
                        getDiskData.length > 0 &&
                        getDiskData.map((item) => {
                            return (
                                <SingleDisk
                                    dashBoardId={dashBoardId}
                                    key={item.boardAndSleuthId}
                                    data={item}
                                />
                            );
                        })
                    }
                    {
                        getDiskData.length <= 0 &&
                                        <div className={styles.noMessage}>
                                            <img src={noMessage} alt="暂无数据" />
                                            <h1>暂无数据</h1>
                                        </div>
                    }
                </div>
                }
            </Layout>
        );
    }
}
