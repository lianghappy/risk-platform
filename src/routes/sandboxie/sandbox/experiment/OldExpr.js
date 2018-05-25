import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Button, Table } from 'antd';
import base64 from 'utils/base64';
import LookModal from './LookModal';
import style from '../index.scss';
import Pagination from '../../../../components/Pagination/Pagination';

const FormItem = Form.Item;

class OldExpr extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
    };
    componentDidMount() {
        const {
            pageSize,
            pageNum,
            dispatch,
        } = this.props;
        dispatch({
            type: 'experiment/queryList',
            payload: {
                pageSize,
                pageNum,
            },
        });
    }
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
    starts = (values) => {
        const {
            dispatch,
        } = this.props;
        const username = JSON.parse(sessionStorage.userInfo).user.realName;
        const strategyId = base64.decode(this.props.match.params.id);
        new Promise((resolve) => {
            dispatch({
                type: 'experiment/startsExper',
                payload: {
                    data: {
                        strategyId,
                        username,
                        sampleId: values.id,
                    },
                    resolve,
                },
            });
        }).then(() => {
            this.props.history.push(`/sandboxie/recordHistory/${this.props.match.params.id}`);
        });
    }
    query(payload) {
        this.props.dispatch({
            type: 'experiment/queryList',
            payload,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            pageSize,
            pageNum,
            exprList: dataSource,
            loading,
        } = this.props;
        const columns = [
            { title: '样本ID', dataIndex: 'id', key: 'id' },
            { title: '样本名称', dataIndex: 'name', key: 'name' },
            { title: '样本总数量', dataIndex: 'num', key: 'num' },
            { title: '样本生成时间', dataIndex: 'generateTime', key: 'generateTime' },
            { title: '数据源', dataIndex: 'type', key: 'type', render: (...rest) => (<span>{Number(rest[1].type) === 1 ? '宽表' : '内部'}</span>) },
            { title: '操作',
                dataIndex: 'valueType',
                key: 'valueType',
                render: (...rest) => (
                    <div>
                        <LookModal
                            analysisSampleId={rest[1].id}
                            type={rest[1].type}
                        >
                            <a style={{ marginRight: 5 }}>样本筛选条件</a>
                        </LookModal>
                        <a role="button" tabIndex="-1" onClick={() => this.starts(rest[1])}>开始实验</a>
                    </div>
                ) },
        ];
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="样本ID" >
                        {
                            getFieldDecorator('id')(<Input placeholder="请输入样本ID" />)
                        }
                    </FormItem>
                    <FormItem label="样本来源" >
                        {getFieldDecorator('channel')(<Input placeholder="请输入样本来源" />)}
                    </FormItem>
                    <FormItem label="风险代码" >
                        {
                            getFieldDecorator('code')(<Input placeholder="请输入风险代码" />)
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
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
    sysId: state.experiment.sysId,
    loading: state.loading.models.experiment,
    pageNum: state.experiment.pageNum,
    pageSize: state.experiment.pageSize,
    exprList: state.experiment.exprList,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(OldExpr)));
