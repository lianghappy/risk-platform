import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Layout, Form, Input, Table, Button, Icon, DatePicker, Select } from 'antd';
import { setPath } from 'utils/path';
import base64 from 'utils/base64';
import { roles } from 'utils/common';
import Pagination from 'components/Pagination/Pagination';
import styles from './index.scss';

const Option = Select.Option;
const { RangePicker } = DatePicker;
const mapStateToProps = (state) => {
    return {
        orderList: state.order.orderList,
        pageNum: state.order.pageNum,
        pageSize: state.order.pageSize,
        loading: state.loading.models.order,
        searchFields: state.common.searchFields,
    };
};
@connect(mapStateToProps)
@Form.create()
export default class Order extends React.PureComponent {
    state = {
        better: false,
        searchFields: this.props.searchFields[this.props.type] || {},
    }
    componentDidMount() {
        const {
            dispatch,
            type,
        } = this.props;
        dispatch({
            type: 'common/setSearchFields',
            payload: {
                type,
                searchFields: {},
            },
        });
    }

    onPageChange = (pageNum, pageSize) => {
        const {
            loading,
            form,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            if (values && values.orderStartTime && values.orderStartTime.length > 0) {
                Object.assign(values, { orderStartTimeS: moment(values.orderStartTime[0]._d).format('X') });
                Object.assign(values, { orderStartTimeE: moment(values.orderStartTime[1]._d).format('X') });
                delete values.orderStartTime;
            }
            if (values && values.reviewEndTime && values.reviewEndTime.length > 0) {
                Object.assign(values, { reviewEndTimeS: moment(values.reviewEndTime[0]._d).format('X') });
                Object.assign(values, { reviewEndTimeE: moment(values.reviewEndTime[1]._d).format('X') });
                delete values.reviewEndTime;
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
            if (values && values.orderStartTime && values.orderStartTime.length > 0) {
                Object.assign(values, { orderStartTimeS: moment(values.orderStartTime[0]._d).format('X') });
                Object.assign(values, { orderStartTimeE: moment(values.orderStartTime[1]._d).format('X') });
                delete values.orderStartTime;
            }
            if (values && values.reviewEndTime && values.reviewEndTime.length > 0) {
                Object.assign(values, { reviewEndTimeS: moment(values.reviewEndTime[0]._d).format('X') });
                Object.assign(values, { reviewEndTimeE: moment(values.reviewEndTime[1]._d).format('X') });
                delete values.reviewEndTime;
            }
            this.query({
                ...values,
                pageNum: 1,
                pageSize,
            });
        });
    }
    onReset = () => {
        const { pageSize, form, dispatch, type } = this.props;
        this.setState({
            searchFields: {},
        });
        dispatch({
            type: 'common/setSearchFields',
            payload: {
                type,
                searchFields: {},
            },
        });
        form.resetFields();
        this.query({
            pageNum: 1,
            pageSize,
        });
    };
    changes = () => {
        const flag = this.state.better;
        this.setState({ better: !flag });
    }
    detail = (id) => {
        const {
            form,
            dispatch,
            type,
        } = this.props;
        form.validateFields((err, values) => {
            dispatch({
                type: 'common/setSearchFields',
                payload: {
                    type,
                    searchFields: values,
                },
            });
            this.props.history.push(setPath(`/orderDetail/${base64.encode(id)}`));
        });
    }

