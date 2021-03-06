import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import { Layout, Form, Button, Table, DatePicker, Select, Input } from 'antd';
import { roles } from 'utils/common';
import style from '../index.scss';
import Pagination from '../../../components/Pagination/Pagination';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class RecordHistory extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        download: PropTypes.object.isRequired,
    };
    onPageChange = (pageNum, pageSize, sysId) => {
        const {
            loading,
            form,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            if (values && values.start && values.start.length > 0) {
                Object.assign(values, { startTimes: moment(values.start[0]._d).format('X') });
                Object.assign(values, { startTimee: moment(values.start[1]._d).format('X') });
                delete values.start;
            }
            if (values && values.end && values.end.length > 0) {
                Object.assign(values, { endTimes: moment(values.end[0]._d).format('X') });
                Object.assign(values, { endTimee: moment(values.end[1]._d).format('X') });
                delete values.end;
            }
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
            if (values && values.start && values.start.length > 0) {
                Object.assign(values, { startTimes: moment(values.start[0]._d).format('X') });
                Object.assign(values, { startTimee: moment(values.start[1]._d).format('X') });
                delete values.start;
            }
            if (values && values.end && values.end.length > 0) {
                Object.assign(values, { endTimes: moment(values.end[0]._d).format('X') });
                Object.assign(values, { endTimee: moment(values.end[1]._d).format('X') });
                delete values.end;
            }
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
    download = (rest) => {
        const {
            dispatch,
        } = this.props;
        const operators = JSON.parse(sessionStorage.userInfo).user.realName;
        new Promise((resolve) => {
            dispatch({
                type: 'recordSand/download',
                payload: {
                    data: {
                        analysisRecordId: rest.id,
                        operators,
                        record: rest.record,
                    },
                    resolve,
                }
            });
        }).then(() => {
            // console.log(this.props.download);
            window.location.href = this.props.download.url;
        });
    }
    downCount = (rest) => {
        const {
            dispatch,
        } = this.props;
        const operators = JSON.parse(sessionStorage.userInfo).user.realName;
        new Promise((resolve) => {
            dispatch({
                type: 'recordSand/downCount',
                payload: {
                    data: {
                        analysisRecordId: rest.id,
                        operators,
                        hitNormRecord: rest.hitNormRecord,
                    },
                    resolve,
                }
            });
        }).then(() => {
            // console.log(this.props.download);
            window.location.href = this.props.downCount.hitNormRecord;
        });
    }
    query(payload) {
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        Object.assign(payload, { companyId });
        this.props.dispatch({
            type: 'recordSand/recordHistoryList',
            payload,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            pageSize,
            pageNum,
            list: dataSource,
            loading,
        } = this.props;
        const columns = [
            { title: '实验记录ID',
                dataIndex: 'id',
                key: 'id',
                width: 100
            },
            { title: '策略标识',
                dataIndex: 'strategyId',
                key: 'strategyId',
                width: 100
            },
            { title: '策略名称',
                dataIndex: 'strategyName',
                key: 'strategyName',
                width: 100
            },
            { title: '样本ID',
                dataIndex: 'sampleId',
                key: 'sampleId',
                width: 100
            },
            { title: '实验开始时间',
                dataIndex: 'startTime',
                key: 'startTime',
                width: 100
            },
            { title: '实验结束时间',
                dataIndex: 'endTime',
                key: 'endTime',
                width: 100
            },
            { title: '实验用户姓名',
                dataIndex: 'username',
                key: 'username',
                width: 100
            },
            { title: '实验状态',
                dataIndex: 'state',
                key: 'state',
                render: (...rest) => (<span>{Number(rest[1].state) === 1 ? '进行中' : '已完成'}</span>),
                width: 100
            },
            {
                title: '实验进度',
                dataIndex: 'progress',
                key: 'progress',
                width: 100,
            },
            { title: '操作',
                dataIndex: 'valueType',
                key: 'valueType',
                render: (...rest) => (
                    <div>
                        {
                            Number(rest[1].state) === 1 ?
                                <span>实验还未完成，请耐心等待</span>
                                :
                                roles('R_exp_record_result') &&
                                <span>
                                    <a role="button" tabIndex="-1" onClick={() => this.download(rest[1])}>下载实验结果</a>
                                    <a role="button" tabIndex="-1" style={{ marginLeft: '10px' }} onClick={() => this.downCount(rest[1])}>规则名称统计</a>
                                </span>
                        }

                    </div>
                ),
                width: 100,
            },
        ];
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="开始时间" >
                        {
                            getFieldDecorator('start')(<RangePicker
                                showTime={{
                                    hideDisabledOptions: true,
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                }}
                            />)
                        }
                    </FormItem>
                    <FormItem label="结束时间" >
                        {
                            getFieldDecorator('end')(<RangePicker
                                showTime={{
                                    hideDisabledOptions: true,
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                }}
                            />)
                        }
                    </FormItem>
                    <FormItem label="策略标识" >
                        {
                            getFieldDecorator('strategyId')(<Input placeholder="请输入策略标识" />)
                        }
                    </FormItem>
                    <FormItem label="实验状态" >
                        {
                            getFieldDecorator('state')(
                                <Select style={{ width: '157px' }}>
                                    <Select.Option value="1">进行中</Select.Option>
                                    <Select.Option value="2">已完成</Select.Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="策略名称" >
                        {
                            getFieldDecorator('strategyName')(<Input placeholder="请输入策略名称" />)
                        }
                    </FormItem>
                    <FormItem>
                        {
                            roles('R_exp_record_qry') &&
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        }
                        {
                            roles('R_exp_record_rst') &&
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                        }
                    </FormItem>
                </Form>
                <Table
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

const mapStateToProps = (state) => ({
    list: state.recordSand.list,
    sysId: state.recordSand.sysId,
    loading: state.loading.models.recordSand,
    pageNum: state.recordSand.pageNum,
    pageSize: state.recordSand.pageSize,
    download: state.recordSand.download,
    downCount: state.recordSand.downCount,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(RecordHistory)));
