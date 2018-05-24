import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Button, Table } from 'antd';
import { roles } from 'utils/common';
import style from '../index.scss';
import Pagination from '../../../components/Pagination/Pagination';

const FormItem = Form.Item;

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
        this.query({
            pageNum,
            pageSize,
            sysId,
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
    download = (rest) => {
        const {
            dispatch,
        } = this.props;
        const operators = JSON.parse(sessionStorage.userInfo).user.realName;
        new Promise((resolve) => {
            dispatch({
                type: 'recordHistory/download',
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
    query(payload) {
        this.props.dispatch({
            type: 'recordHistory/recordHistoryList',
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
            { title: '实验记录ID', dataIndex: 'id', key: 'id' },
            { title: '策略标识', dataIndex: 'strategyId', key: 'strategyId' },
            { title: '策略名称', dataIndex: 'strategyName', key: 'strategyName' },
            { title: '样本ID', dataIndex: 'sampleId', key: 'sampleId' },
            { title: '实验开始时间', dataIndex: 'startTime', key: 'startTime' },
            { title: '实验结束时间', dataIndex: 'endTime', key: 'endTime' },
            { title: '实验用户姓名', dataIndex: 'username', key: 'username' },
            { title: '实验状态',
                dataIndex: 'state',
                key: 'state',
                render: (...rest) => (<span>{Number(rest[1].state) === 1 ? '进行中' : '已完成'}</span>) },
            { title: '操作',
                dataIndex: 'valueType',
                key: 'valueType',
                render: (...rest) => (
                    <div>
                        {
                            Number(rest[1].state) === 1 ?
                                <span>实验还未完成，请耐心等待</span>
                                :
                                <a role="button" tabIndex="-1" onClick={() => this.download(rest[1])}>下载实验结果</a>
                        }
                    </div>
                ) },
        ];
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="开始时间" >
                        {
                            getFieldDecorator('id')(<Input placeholder="请输入规则编号" />)
                        }
                    </FormItem>
                    <FormItem label="结束时间" >
                        {
                            getFieldDecorator('name')(<Input placeholder="请输入规则名称" />)
                        }
                    </FormItem>
                    <FormItem>
                        {
                            roles('R_B_SB_record_view') &&
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        }
                        {
                            roles('R_B_SB_record_reset') &&
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
    list: state.recordHistory.list,
    sysId: state.recordHistory.sysId,
    loading: state.loading.models.recordHistory,
    pageNum: state.recordHistory.pageNum,
    pageSize: state.recordHistory.pageSize,
    download: state.recordHistory.download,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(RecordHistory)));
