import React from 'react';
import { connect } from 'dva';
import { Layout, Input, Form, Button, Select } from 'antd';
// import { roles } from 'utils/common';
import style from './index.scss';

const FormItem = Form.Item;
const mapStateToProps = (state) => {
    return {
        list: state.statistical.list
    };
};
@connect(mapStateToProps)
@Form.create()
export default class Statistical extends React.PureComponent {
    componentWillMount() {
        // const myCHart = this.refs.lefts;

    }
    onPageChange = (pageNum, pageSize, sysId) => {
        const {
            form,
            loading,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            this.query({
                ...values,
                pageNum,
                pageSize,
                sysId,
            });
        });
    };
    onQuery = (e) => {
        e.preventDefault();
        const {
            pageSize,
            loading,
            form,
            sysId,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            this.query({
                ...values,
                pageNum: 1,
                pageSize,
                sysId,
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
    setOption = () => {
        const option = {
            title: {
                text: '世界人口总量',
                subtext: '数据来自网络'
            },
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
                data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
            },
            series: [
                {
                    name: '2011年',
                    type: 'bar',
                    data: [18203, 23489, 29034, 104970, 131744, 630230]
                }
            ]
        };
        return option;
    }
    query(payload) {
        this.props.dispatch({
            type: 'policy/getPolicyList',
            payload,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        console.log(this.props.list);

        return (
            <Layout
                className="layoutMar"
            >
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="下单时间" >
                        {
                            getFieldDecorator('name')(<Input placeholder="请输入策略名称" />)
                        }
                    </FormItem>
                    <FormItem label="数据源" >
                        {
                            getFieldDecorator('id')(<Input placeholder="请输入策略标识" />)
                        }
                    </FormItem>
                    <FormItem label="策略名称" >
                        {
                            getFieldDecorator('isEnable')(
                                <Select style={{ width: '157px' }}>
                                    <Select.Option value="1">已上架</Select.Option>
                                    <Select.Option value="0">未上架</Select.Option>
                                    <Select.Option value="2">已下架</Select.Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="阶段名称" >
                        {
                            getFieldDecorator('isEnable')(
                                <Select style={{ width: '157px' }}>
                                    <Select.Option value="1">已上架</Select.Option>
                                    <Select.Option value="0">未上架</Select.Option>
                                    <Select.Option value="2">已下架</Select.Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="状态名称" >
                        {
                            getFieldDecorator('isEnable')(
                                <Select style={{ width: '157px' }}>
                                    <Select.Option value="1">已上架</Select.Option>
                                    <Select.Option value="0">未上架</Select.Option>
                                    <Select.Option value="2">已下架</Select.Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="数据展示" >
                        {
                            getFieldDecorator('isEnable')(
                                <Select style={{ width: '157px' }}>
                                    <Select.Option value="1">已上架</Select.Option>
                                    <Select.Option value="0">未上架</Select.Option>
                                    <Select.Option value="2">已下架</Select.Option>
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
                    <div className={style.lefts} ref="lefts"></div>
                    <div className={style.rights}>
                        <p>规则命中排行</p>
                        <ul>
                            {
                                this.props.list.map((item, index) => {
                                    return (
                                        <li key={index}>
                                            <span className={index < 3 && style.firsts}>{index + 1}</span>
                                            <span>{item.normName}</span>
                                            <span>{item.allHitNum}</span>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                </div>
            </Layout>
        );
    }
}
