import React from 'react';
import { Layout, Form, Select, Button, message, DatePicker, Popconfirm } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import noMessage from 'assets/images/noMessage.svg';
import Line from 'components/Disk/Line';
import { roles } from 'utils/common';
import { DURATION } from 'utils/constants';
// import Lines from './Line';
import CreateDisk from './CreateDisk';
import AddTable from './AddTable';
import styles from './index.scss';

const { RangePicker } = DatePicker;
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
    }, {
        time: '14天',
        key: '6h',
        hour: [14, 'd'],
    }
];
const mapStateToProps = (state) => {
    return {
        dashBoard: state.disk.dashBoard,
        loading: state.loading.models.disk,
        app: state.disk.app,
        getDiskData: state.disk.getDiskData,
    };
};
@connect(mapStateToProps)
export default class Disk extends React.PureComponent {
    state = {
        dashBoardId: '',
        index: 0,
        getDiskData: this.props.getDiskData || [],
    }
    onDelete = () => {
        const { dashBoardId } = this.state;
        this.props.dispatch({
            type: 'disk/del',
            payload: {
                dashBoardId,
            }
        });
    }
    creates = () => {
        message.error('请先选择监控大盘名称', DURATION);
    }
    selectChange = (value) => {
        const indexs = this.state.index;
        this.props.dispatch({
            type: 'disk/getData',
            payload: {
                dashBoardId: value,
                dateType: times[indexs].key,
            }
        });
        this.setState({
            dashBoardId: value,
            getDiskData: this.props.getDiskData,
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
    changeTime = (i) => {
        if (!this.state.dashBoardId) {
            message.error('请先选择监控大盘名称', DURATION);
            return;
        }
        this.setState({
            index: i,
        });
        const value = this.state.dashBoardId;
        this.props.dispatch({
            type: 'disk/getData',
            payload: {
                dashBoardId: value,
                dateType: times[i].key,
            }
        });
        this.setState({
            getDiskData: this.props.getDiskData,
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
        const {
            dashBoard,
            getDiskData,
        } = this.props;
        console.log(getDiskData);

        // const timeDay = times[this.state.index].hour;

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
                        {
                            roles('R_warn_disk_create') &&
                            <span>
                                {
                                    this.state.dashBoardId ?
                                        <CreateDisk
                                            onOk={this.modalOk}
                                            type="add"
                                        >
                                            <Button type="primary" size="small" className={styles.create}>创建监控大盘</Button>
                                        </CreateDisk>
                                        :
                                        <Button type="primary" size="small" className={styles.create} onClick={() => this.creates()}>创建监控大盘</Button>
                                }
                            </span>
                        }
                        {
                            roles('R_warn_disk_del') &&
                            <Popconfirm
                                placement="topRight"
                                title="您确定要删除吗？"
                                onConfirm={() => this.onDelete()}
                            >
                                <Button type="default" size="small">删除当前表盘</Button>
                            </Popconfirm>

                        }
                    </div>
                </div>
                <div className={styles.charts}>
                    <div className={styles.times}>
                        <div className={styles.slectTime}>
                            {
                                times.map((item, index) => {
                                    return (
                                        <Button onClick={() => this.changeTime(index)} type={index === this.state.index ? 'primary' : 'default'} size="small" className={styles.addTimed} key={index}>{item.time}</Button>
                                    );
                                })
                            }
                            <RangePicker
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                                value={[moment().subtract(times[this.state.index].hour[0], times[this.state.index].hour[1]), moment()]}
                                placeholder={['开始时间', '结束时间']}
                                onChange={this.onChange}
                                onOk={this.onOk}
                            />
                        </div>
                        <div className={styles.addCharts}>
                            {
                                roles('R_warn_disk_add') &&
                                <AddTable
                                    type="add"
                                    onOk={this.addModal}
                                >
                                    <Button type="default" size="small">添加图表</Button>
                                </AddTable>
                            }

                        </div>
                    </div>
                    <div className={styles.disk}>
                        {
                            this.state.getDiskData && this.state.getDiskData.map((item, index) => {
                                let hourData = [];
                                switch (times[this.state.index].key) {
                                case '1m':
                                    hourData = item.dataByMinute;
                                    break;
                                case '1h':
                                    hourData = item.dataByOneHour;
                                    break;
                                case '6h':
                                    hourData = item.dataBySixHour;
                                    break;
                                case '1d':
                                    hourData = item.dataByDay;
                                    break;
                                default:
                                    break;
                                }
                                if (index === 0) {
                                    return (
                                        <div className={styles.bigDisk}>
                                            <Line datas={hourData} />
                                        </div>
                                    );
                                }
                                return (
                                    <div className={styles.smallDisk} key={index}>
                                        <Line datas={hourData} />
                                    </div>
                                );
                            })
                        }
                        {
                            this.props.getDiskData.length <= 0 &&
                            <div className={styles.noMessage}>
                                <img src={noMessage} alt="暂无数据" />
                                <h1>暂无数据</h1>
                            </div>
                        }
                    </div>
                </div>
            </Layout>
        );
    }
}
