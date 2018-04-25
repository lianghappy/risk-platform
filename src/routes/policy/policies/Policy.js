import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Button, Table, message } from 'antd';
import { DURATION } from 'utils/constants';
import createHistory from 'history/createBrowserHistory';
import style from './index.scss';
import Pagination from '../../../components/Pagination/Pagination';
import AddPolicy from './AddPolicy';

const FormItem = Form.Item;

class Policy extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
    };
    state = {
        clone: {},
        disabled: true,
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
    onSelectChange = (selectedRows) => {
        this.setState({
            clone: selectedRows,
            disabled: false,
        });
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
        switch (data.type) {
        case 'add':
            url = 'policy/add';
            break;
        case 'edit':
            url = 'policy/updata';
            break;
        case 'clone':
            url = 'policy/clone';
            break;
        default:
            break;
        }

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
                });
            });
        });
    };
    query(payload) {
        this.props.dispatch({
            type: 'policy/getPolicyList',
            payload,
        });
    }
    stage = (e, value) => {
        e.preventDefault();
        createHistory().push(`policy/${value.id}`);
    }
    render() {
        const rowSelection = {
            type: 'radio',
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
            { title: '策略标识', dataIndex: 'id', key: 'id' },
            { title: '策略名称', dataIndex: 'name', key: 'name' },
            { title: '源策略名称', dataIndex: 'sourceStrategyName', key: 'sourceStrategyName' },
            { title: '策略描述', dataIndex: 'describ', key: 'describ' },
            { title: '状态',
                dataIndex: 'isEnable',
                key: 'isEnable',
                render: (...rest) => (
                    <span>{rest[1].isEnable === 'true' ? '已上架' : '已下架'}</span>
                ) },
            { title: '操作',
                dataIndex: 'valueType',
                key: 'valueType',
                render: (...rest) => (
                    <div className={style.edits}>
                        <AddPolicy
                            type="edit"
                            record={rest[1]}
                            onOk={this.modalOk}
                        >
                            <span>编辑</span>
                        </AddPolicy>
                        <span role="button" tabIndex="-1" onClick={(e) => this.stage(e, rest[1])} className={style.stage}>阶段管理</span>
                    </div>) },
        ];
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="策略名称" >
                        {
                            getFieldDecorator('name')(<Input placeholder="请输入策略名称" />)
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                    </FormItem>
                </Form>
                <div className={style.btns}>
                    <AddPolicy
                        type="add"
                        record={{}}
                        onOk={this.modalOk}
                    >
                        <Button type="primary">新增策略</Button>
                    </AddPolicy>
                    <AddPolicy
                        type="clone"
                        record={this.state.clone}
                        onOk={this.modalOk}
                    >
                        <Button type="primary" disabled={this.state.disabled} className={style.addBtn}>克隆策略</Button>
                    </AddPolicy>
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
    list: state.policy.list,
    sysId: state.policy.sysId,
    loading: state.loading.models.policy,
    pageNum: state.policy.pageNum,
    pageSize: state.policy.pageSize,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Policy)));
