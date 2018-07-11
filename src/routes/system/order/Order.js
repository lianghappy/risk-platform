import React from 'react';
import { connect } from 'dva';
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
    };
};
@connect(mapStateToProps)
@Form.create()
export default class Order extends React.PureComponent {
    state = {
        better: false,
    }
    onPageChange = (pageNum, pageSize) => {
        this.query({
            pageNum,
            pageSize,
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
            this.query({
                ...values,
                pageNum: 1,
                pageSize,
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
    changes = () => {
        const flag = this.state.better;
        this.setState({ better: !flag });
    }
    detail = (id) => {
        this.props.history.push(setPath(`/orderDetail/${base64.encode(id)}`));
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
                            getFieldDecorator('sampleId')(
                                <Input />
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="调用方唯一标识"
                    >
                        {
                            getFieldDecorator('clientId')(
                                <Input />
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="用户手机号"
                    >
                        {
                            getFieldDecorator('phone')(
                                <Input />
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="用户身份证姓名"
                    >
                        {
                            getFieldDecorator('idCardName')(
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
                                getFieldDecorator('orderStartTimeS')(
                                    <RangePicker />
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
                            getFieldDecorator('result')(
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
                            getFieldDecorator('idCardNum')(
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
                            getFieldDecorator('reviewEndTimeS')(
                                <RangePicker />
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
