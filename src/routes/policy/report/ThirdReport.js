import React from 'react';
import { connect } from 'dva';
import * as echarts from 'echarts/lib/echarts';
import moment from 'moment';
// 引入折线图。
import 'echarts/lib/chart/line';
// 引入提示框组件、标题组件、工具箱组件。
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import { Layout, Form, Button, Select, DatePicker } from 'antd';
// import { roles } from 'utils/common';
import style from './index.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const pageCount = [
    {
        time: '最近一天',
        hour: [1, 'd'],
        indexs: 1,
    }, {
        time: '最近一周',
        hour: [7, 'd'],
        indexs: 2,
    }, {
        time: '最近一月',
        hour: [1, 'M'],
        indexs: 3,
    }, {
        time: '最近半年',
        hour: [6, 'M'],
        indexs: 4,
    },
];
const mapStateToProps = (state) => {
    return {
        list: state.statistical.list,
        NormHitChannal: state.statistical.NormHitChannal,
        dailyRecord: state.statistical.dailyRecord,
        portChannal: state.statistical.portChannal,
    };
};
@connect(mapStateToProps)
@Form.create()
export default class ThirdReport extends React.PureComponent {
    state={
        time: 2,
        startTime: moment().subtract(pageCount[1].hour[0], pageCount[1].hour[1]).format('X'),
        endTime: moment().format('X'),
        times: [moment().subtract(pageCount[1].hour[0], pageCount[1].hour[1]), moment()]
    }

    componentDidMount() {
        const { startTime, endTime } = this.state;
        this.props.dispatch({
            type: 'statistical/dailyRecord',
            payload: {
                dateU: endTime,
                dateL: startTime,
            }
        }).then(() => {
            this.init();
        });
        const container = this.line;
        const myChart = echarts.init(container);
        window.onresize = myChart.resize;
    }

    onQuery = (e) => {
        e.preventDefault();
        const {
            loading,
            form,
        } = this.props;
        if (loading) return;
        const { startTime, endTime } = this.state;
        form.validateFields((errors, values) => {
            Object.assign(values, {
                dateU: endTime,
                dateL: startTime,
            });
            this.query({
                ...values,
            });
        });
    }

    onReset = () => {
        const { pageSize, form } = this.props;
        form.resetFields();
        this.query({
            pageNum: 1,
            pageSize,
        });
    };

    onChange = (value) => {
        this.setState({
            time: value,
            startTime: moment().subtract(pageCount[value - 1].hour[0], pageCount[value - 1].hour[1]).format('X'),
            endTime: moment().format('X'),
            times: [moment().subtract(pageCount[value - 1].hour[0], pageCount[value - 1].hour[1]), moment()]
        });
    }

    onChangeThird = (value) => {
        this.props.dispatch({
            type: 'statistical/portChannal',
            payload: {
                thirdparty: value,
            }
        });
    }

    setOption = (mychart) => {
        const { dailyRecord } = this.props;
        const allSuccessTime = dailyRecord.length > 0 ? dailyRecord.map(it => it.allSuccessTime) : [];
        const allCallTime = dailyRecord.length > 0 ? dailyRecord.map(it => it.allCallTime) : [];
        const date = dailyRecord.length > 0 ? dailyRecord.map(it => it.date) : [];
        const option = {
            tooltip: {
                trigger: 'axis',
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
            },
            legend: {
                data: ['失败调用次数', '成功调用次数']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: date,
            },
            yAxis: {
                type: 'value',
                data: ['成功调用次数', '失败调用次数']
            },
            series: [
                {
                    name: '成功调用次数',
                    type: 'line',
                    stack: '总量',
                    data: allSuccessTime
                },
                {
                    name: '失败调用次数',
                    type: 'line',
                    stack: '总量',
                    data: allCallTime
                },
            ]
        };
        mychart.setOption(option);
    }

    init = () => {
        const container = this.line;
        const myChart = echarts.init(container);
        this.setOption(myChart);
        const { NormHitChannal } = this.props;
        const option = [];
        if (NormHitChannal.strategys) {
            NormHitChannal.strategys.forEach(item => {
                option.push({
                    label: item.name,
                    value: item.id,
                    isLeaf: false,
                });
            });
        }
    }

    query(payload) {
        this.props.dispatch({
            type: 'statistical/dailyRecord',
            payload,
        }).then(() => {
            const container = this.line;
            const myChart = echarts.init(container);
            this.setOption(myChart);
            window.onresize = myChart.resize;
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { portChannal, NormHitChannal } = this.props;
        const { times, time } = this.state;


        return (
            <Layout className={style.statical}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem>
                        <RangePicker
                            showTime={{
                                hideDisabledOptions: true,
                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                            }}
                            value={times}
                            format="YYYY-MM-DD HH:mm"
                            placeholder={['开始时间', '结束时间']}
                        />
                    </FormItem>
                    <FormItem>
                        <Select
                            style={{ width: '154px' }}
                            onChange={this.onChange}
                            value={time}
                        >
                            {
                                pageCount.map((item) => {
                                    return (
                                        <Option key={item.indexs} value={item.indexs}>{item.time}</Option>
                                    );
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem>
                        {
                            getFieldDecorator('thirdparty')(
                                <Select
                                    style={{ width: '157px' }}
                                    onChange={this.onChangeThird}
                                >
                                    {
                                        NormHitChannal.dateSources &&
                                        NormHitChannal.dateSources.map((item) => {
                                            return (<Option value={item.code} key={item.id}>{item.name}</Option>);
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        {
                            getFieldDecorator('portName')(
                                <Select style={{ width: '157px' }}>
                                    {
                                        portChannal.status &&
                                        portChannal.status.map((item, index) => {
                                            return (<Option value={item} key={index}>{item}</Option>);
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                    </FormItem>
                </Form>
                <div className={style.content}>
                    <div className={style.alls} ref={(c) => { this.line = c; }}></div>
                </div>
            </Layout>
        );
    }
}