    query(payload) {
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        Object.assign(payload, { companyId });
        this.props.dispatch({
            type: 'order/getOrderList',
            payload,
        });
    }
    render() {
        const {
            form,
            orderList: dataSource,
            loading,
            pageSize,
            pageNum,
        } = this.props;
        const { getFieldDecorator } = form;
        const { searchFields, } = this.state;
        const result = [{
            name: '风控通过',
            key: 1,
        }, {
            name: '风控拒绝',
            key: 0,
        }, {
            name: '进人审',
            key: 2,
        }];
        const columns = [
            {
                title: '风控订单ID',
                dataIndex: 'sampleId',
                key: 'sampleId',
                render: (text, record) => (
                    <span>
                        {
                            roles('R_system_order_look') ?
                                <a role="button" tabIndex="-1" onClick={() => this.detail(record.sampleId)}>{record.sampleId}</a>
                                :
                                <span>{record.sampleId}</span>
                        }
                    </span>
                ),
                width: 100,
            },
            {
                title: '调用方唯一标识',
                dataIndex: 'clientId',
                key: 'clientId',
                width: 100,
            },
            {
                title: '风控产品ID',
                dataIndex: 'productId',
                key: 'productId',
                width: 100,
            },
            {
                title: '风控审核状态',
                dataIndex: 'result',
                key: 'result',
                render: (text, record) => (
                    <span>{Number(record.result) === 0 && '风控拒绝'}{Number(record.result) === 1 && '风控通过'}{Number(record.result) === 2 && '进人审'}</span>
                ),
                width: 100,
            },
            {
                title: '风控下单时间',
                dataIndex: 'sampleCreatime',
                key: 'sampleCreatime',
                width: 100,
            },
            {
                title: '风控审核结束时间',
                dataIndex: 'detailCreatime',
                key: 'detailCreatime',
                width: 100,
            },
            {
                title: '公司名称',
                dataIndex: 'orderCompanyName',
                key: 'orderCompanyName',
                width: 100,
            },
            {
                title: '策略标识',
                dataIndex: 'strategyId',
                key: 'strategyId',
                width: 100,
            },
            {
                title: '策略名称',
                dataIndex: 'strategyName',
                key: 'strategyName',
                width: 100,
            },
            {
                title: '用户手机号',
                dataIndex: 'phone',
                key: 'phone',
                width: 100,
            },
            {
                title: '用户身份证姓名',
                dataIndex: 'idcardName',
                key: 'idcardName',
                width: 100,
            },
            {
                title: '用户身份证号码',
                dataIndex: 'idcardNum',
                key: 'idcardNum',
                width: 100,
            },
        ];
        return (
            <Layout className="layoutMar">
                <Form
                    layout="inline"
                    className={styles.forms}
                    onSubmit={this.onQuery}
                >
                    <Form.Item
                        label="风控订单ID"
                    >
                        {
                            getFieldDecorator('sampleId', {
                                initialValue: searchFields.sampleId,
                            })(
                                <Input />
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="调用方唯一标识"
                    >
                        {
                            getFieldDecorator('clientId', {
                                initialValue: searchFields.clientId,
                            })(
                                <Input />
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="用户手机号"
                    >
                        {
                            getFieldDecorator('phone', {
                                initialValue: searchFields.phone,
                            })(
                                <Input />
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="用户身份证姓名"
                    >
                        {
                            getFieldDecorator('idCardName', {
                                initialValue: searchFields.idCardName,
                            })(
                                <Input />
                            )
                        }
                    </Form.Item>
                    {
                        this.state.better &&
                        <Form.Item
                            label="风控下单时间"
                        >
                            {
                                getFieldDecorator('orderStartTime')(
                                    <RangePicker
                                        showTime={{
                                            hideDisabledOptions: true,
                                            format: 'YYYY-MM-DD HH:mm:ss',
                                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                        }}
                                    />
                                )
                            }
                        </Form.Item>
                    }
                    {
                        this.state.better &&
                    <Form.Item
                        label="风控审核状态"
                    >
                        {
                            getFieldDecorator('result', {
                                initialValue: searchFields.result,
                            })(
                                <Select style={{ width: '157px' }}>
                                    {
                                        result.map(item => {
                                            return (<Option key={item.key} value={item.key}>{item.name}</Option>);
                                        })
                                    }
                                </Select>
                            )
                        }
                    </Form.Item>
                    }
                    {
                        this.state.better &&
                    <Form.Item
                        label="身份证号"
                    >
                        {
                            getFieldDecorator('idCardNum', {
                                initialValue: searchFields.idCardNum,
                            })(
                                <Input />
                            )
                        }
                    </Form.Item>
                    }
                    {
                        this.state.better &&
                    <Form.Item
                        label="风控审核结束时间"
                    >
                        {
                            getFieldDecorator('reviewEndTime')(
                                <RangePicker
                                    showTime={{
                                        hideDisabledOptions: true,
                                        format: 'YYYY-MM-DD HH:mm:ss',
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                    }}
                                />
                            )
                        }
                    </Form.Item>
                    }
                    <Form.Item
                        className={this.state.better && styles.leves}
                    >
                        {
                            roles('R_system_order_qry') &&
                        <Button type="primary" htmlType="submit" disabled={this.props.loading}>查询</Button>
                        }
                        {
                            roles('R_system_order_rst') &&
                        <Button type="default" className="jm-del" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                        }
                        {
                            !this.state.better ?
                                <Button onClick={() => this.changes()} className="jm-del" type="default">高级搜索<Icon type="caret-down" /></Button>
                                :
                                <a role="button" tabIndex="-1" onClick={() => this.changes()} className="jm-del">简易搜索</a>
                        }
                    </Form.Item>
                </Form>
                <Table
                    style={{ backgroundColor: '#fff' }}
                    columns={columns}
                    loading={loading}
                    dataSource={dataSource}
                    pagination={false}
                    className={styles.tableOrder}
                />
                <Pagination
                    current={pageNum}
                    pageSize={pageSize}
                    dataSize={dataSource.length}
                    onChange={this.onPageChange}
                    showQuickJumper
                />
            </Layout>
        );
    }
}
