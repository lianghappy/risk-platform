import React from 'react';
import { Layout, Form, Button, Table, Popconfirm, message } from 'antd';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { DURATION } from 'utils/constants';
import style from './LookApp.scss';
import Pagination from '../../../components/Pagination/Pagination';

class Product extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        dataSource: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
    };
    state = {
        type: this.props.type ? this.props.type : '.$del',
        dataSource: this.props.dataSource || {},
        appId: this.props.appId,
        selectedRows: [],
    };
    componentWillReceiveProps(nextProps) {
        this.setState({
            type: nextProps.type,
            dataSource: nextProps.dataSource,
            appId: nextProps.appId,
        });
    }
    onPageChange = (pageNum, pageSize, sysId) => {
        this.query({
            pageNum,
            pageSize,
            sysId,
        });
    };
    onDelete(id) {
        const {
            pageSize,
            pageNum,
            dispatch,
        } = this.props;
        const appId = this.state.appId;
        new Promise((resolve) => {
            dispatch({
                type: 'lookApp/del',
                payload: {
                    data: { id },
                    resolve,
                },
            });
        }).then(() => {
            message.success('删除成功', DURATION);
            this.query({
                pageNum,
                pageSize,
                appId,
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
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRows });
        console.log(selectedRows);
    }
    query(payload) {
        let url = '';
        if (this.state.type === '.$del') {
            url = 'lookApp/queryListSign';
        } else {
            url = 'lookApp/queryListNoSign';
        }
        this.props.dispatch({
            type: url,
            payload,
        });
    }
    add = (rest) => {
        const {
            pageSize,
            pageNum,
            dispatch,
        } = this.props;
        const appId = this.state.appId;
        new Promise((resolve) => {
            dispatch({
                type: 'lookApp/create',
                payload: {
                    data: {
                        appId,
                        productName: rest.name,
                        productDesc: rest.description,
                        productId: rest.id,
                    },
                    resolve,
                },
            });
        }).then(() => {
            message.success('添加成功');
            this.query({
                pageNum,
                pageSize,
                appId,
            });
        });
    }
    all = () => {
        const listAppProduct = [];
        const appId = this.state.appId;
        let url = '';
        let text = '';
        const {
            pageSize,
            pageNum,
            dispatch,
        } = this.props;
        console.log(this.state.selectedRows);
        if (this.state.selectedRows.length > 0) {
            if (this.state.type === '.$add') {
                this.state.selectedRows.forEach((item) => {
                    listAppProduct.push({
                        productId: item.id,
                        productName: item.name,
                        productDesc: item.id,
                        appId,
                    });
                });
                url = 'lookApp/listCreate';
                text = '添加成功';
            } else {
                this.state.selectedRows.forEach((item) => {
                    listAppProduct.push({
                        id: item.id,
                    });
                });
                url = 'lookApp/listDel';
                text = '删除成功';
            }
            new Promise((resolve) => {
                dispatch({
                    type: url,
                    payload: {
                        data: { listAppProduct },
                        resolve,
                    },
                });
            }).then(() => {
                message.success(text);
                this.query({
                    pageNum,
                    pageSize,
                    appId,
                });
            });
        }
    }
    render() {
        const {
            pageSize,
            pageNum,
            loading,
        } = this.props;
        const dels = [
            { title: '产品名称', dataIndex: 'productName', key: 'productName' },
            { title: '产品介绍', dataIndex: 'productDesc', key: 'productDesc' },
            { title: '签约开始时间', dataIndex: 'signStartDate', key: 'signStartDate' },
            { title: '失效时间', dataIndex: 'signExpiredDate', key: 'signExpiredDate' },
            { title: '状态', dataIndex: 'signStatus', key: 'signStatus' },
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
        const adds = [
            { title: '产品名称', dataIndex: 'name', key: 'name' },
            { title: '产品介绍', dataIndex: 'description', key: 'description' },
            { title: '操作',
                dataIndex: 'operator',
                render: (...rest) => (<span className={style.add} role="button" tabIndex="-1" onClick={() => this.add(rest[1])}>添加</span>),
            },
        ];
        const { selectedRows } = this.state.selectedRows;
        const rowSelection = {
            selectedRows,
            onChange: this.onSelectChange,
        };
        return (
            <Layout className={style.containers}>
                <Button className={style.btns} type="primary" onClick={this.all}>{this.state.type === '.$del' ? '批量删除' : '批量增加'}</Button>
                <Table
                    rowSelection={rowSelection}
                    columns={this.state.type === '.$del' ? dels : adds}
                    dataSource={this.state.dataSource}
                    pagination={false}
                    loading={loading}
                />
                <Pagination
                    current={pageNum}
                    pageSize={pageSize}
                    dataSize={this.state.dataSource.length}
                    onChange={this.onPageChange}
                    showQuickJumper
                />
            </Layout>);
    }
}
export default connect()(Form.create()(CSSModules(Product)));
