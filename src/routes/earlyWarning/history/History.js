import React from 'react';
import { Layout, Form, Button, Table, DatePicker, Select } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Pagination from 'components/Pagination/Pagination';
import styles from './index.scss';

const { RangePicker } = DatePicker;
const Option = Select.Option;
const mapStateToProps = (state) => {
    return {
        list: state.history.list,
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
    }
    onPageChange = (pageNum, pageSize, sysId) => {
        this.query({
            pageNum,
            pageSize,
            sysId,
        });
    };
    onChange(value, dateString) {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    }
    onQuery = (e) => {
        e.preventDefault();
        const {
            pageSize,
            loading,
            form,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            this.query({
                ...values,
                pageNum: 1,
                pageSize,
            });
        });
    }
    onOk(value) {
        console.log('onOk: ', value);
    }
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
            });
        });
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
        } = this.props;
        console.log(moment().add(-1, 'hours').format('X'));
        console.log(moment().format('X'));

        const { getFieldDecorator } = form;
        const times = [
            {
                time: '1小时',
                type: 'hours',
                num: '1',
            }, {
                time: '3小时',
                type: 'hours',
                num: '3',
            }, {
                time: '6小时',
                type: 'hours',
                num: '6',
            }, {
                time: '12小时',
                type: 'hours',
                num: '12',
            }, {
                time: '1天',
                type: 'days',
                num: '1',
            }, {
                time: '3天',
                type: 'days',
                num: '3',
            }, {
                time: '7天',
                type: 'days',
                num: '7',
            }, {
                time: '14天',
                type: 'days',
                num: '14',
            }
        ];
        const columns = [
            { title: '报警规则名称',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => (<span>{record.sleuthTargetName + record.threshold + record.judgeKey + record.judgeSymbol + record.judgeValue}</span>) },
            { title: '发生时间', dataIndex: 'happenedTime', key: 'happenedTime' },
            { title: '持续时间', dataIndex: 'duringTime', key: 'duringTime' },
            { title: '策略名称', dataIndex: 'strategyName', key: 'strategyName' },
            { title: '应用名称', dataIndex: 'appName', key: 'appName' },
            { title: '产品名称', dataIndex: 'productName', key: 'productName' },
            { title: '通知对象', dataIndex: 'sleuthTeamNames', key: 'sleuthTeamNames' },
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
                        showTime={{ format: 'HH:mm' }}
                        format="YYYY-MM-DD HH:mm"
                        placeholder={['开始时间', '结束时间']}
                        onChange={this.onChange}
                        onOk={this.onOk}
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
                                    <Option value="">全部</Option>
                                </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">搜索</Button>
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
