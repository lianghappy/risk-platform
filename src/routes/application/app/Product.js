import React from 'react';
import { Layout, Form, Button, Table, message } from 'antd';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
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
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRows });
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
            this.setState({ selectedRows: [] });
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
        if (this.state.selectedRows.length > 0) {
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
                <Button className={style.btns} type="primary" onClick={this.all} disabled={this.state.selectedRows.length === 0}>批量增加</Button>
                <Table
                    rowSelection={rowSelection}
                    columns={adds}
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
