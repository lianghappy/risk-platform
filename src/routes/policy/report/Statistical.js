import React from 'react';
import { connect } from 'dva';
import * as echarts from 'echarts/lib/echarts';
import moment from 'moment';
// 引入折线图。
import 'echarts/lib/chart/bar';
// 引入提示框组件、标题组件、工具箱组件。
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import { Layout, Form, Button, Select, Cascader, DatePicker } from 'antd';
import { roles } from 'utils/common';
import style from './index.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const pageCount = [
    { count: 10 },
    { count: 20 },
    { count: 30 },
    { count: 40 },
    { count: 50 },
];
const mapStateToProps = (state) => {
    return {
        list: state.statistical.list,
        NormHitChannal: state.statistical.NormHitChannal,
        getStage: state.statistical.getStage,
        pageNum: state.statistical.pageNum,
    };
};
@connect(mapStateToProps)
@Form.create()
export default class Statistical extends React.PureComponent {
    state={
        options: [],
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'statistical/getReportList',
            payload: {
                pageNum: 1,
                pageSize: 10,
            },
        }).then(() => {
            this.init();
        });
        this.props.dispatch({
            type: 'statistical/getSelect',
        }).then(() => {
            this.init();
        });
        const container = this.bar;
        const myChart = echarts.init(container);
        window.onresize = myChart.resize;
    }

    onPageChange = (pageNum, pageSize) => {
        const {
            form,
            loading,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            if (values && values.start && values.start.length > 0) {
                Object.assign(values, {
                    statisticDateU: moment(values.start[0]._d).format('X'),
                    statisticDateL: moment(values.start[1]._d).format('X'),
                });
                delete values.start;
            }
            if (values && values.strategyId) {
                Object.assign(values, {
                    strategyId: values.strategyId[0],
                    stageId: values.strategyId.length > 1 ? values.strategyId[1] : '',
                });
            }
            this.query({
                ...values,
                pageNum,
                pageSize,
            });
        });
    };

    onQuery = (e) => {
        e.preventDefault();
        const {
            loading,
            form,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            if (values && values.start && values.start.length > 0) {
                Object.assign(values, {
                    statisticDateU: moment(values.start[0]._d).format('X'),
                    statisticDateL: moment(values.start[1]._d).format('X')
                });

                delete values.start;
            }
            if (values && values.strategyId) {
                Object.assign(values, {
                    strategyId: values.strategyId[0],
                    stageId: values.strategyId.length > 1 ? values.strategyId[1] : '',
                });
            }
            this.query({
                ...values,
                pageNum: 1,
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

    onChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
    }

    setOption = (mychart) => {
        const { list } = this.props;
        const normName = list.map(it => it.normName) || [];
        const allHitNum = list.map(it => it.allHitNum) || [];
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['2011年', '2012年']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: normName
            },
            series: [
                {
                    name: '命中数量',
                    type: 'bar',
                    data: allHitNum.reverse()
                }
            ]
        };
        mychart.setOption(option);
    }

    loadData = (selectedOptions) => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        const { dispatch } = this.props;
        // 搜索数据
        if (selectedOptions[0].value) {
            dispatch({
                type: 'statistical/getStage',
                payload: {
                    strategyId: selectedOptions[0].value,
                }
            }).then(() => {
                this.loadInit(targetOption);
            });
        }
    }

    loadInit = (targetOption) => {
        const { getStage } = this.props;
        targetOption.children = [{ label: '所有', value: '' }];
        getStage.forEach(item => {
            targetOption.children.push({
                label: item.name,
                value: item.id,
            });
        });
        const option = this.state.options;
        option.forEach(item => {
            if (item.value === targetOption.value) {
                item.children = targetOption.children;
            }
        });
        this.setState({
            options: option,
        });
    }

    init = () => {
        const container = this.bar;
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
        option.push({
            label: '所有',
            value: '',
            isLeaf: false,
        });
        this.setState({
            options: option,
        });
    }

    query(payload) {
        this.props.dispatch({
            type: 'statistical/getReportList',
            payload,
        }).then(() => {
            const container = this.bar;
            const myChart = echarts.init(container);
            this.setOption(myChart);
            window.onresize = myChart.resize;
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { NormHitChannal } = this.props;

        return (
            <Layout className={style.statical}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="下单时间" >
                        {
                            getFieldDecorator('start')(
                                <RangePicker
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                    }}
                                />
                            )
                        }
                    </FormItem>
                    <FormItem label="数据源" >
                        {
                            getFieldDecorator('thirdpartyName')(
                                <Select style={{ width: '157px' }}>
                                    {
                                        NormHitChannal.dateSources &&
                                        NormHitChannal.dateSources.map((item) => {
                                            return (<Option value={item.code} key={item.id}>{item.name}</Option>);
                                        })
                                    }
                                    <Option value="">所有</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="策略名称" >
                        {
                            getFieldDecorator('strategyId')(
                                <Cascader
                                    placeholder="请选择"
                                    options={this.state.options}
                                    loadData={this.loadData}
                                    onChange={this.onChange}
                                    changeOnSelect
                                    style={{ width: '350px' }}
                                />
                            )
                        }
                    </FormItem>
                    <FormItem label="状态名称" >
                        {
                            getFieldDecorator('status')(
                                <Select style={{ width: '157px' }}>
                                    {
                                        NormHitChannal.status &&
                                        NormHitChannal.status.map((item) => {
                                            return (<Option value={item.code} key={item.id}>{item.name}</Option>);
                                        })
                                    }
                                    <Option value="">所有</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="数据展示" >
                        {
                            getFieldDecorator('pageSize', {
                                initialValue: '10'
                            })(
                                <Select style={{ width: '157px' }}>
                                    {
                                        pageCount.map((item) => {
                                            return (
                                                <Option value={item.count} key={item.count}>{item.count}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        {
                            roles('R_policy_static_rl_vw') &&
                            <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        }
                        {
                            roles('R_policy_static_rl_rst') &&
                            <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                        }
                    </FormItem>
                </Form>
                <div className={style.content}>
                    <div className={style.lefts} ref={(c) => { this.bar = c; }}></div>
                    {
                        this.props.list && this.props.list.length > 0 &&
                        <div className={style.rights}>
                            <p>规则命中排行</p>
                            <ul>
                                {
                                    this.props.list.map((item, index) => {
                                        return (
                                            <li key={index}>
                                                <span className={index < 3 ? style.firsts : style.second}>{index + 1}</span>
                                                <span className={style.next}>{item.normName}</span>
                                                <span>{item.allHitNum}</span>
                                            </li>
                                        );
                                    })
                                }
                            </ul>

                        </div>
                    }
                </div>
            </Layout>
        );
    }
}
