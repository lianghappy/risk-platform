import React from 'react';
import { Layout, Form, Button, Table, Popconfirm, message } from 'antd';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { DURATION } from 'utils/constants';
import style from './company.scss';
import Pagination from '../../../components/Pagination/Pagination';

class Product extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
    };
    state = {
        type: this.props.type ? this.props.type : 'del',
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
    onDelete(id) {
        const {
            pageSize,
            pageNum,
            form,
            dispatch,
        } = this.props;
        new Promise((resolve) => {
            dispatch({
                type: 'app/del',
                payload: {
                    data: { id },
                    resolve,
                },
            });
        }).then(() => {
            message.success('删除成功', DURATION);
            form.validateFields((errors, values) => {
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                });
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
    modalOk = (data, callback) => {
        const {
            dispatch,
            pageSize,
            pageNum,
            form,
        } = this.props;
        const content = data.id !== undefined ? '更新成功' : '新增成功';
        const url = data.id !== undefined ? 'app/updata' : 'company/add';

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
            type: 'app/getAppList',
            payload,
        });
    }
    render() {
        const {
            pageSize,
            pageNum,
            list: dataSource,
            loading,
        } = this.props;
        const columns = [
            { title: '产品名称', dataIndex: 'name', key: 'name' },
            { title: '产品介绍', dataIndex: 'contactName', key: 'contactName' },
            { title: '签约开始时间', dataIndex: 'secret', key: 'secret' },
            { title: '失效时间', dataIndex: 'partnerName', key: 'partnerName' },
            { title: '状态', dataIndex: 'partnerName', key: 'partnerName' },
            { title: '操作',
                dataIndex: 'operator',
                render: (...rest) => (
                    <div>
                        <Popconfirm
                            placement="topRight"
                            title="您确定要删除吗？"
                            onConfirm={() => this.onDelete(rest[1].id)}
                        >
                            <Button icon="delete" />
                        </Popconfirm>
                    </div>),
            },
        ];
        const column = [
            { title: '产品名称', dataIndex: 'name', key: 'name' },
            { title: '产品介绍', dataIndex: 'name', key: 'name' },
            { title: '操作',
                dataIndex: 'operator',
                render: () => (<Button type="default">添加</Button>),
            },
        ];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        return (
            <Layout className={style.container}>
                <Button type="primary" onClick={this.all}>{this.state.type === 'del' ? '批量删除' : '批量增加'}</Button>
                <Table
                    rowSelection={rowSelection}
                    columns={this.state.type ? columns : column}
                    dataSource={dataSource}
                    pagination={false}
                    loading={loading}
                />
                <Pagination
                    current={pageNum}
                    pageSize={pageSize}
                    dataSize={dataSource.length}
                    onChange={this.onPageChange}
                    showQuickJumper
                />
            </Layout>);
    }
}
// const mapStateToProps = (state) => ({
//     list: state.app.list,
//     sysId: state.app.sysId,
//     loading: state.loading.models.app,
//     pageNum: state.app.pageNum,
//     pageSize: state.app.pageSize,
// });
export default connect()(Form.create()(CSSModules(Product)));
