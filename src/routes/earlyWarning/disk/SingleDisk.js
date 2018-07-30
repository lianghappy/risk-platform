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
        getDiskData: state.disk.getDiskData,
    };
};
@connect(mapStateToProps)
export default class SingleDisk extends React.PureComponent {
    state = {
        index: 0,
        times: [moment().subtract(times[0].hour[0], times[0].hour[1]), moment()],
        dateType: '1m',
        dashBoardId: this.props.dashBoardId,
    }

    onChange = (value) => {
        this.setState({
            times: value,
            index: -1,
            startTime: value[0].format('X'),
            endTime: value[1].format('X')
        });
    }

    onOk = () => {
        const { dashBoardId, startTime, endTime, dateType } = this.state;
        if (!this.state.dashBoardId) {
            message.error('请选择监控大盘', DURATION);
            return;
        }
        if (!dateType) {
            message.error('请选择监控频率', DURATION);
            return;
        }
        this.queryData({
            dashBoardId,
            startTime,
            endTime,
            dateType,
        });
    }

    changeTime = (i) => {
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
        });
        const { dateType, dashBoardId } = this.state;
        this.queryData({
            dashBoardId,
            dateType,
            startTime: moment().subtract(times[i].hour[0], times[i].hour[1]).format('X'),
            endTime: moment().format('X'),
        });
    }

    handleChange = (value) => {
        this.setState({
            dateType: value
        });
        if (!this.state.dashBoardId) {
            message.error('请选择监控大盘', DURATION);
            return;
        }
        const { dashBoardId, startTime, endTime } = this.state;
        this.queryData({
            dashBoardId,
            dateType: value,
            startTime,
            endTime,
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
            getDiskData,
        } = this.props;
        return (
            <div>
                {
                    getDiskData.map((item, index) => {
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
                            <div className={styles.chartDetail} key={`${Date.now()}${index}`}>
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
                                                            onClick={() => this.changeTime(indexs)}
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
                                                onChange={(value) => this.onChange(value)}
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
                                        onChange={(value) => this.handleChange(value)}
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
                                        <div className={styles.bigDisk} key={index}>
                                            <Line datas={hourData} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>

        );
    }
}
