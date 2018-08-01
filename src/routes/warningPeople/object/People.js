import React from 'react';
import { Layout, Form, Button, Input, Table, message, Popconfirm, Tooltip } from 'antd';
import { connect } from 'dva';
import { DURATION } from 'utils/constants';
import { roles, rowSelect } from 'utils/common';
import Pagination from 'components/Pagination/Pagination';
import PeopleModal from './peopleModal';
import styles from './index.scss';

const mapStateToProps = (state) => {
    return {
        warningList: state.warningPeople.warningList,
        loading: state.loading.models.warningPeople,
        pageSize: state.warningPeople.pageSize,
        pageNum: state.warningPeople.pageNum,
    };
};
@connect(mapStateToProps)
@Form.create()
export default class People extends React.PureComponent {
    state={
        selectedRowKeys: [],
        selectedRows: [],
    }
    componentDidMount() {
        this.query({
            pageNum: 1,
            pageSize: 10,
        });
    }
    onPageChange = (pageNum, pageSize) => {
        const { loading, form } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            this.query({
                ...values,
                pageNum,
                pageSize,
            });
        });
    };
    onDelete = (personId) => {
        const {
            dispatch,
            form,
            pageNum,
            pageSize,
        } = this.props;
        new Promise((resolve) => {
            dispatch({
                type: 'warningPeople/del',
                payload: {
                    data: {
                        personId,
                    },
                    resolve,
                }
            });
        }).then(() => {
            message.success('删除成功');
            form.validateFields((errors, values) => {
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                });
            });
        });
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        if (selectedRows.length > 0) {
            this.setState({
                selectedRows,
                selectedRowKeys,
            });
        }
    }
    onSelectAll = (selected) => {
        if (!selected) {
            this.setState({ selectedRowKeys: [] });
        }
    }
    onSelect = (record, selected) => {
        record.id = record.sleuthPersonId;
        const {
            selectedRowKeys,
        } = rowSelect.onSelect(this.state, record, selected);

        this.setState({
            selectedRowKeys,
        });
    }
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
    onDels = () => {
        const personIds = this.state.selectedRowKeys;
        const {
            dispatch,
            form,
            pageNum,
            pageSize,
        } = this.props;
        new Promise((resolve) => {
            dispatch({
                type: 'warningPeople/dels',
                payload: {
                    data: {
                        personIds,
                    },
                    resolve,
                }
            });
        }).then(() => {
            message.success('批量删除成功');
            this.setState({
                selectedRows: [],
            });
            form.validateFields((errors, values) => {
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                });
            });
        });
    }
    modalOk = (data, callback) => {
        const {
            dispatch,
            pageSize,
            pageNum,
            form,
        } = this.props;
        const content = data.personId !== undefined ? '更新成功' : '新增成功';
        let url = '';
        switch (data.type) {
        case 'add':
            url = 'warningPeople/add';
            break;
        case 'edit':
            url = 'warningPeople/updata';
            break;
        default:
            break;
        }
        data.companyId = JSON.parse(sessionStorage.userInfo).user.company;
        data.operators = JSON.parse(sessionStorage.userInfo).user.realName;
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
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        Object.assign(payload, { companyId });
        this.props.dispatch({
            type: 'warningPeople/getWarningList',
            payload,
        });
    }
    render() {
        const {
            warningList: dataSource,
            loading,
            pageNum,
            pageSize,
            form,
        } = this.props;
        const { getFieldDecorator } = form;
        const { selectedRows, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            selectedRows,
            onChange: this.onSelectChange,
            onSelectAll: this.onSelectAll,
            onSelect: this.onSelect,
        };
        const hasSelected = selectedRows.length > 0;
        const columns = [
            {
                title: '收件人姓名',
                dataIndex: 'sleuthPersonName',
                key: 'sleuthPersonName',
                width: 100,
            },
            {
                title: '收件人手机号',
                dataIndex: 'sleuthPersonPhone',
                key: 'sleuthPersonPhone',
                width: 100,
            },
            {
                title: '钉钉机器人',
                dataIndex: 'dingRebot',
                key: 'dingRebot',
                width: 100,
                render: (text, record) => (
                    <Tooltip title={record.dingRebot} className="description">
                        <span style={{ '-webkit-box-orient': 'vertical' }} className="description">
                            {record.dingRebot}
                        </span>
                    </Tooltip>
                ),
            },
            {
                title: '所属报警组',
                dataIndex: 'sleuthTeamName',
                key: 'sleuthTeamName',
                width: 100,
                render: (text, record) => (
                    <Tooltip title={record.sleuthTeamName} className="description">
                        <span style={{ '-webkit-box-orient': 'vertical' }} className="description">
                            {record.sleuthTeamName}
                        </span>
                    </Tooltip>
                ),
            },
            {
                title: '添加人',
                dataIndex: 'operators',
                key: 'operators',
                width: 100,
            },
            {
                title: '添加时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 100,
            },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                render: (text, record) => (
                    <div>
                        {
                            roles('R_police_obj_pp_edit') &&
                        <PeopleModal
                            dispatch={this.props.dispatch}
                            type="edit"
                            onOk={this.modalOk}
                            record={record}
                        >
                            <a>编辑</a>
                        </PeopleModal>
                        }
                        {
                            roles('R_police_obj_pp_del') &&
                        <Popconfirm
                            placement="topRight"
                            title="确定删除报警收件人?"
                            onConfirm={() => this.onDelete(record.sleuthPersonId)}
                        >
                            <a className="jm-del">删除</a>
                        </Popconfirm>
                        }
                    </div>
                ),
                width: 100,
            }
        ];
        return (
            <Layout>
                <Form layout="inline" className={styles.look} onSubmit={this.onQuery}>
                    <Form.Item
                        label="收件人姓名"
                    >
                        {
                            getFieldDecorator('sleuthPersonName')(
                                <Input placeholder="请输入要查询的收件人姓名" />
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="收件人手机号"
                    >
                        {
                            getFieldDecorator('sleuthPersonPhone')(
                                <Input placeholder="请输入要查询的收件人手机号" />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            roles('R_police_obj_pp_qry') &&
                            <Button type="primary" htmlType="submit">
                            查询
                            </Button>
                        }
                    </Form.Item>
                </Form>
                <Form layout="inline" className={styles.add}>
                    <Form.Item>
                        {
                            roles('R_police_obj_pp_add') &&
                        <PeopleModal
                            dispatch={this.props.dispatch}
                            type="add"
                            onOk={this.modalOk}
                            record={{}}
                        >
                            <Button type="primary">新增收件人</Button>
                        </PeopleModal>
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            roles('R_police_obj_pp_dels') &&
                        <Button type="default" disabled={!hasSelected} onClick={() => this.onDels()}>批量删除联系人</Button>
                        }
                    </Form.Item>
                </Form>
                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={dataSource}
                    loading={loading}
                    rowKey="sleuthPersonId"
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
