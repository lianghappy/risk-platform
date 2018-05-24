import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Button, Table, message, Popconfirm } from 'antd';
import base64 from 'utils/base64';
import { DURATION } from 'utils/constants';
import { roles } from 'utils/common';
import style from './index.scss';
import Pagination from '../../../components/Pagination/Pagination';
import AddStrategy from './AddStrategy';

const FormItem = Form.Item;

class Policy extends React.PureComponent {
    static propTypes ={
        history: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
    };
    state = {
        clone: {},
    };
    onPageChange = (pageNum, pageSize, sysId) => {
        const strategyId = this.props.list[0].strategyId;
        this.query({
            pageNum,
            pageSize,
            sysId,
            strategyId,
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
            const strategyId = base64.decode(this.props.match.params.id);
            this.query({
                ...values,
                pageNum: 1,
                pageSize,
                sysId,
                strategyId,
            });
        });
    }
    onReset = () => {
        const { pageSize, form } = this.props;
        form.resetFields();
        const strategyId = base64.decode(this.props.match.params.id);
        this.query({
            pageNum: 1,
            pageSize,
            strategyId,
        });
    };
    onDelete(ids, strategyId) {
        const {
            pageSize,
            pageNum,
            form,
            dispatch,
        } = this.props;
        new Promise((resolve) => {
            dispatch({
                type: 'strategy/del',
                payload: {
                    data: { id: ids },
                    resolve,
                },
            });
        }).then(() => {
            message.success('阶段删除成功', DURATION);
            form.validateFields((errors, values) => {
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                    strategyId,
                });
            });
        });
    }
    onSelectChange = (selectedRows) => {
        this.setState({
            clone: selectedRows,
        });
        console.log(this.state.clone);
    }
    modalOk = (data, callback) => {
        const {
            dispatch,
            pageSize,
            pageNum,
            form,
        } = this.props;
        const content = data.id !== undefined ? '更新成功' : '新增成功';
        let url = '';
        switch (data.title) {
        case 'add':
            url = 'strategy/add';
            break;
        case 'edit':
            url = 'strategy/update';
            break;
        default:
            break;
        }
        const strategyId = base64.decode(this.props.match.params.id);
        data.strategyId = strategyId;
        new Promise((resolve) => {
            dispatch({
                type: url,
                payload: {
                    data,
                    resolve,
                },
            });
        }).then(() => {
            callback();
            message.success(content, DURATION);
            form.validateFields((errors, values) => {
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                    strategyId,
                });
            });
        });
    };
    query(payload) {
        this.props.dispatch({
            type: 'strategy/getStrategyList',
            payload,
        });
    }
    stage = (id, record) => {
        // this.props.history.push(`/regular/${base64.encode(id)}`);
        this.props.history.push({
            pathname: `/regular/${base64.encode(id)}`,
            // state: record.name,
            state: {
                name: record.name,
                type: record.type,
            }
        });
    }
    render() {
        const rowSelection = {
            onSelect: this.onSelectChange,
        };
        const { getFieldDecorator } = this.props.form;
        const {
            pageSize,
            pageNum,
            list: dataSource,
            loading,
        } = this.props;
        const columns = [
            { title: '阶段排序', dataIndex: 'sort', key: 'sort' },
            { title: '阶段名称', dataIndex: 'name', key: 'name' },
            { title: '阶段模式',
                dataIndex: 'type',
                key: 'type',
                render: (...rest) => (
                    <span>{Number(rest[1].type) === 1 ? '最坏匹配' : '权重匹配'}</span>
                ) },
            { title: '权重', dataIndex: 'weight', key: 'weight' },
            { title: '阶段描述', dataIndex: 'describ', key: 'describ' },
            { title: '操作',
                dataIndex: 'valueType',
                key: 'valueType',
                render: (...rest) => (
                    <div className={style.edits}>
                        {
                            roles('R_B_PLY_policy_st_edit') &&
                        <AddStrategy
                            title="edit"
                            record={rest[1]}
                            onOk={this.modalOk}
                            type={rest[1].type}
                        >
                            <span>编辑</span>
                        </AddStrategy>
                        }
                        <span role="button" tabIndex="-1" onClick={() => this.stage(rest[1].id, rest[1])} className={style.stage}>规则管理</span>
                        {
                            roles('R_B_PLY_policy_st_del') &&
                        <Popconfirm
                            placement="topRight"
                            title="是否确定删除？"
                            onConfirm={() => this.onDelete(rest[1].id, rest[1].strategyId)}
                        >
                            <span className={style.stage}>删除</span>
                        </Popconfirm>
                        }
                    </div>) },
        ];
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="阶段名称" >
                        {
                            getFieldDecorator('name')(<Input placeholder="请输入阶段名称" />)
                        }
                    </FormItem>
                    <FormItem>
                        {
                            roles('R_B_PLY_policy_st_view') &&
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        }
                        {
                            roles('R_B_PLY_policy_st_reset') &&
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                        }
                    </FormItem>
                </Form>
                <div className={style.btns}>
                    {
                        roles('R_B_PLY_policy_st_add') &&
                    <AddStrategy
                        title="add"
                        record={{}}
                        onOk={this.modalOk}
                        type={1}
                    >
                        <Button type="primary">新增阶段</Button>
                    </AddStrategy>
                    }
                </div>
                <Table
                    columns={columns}
                    loading={loading}
                    dataSource={dataSource}
                    pagination={false}
                    rowSelection={rowSelection}
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
    list: state.strategy.list,
    sysId: state.strategy.sysId,
    loading: state.loading.models.strategy,
    pageNum: state.strategy.pageNum,
    pageSize: state.strategy.pageSize,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Policy)));
