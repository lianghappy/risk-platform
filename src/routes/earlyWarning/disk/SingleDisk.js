import React from 'react';
import { Select, Button, DatePicker, Popconfirm, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { roles } from 'utils/common';
import { DURATION } from 'utils/constants';
import Line from 'components/Disk/Line';
import cs from 'classnames';
import styles from './index.scss';

const { RangePicker } = DatePicker;
const Option = Select.Option;
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
const frequency = [
    {
        time: '1分钟',
        key: '1m',
    }, {
        time: '1小时',
        key: '1h',
    }, {
        time: '6小时',
        key: '6h',
    }, {
        time: '1天',
        key: '1d',
    }
];
const mapStateToProps = (state) => {
    return {
        singleData: state.disk.singleData
    };
};
@connect(mapStateToProps)
export default class SingleDisk extends React.PureComponent {
    state = {
        index: 0,
        times: [moment().subtract(times[0].hour[0], times[0].hour[1]), moment()],
        dateType: '1m',
        dashBoardId: this.props.dashBoardId,
        boardAndSleuthId: '',
        item: this.props.data || {},
    }

    onChange = (value, boardAndSleuthId) => {
        this.setState({
            times: value,
            index: -1,
            startTime: value[0].format('X'),
            endTime: value[1].format('X'),
            boardAndSleuthId,
        });
    }

    onOk = () => {
        const { boardAndSleuthId, startTime, endTime, dateType } = this.state;
        if (!this.state.dashBoardId) {
            message.error('请选择监控大盘', DURATION);
            return;
        }
        if (!dateType) {
            message.error('请选择监控频率', DURATION);
            return;
        }
        this.queryData({
            boardAndSleuthId,
            startTime,
            endTime,
            dateType,
        });
    }

    onDeleteTable = (boardAndSleuthId) => {
        const {
            dispatch,
        } = this.props;
        if (!this.state.dashBoardId) {
            message.error('请先选择监控大盘', DURATION);
            return;
        }
        if (!this.state.dateType) {
            message.error('请选择监控频率', DURATION);
            return;
        }
        const { dateType, dashBoardId } = this.state;
        const data = {};
        Object.assign(data, { boardAndSleuthId });
        new Promise((resolve) => {
            dispatch({
                type: 'disk/delTable',
                payload: {
                    data,
                    resolve,
                },
            });
        }).then(() => {
            dispatch({
                type: 'disk/getData',
                payload: {
                    dashBoardId,
                    dateType,
                }
            });
        });
    }

    changeTime = (i, boardAndSleuthId) => {
        // event.preventDefault();
        if (!this.state.dashBoardId) {
            message.error('请选择监控大盘', DURATION);
            return;
        }
        if (!this.state.dateType) {
            message.error('请选择监控频率', DURATION);
            return;
        }
        this.setState({
            index: i,
            times: [moment().subtract(times[i].hour[0], times[i].hour[1]), moment()],
            startTime: moment().subtract(times[i].hour[0], times[i].hour[1]).format('X'),
            endTime: moment().format('X'),
            boardAndSleuthId,
        });
        const { dateType } = this.state;
        this.queryData({
            boardAndSleuthId,
            dateType,
            startTime: moment().subtract(times[i].hour[0], times[i].hour[1]).format('X'),
            endTime: moment().format('X'),
        });
    }

    handleChange = (value, boardAndSleuthId) => {
        this.setState({
            dateType: value,
            boardAndSleuthId,
        });
        if (!this.state.dashBoardId) {
            message.error('请选择监控大盘', DURATION);
            return;
        }
        const { startTime, endTime } = this.state;
        this.queryData({
            boardAndSleuthId,
            dateType: value,
            startTime,
            endTime,
        });
    }

    queryData(payload) {
        this.props.dispatch({
            type: 'disk/getSingleData',
            payload,
        }).then(() => {
            const { singleData } = this.props;
            this.setState({
                item: singleData
            });
        });
    }

    render() {
        const {
            item,
        } = this.state;
        let hourData = [];
        switch (this.state.dateType) {
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
        return (
            <div className={styles.chartDetail}>
                <div className={styles.chartTitle}>
                    <span>{item.chartName}</span>
                    <Popconfirm
                        placement="topRight"
                        title="您确定要删除吗？"
                        onConfirm={() => this.onDeleteTable(item.boardAndSleuthId)}
                    >
                        <i
                            className={cs(
                                'jm-icon',
                                'anticon',
                                styles.close
                            )}
                        >
                        </i>
                    </Popconfirm>
                </div>
                <div className={styles.chartTable}>
                    <div className={styles.times}>
                        <div className={styles.slectTime}>
                            {
                                times.map((items, indexs) => {
                                    return (
                                        <Button
                                            onClick={() => this.changeTime(indexs, item.boardAndSleuthId)}
                                            type={indexs === this.state.index ? 'primary' : 'default'}
                                            size="small"
                                            className={styles.addTimed}
                                            key={indexs}
                                        >
                                            {items.time}
                                        </Button>
                                    );
                                })
                            }
                            <RangePicker
                                showTime={{
                                    format: 'HH:mm',
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                }}
                                format="YYYY-MM-DD HH:mm"
                                value={this.state.times}
                                placeholder={['开始时间', '结束时间']}
                                onChange={(value) => this.onChange(value, item.boardAndSleuthId)}
                                onOk={this.onOk}
                            />
                        </div>
                        {
                            roles('R_warn_disk_add') &&
                                <div className={styles.addCharts}>
                                    <span>请选择监控频率：</span>
                                    <Select
                                        style={{ width: '80px' }}
                                        value={this.state.dateType}
                                        onChange={(value) => this.handleChange(value, item.boardAndSleuthId)}
                                    >
                                        {
                                            frequency.map(it => {
                                                return (
                                                    <Option
                                                        value={it.key}
                                                        key={it.key}
                                                    >
                                                        {it.time}
                                                    </Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </div>
                        }
                    </div>
                    <div className={styles.disk}>
                        <div className={styles.bigDisk}>
                            <Line datas={hourData} />
                        </div>
                    </div>
                </div>
            </div>


        );
    }
}
