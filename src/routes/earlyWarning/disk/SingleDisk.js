import React from 'react';
// 引入 echarts 主模块。
import * as echarts from 'echarts/dist/echarts';
// 引入折线图。
import 'echarts/lib/chart/line';
// 引入提示框组件、标题组件、工具箱组件。
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import { Select, Button, DatePicker, Popconfirm, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { roles } from 'utils/common';
import { DURATION } from 'utils/constants';
// import Line from 'components/Disk/Line';
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

    componentDidMount() {
        const { data } = this.props;
        const container = this.line;
        const myChart = echarts.init(container);
        this.setOption(myChart, data);
        window.addEventListener('resize', this.resizeListener);
        this.resizeListener();
        window.onresize = myChart.resize;
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
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

    setOption(myChart, datas) {
        const {
            dateType
        } = this.state;
        let hourData = [];
        switch (dateType) {
        case '1m':
            hourData = datas.dataByMinute;
            break;
        case '1h':
            hourData = datas.dataByOneHour;
            break;
        case '6h':
            hourData = datas.dataBySixHour;
            break;
        case '1d':
            hourData = datas.dataByDay;
            break;
        default:
            break;
        }
        const Xdata = hourData && hourData.length > 0 ? hourData.map(it => it.sleuthTime) : [];
        const Ydata = hourData && hourData.length > 0 ? hourData.map(it => it.value) : [];
        const sleuthTargetName = hourData && hourData.length > 0 ? hourData[0].sleuthTargetName : '';
        let DW = '万分位';
        if (hourData && hourData.length > 0) {
            DW = hourData[0].sleuthTargetId === '1' || hourData[0].sleuthTargetId === '5' ? '数量' : '万分位';
        }
        myChart.setOption({
            title: {
                text: `单位：${DW}`,
                textStyle: {
                    fontSize: '13px',
                    color: 'rgba(0, 0, 0, 0.65)',
                    lineHeight: '28px',
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true,
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [sleuthTargetName],
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                axisLine: { onZero: false },
                data: Xdata.map((str) => {
                    return str.replace(' ', '\n');
                }),
            },
            yAxis: {
                type: 'value',
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 10,
                    show: true,
                    xAxisIndex: [0],
                }, {
                    start: 0,
                    end: 10,
                    handleSize: '80%',
                    handleStyle: {
                        color: '#fff',
                        shadowBlur: 3,
                        shadowColor: 'rgba(0, 0, 0, 0.6)',
                        shadowOffsetX: 2,
                        shadowOffsetY: 2
                    },
                    show: true,
                    realtime: true,
                }
            ],
            series: [{
                name: sleuthTargetName,
                type: 'line',
                smooth: true,
                data: Ydata
            }]
        });
    }

    resizeListener = () => {
        const container = this.line;
        const myChart = echarts.init(container);
        myChart.resize();
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
            const container = this.line;
            const myChart = echarts.init(container);
            this.setOption(myChart, singleData);
        });
    }

    test = () => {
        this.setState({
            index: new Date().getTime(),
        });
    }

    render() {
        const {
            item,
        } = this.state;
        console.log(item);

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
                            <div style={{ width: '100%', height: '100%' }} ref={(c) => { this.line = c; }}></div>
                        </div>
                    </div>
                </div>
            </div>


        );
    }
}
