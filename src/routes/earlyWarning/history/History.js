import React from 'react';
import { Layout, Form, Button, Table, DatePicker, Select } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { resultFormat } from 'utils/common.js';
import Pagination from 'components/Pagination/Pagination';
import styles from './index.scss';

const { RangePicker } = DatePicker;
const Option = Select.Option;
const datas = [
    {
        name: '商品类型',
        key: 'goodsType',
    }, {
        name: '业务流程',
        key: 'businessFlow',
    }, {
        name: '下单终端',
        key: 'sceneType',
    }, {
        name: '授权认证类型',
        key: 'liveType',
    },
];
const times = [
    {
        time: '1小时',
        type: 'hours',
        num: '1',
        keys: [1, 'h'],
    }, {
        time: '2小时',
        type: 'hours',
        num: '2',
        keys: [2, 'h'],
    }, {
        time: '4小时',
        type: 'hours',
        num: '4',
        keys: [4, 'h'],
    }, {
        time: '6小时',
        type: 'hours',
        num: '6',
        keys: [6, 'h'],
    }, {
        time: '12小时',
        type: 'hours',
        num: '12',
        keys: [12, 'h'],
    }, {
        time: '1天',
        type: 'days',
        num: '1',
        keys: [1, 'd'],
    }, {
        time: '3天',
        type: 'days',
        num: '3',
        keys: [3, 'd'],
    }, {
        time: '7天',
        type: 'days',
        num: '7',
        keys: [7, 'd'],
    }
];
const mapStateToProps = (state) => {
    return {
        list: state.history.list,
        app: state.history.app,
        product: state.history.product,
        strategy: state.history.strategy,
        data: state.history.data,
        loading: state.loading.models.history,
        pageNum: state.history.pageNum,
        pageSize: state.history.pageSize,
    };
};
@connect(mapStateToProps)
@Form.create()
export default class History extends React.PureComponent {
    state = {
        btn: -1,
        times: [],
        defaultTime: [],
    }
    onPageChange = (pageNum, pageSize) => {
        const {
            loading,
            form,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            if (this.state.btn >= 0) {
                Object.assign(values, {
                    happenedTimee: moment().format('X'),
                    happenedTimes: moment().add(-Number(times[this.state.btn].num), times[this.state.btn].type).format('X'),
                });
            }
            if (this.state.times && this.state.times.length > 0) {
                const value = this.state.times;
                Object.assign(values, {
                    happenedTimee: moment(value[1]._d).format('X'),
                    happenedTimes: moment(value[0]._d).format('X'),
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
            pageSize,
            loading,
            form,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            if (this.state.btn >= 0) {
                Object.assign(values, {
                    happenedTimee: moment().format('X'),
                    happenedTimes: moment().add(-Number(times[this.state.btn].num), times[this.state.btn].type).format('X'),
                });
            }
            if (this.state.times && this.state.times.length > 0) {
                const value = this.state.times;
                Object.assign(values, {
                    happenedTimee: moment(value[1]._d).format('X'),
                    happenedTimes: moment(value[0]._d).format('X'),
                });
            }
            this.query({
                ...values,
                pageNum: 1,
                pageSize,
            });
        });
    }
    onOk(value) {
        this.setState({
            btn: -1,
            times: value,
        });
        this.props.form.validateFields((errors, values) => {
            Object.assign(values, {
                happenedTimee: moment(value[1]._d).format('X'),
                happenedTimes: moment(value[0]._d).format('X'),
            });
            this.query({
                ...values,
                pageNum: 1,
                pageSize: 10,
            });
        });
    }
    onChange(value) {
        this.setState({
            defaultTime: value,
            times: value,
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
    queryTime = (type, num, i, e) => {
        e.preventDefault();
        const {
            pageSize,
            loading,
            form,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            this.query({
                happenedTimee: moment().format('X'),
                happenedTimes: moment().add(-Number(num), type).format('X'),
                ...values,
                pageNum: 1,
                pageSize,
            });
            this.setState({
                btn: i,
                times: null,
                defaultTime: [moment().subtract(times[i].keys[0], times[i].keys[1]), moment()],
            });
        });
    }
    changeTime = (time) => {
        const timess = [
            { name: '1分钟', key: '1', type: 'minutes' },
            { name: '5分钟', key: '5', type: 'minutes' },
            { name: '30分钟', key: '30', type: 'minutes' },
            { name: '1小时', key: '1', type: 'hours' },
            { name: '2小时', key: '2', type: 'hours' },
            { name: '5小时', key: '5', type: 'hours' },
            { name: '10小时', key: '10', type: 'hours' },
            { name: '12小时', key: '12', type: 'hours' },
            { name: '24小时', key: '24', type: 'hours' },
        ];
        let TM = '0小时';
        timess.forEach((item) => {
            if (moment.duration(Number(item.key), item.type).asSeconds() === Number(time)) {
                TM = item.name;
            }
        });
        return TM;
    }

    changeCount = (count) => {
        const value = [
            { name: '平均值', key: 'avg' },
            { name: '最大值', key: 'max' },
            { name: '最小值', key: 'min' },
        ];
        let counts = '';
        value.forEach(item => {
            if (item.key === count) {
                counts = item.name;
            }
        });
        return counts;
    }
    checkKeys = (key) => {
        let name = '';
        datas.forEach(item => {
            if (key === item.key) {
                name = item.name;
            }
        });
        return name;
    }
    query(payload) {
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        Object.assign(payload, { companyId });
        this.props.dispatch({
            type: 'history/getHistoryList',
            payload,
        });
    }
    render() {
        const {
            list: dataSource,
            loading,
            pageSize,
            pageNum,
            form,
            app,
            product,
            strategy,
        } = this.props;


        const { getFieldDecorator } = form;
        const columns = [
            {
                title: '报警规则名称',
                dataIndex: 'sleuthConfigName',
                key: 'sleuthConfigName',
                width: 100,
            },
            {
                title: '发生时间',
                dataIndex: 'happenedTime',
                key: 'happenedTime',
                width: 100,
            },
            {
                title: '持续时间',
                dataIndex: 'duringTime',
                key: 'duringTime',
                width: 100,
                render: (text, record) => (<span>{record.duringTime && resultFormat(record.duringTime)}</span>)
            },
            {
                title: '关联规则',
                dataIndex: 'strategyName',
                key: 'strategyName',
                width: 100,
                render: (text, record) => {
                    const judgeConditionList = record.judgeConditionList &&
                    record.judgeConditionList.map((item, index) => {
                        return (<span key={index}>{this.checkKeys(item.judgeKey)}{item.compareSymbol}{item.judgeValue}</span>);
                    });
                    return (<span>{record.strategyName}{judgeConditionList}</span>);
                }
            },
            {
                title: '应用名称',
                dataIndex: 'appName',
                key: 'appName',
                width: 100,
            },
            {
                title: '产品名称',
                dataIndex: 'productName',
                key: 'productName',
                width: 100,
            }, {
                title: '通知对象',
                dataIndex: 'informTarget',
                key: 'informTarget',
                width: 100,
            }, {
                title: '状态',
                dataIndex: 'state',
                key: 'state',
                width: 100,
            },
        ];
        return (
            <Layout className="layoutMar">
                <div className={styles.times}>
                    {
                        times.map((item, index) => {
                            return (
                                <Button type={this.state.btn === index ? 'primary' : 'default'} size="small" className={styles.btn} key={index} onClick={(e) => this.queryTime(item.type, item.num, index, e)}>{item.time}</Button>
                            );
                        })
                    }
                    <RangePicker
                        showTime={
                            {
                                format: 'HH:mm',
                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                            }
                        }
                        format="YYYY-MM-DD HH:mm"
                        placeholder={['开始时间', '结束时间']}
                        value={this.state.defaultTime}
                        onChange={(value) => this.onChange(value)}
                        onOk={(value) => this.onOk(value)}
                    />
                </div>
                <Form
                    layout="inline"
                    className={styles.tables}
                    onSubmit={this.onQuery}
                >
                    <Form.Item
                        label="策略名称"
                    >
                        {
                            getFieldDecorator('strategyId')(
                                <Select style={{ width: '206px' }}>
                                    {
                                        strategy.map((item, index) => {
                                            return (<Option value={item.id} key={index}>{item.name}</Option>);
                                        })
                                    }
                                    <Option value="">全部</Option>
                                </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="应用名称"
                    >
                        {
                            getFieldDecorator('appId')(
                                <Select style={{ width: '206px' }}>
                                    {
                                        app.map((item, index) => {
                                            return (<Option key={index} value={item.id}>{item.name}</Option>);
                                        })
                                    }
                                    <Option value="">全部</Option>
                                </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="产品名称"
                    >
                        {
                            getFieldDecorator('productId')(
                                <Select style={{ width: '206px' }}>
                                    {
                                        product.map((item, index) => {
                                            return (<Option key={index} value={item.id}>{item.name}</Option>);
                                        })
                                    }
                                    <Option value="">全部</Option>
                                </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" disabled={this.props.loading} htmlType="submit" style={{ marginRight: '20px' }}>查询</Button>
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                    </Form.Item>
                </Form>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    loading={loading}
                />
                <Pagination
                    current={pageNum}
                    pageSize={pageSize}
                    dataSize={dataSource.length}
                    onChange={this.onPageChange}
                    pageSizeOptions={['10']}
                    showQuickJumper
                    showSizeChanger={false}
                />
            </Layout>
        );
    }
}
