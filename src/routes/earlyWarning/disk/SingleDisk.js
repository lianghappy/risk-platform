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
        startTime: moment().subtract(times[0].hour[0], times[0].hour[1]).format('X'),
        endTime: moment().format('X'),
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
        const Ydata = hourData && hourData.length > 0 ? hourData : [];
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
                bottom: '9%',
                containLabel: true,
            },
            tooltip: {
                trigger: 'axis',
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
                    type: 'slider',
                    start: 0,
                    end: 100,
                    show: true,
                    xAxisIndex: [0],
                }, {
                    start: 0,
                    end: 100,
                    handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
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
                    // bottom: -20,
                    position: 'bottom',
                    filterMode: 'empty',
                }
            ],
            series: [{
                name: sleuthTargetName,
                type: 'line',
                smooth: true,
                data: Ydata.map((item) => {
                    if (item.sleuthTargetId === '1' || item.sleuthTargetId === '5' || item.value === '0') {
                        return item.value;
                    }
                    return `${item.value / 100}%`;
                }),
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
                            <div style={{ width: '100%', height: '430px' }} ref={(c) => { this.line = c; }}></div>
                        </div>
                    </div>
                </div>
            </div>


        );
    }
}
