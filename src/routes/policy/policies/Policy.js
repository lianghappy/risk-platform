import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Button, Table, message, Popconfirm, Dropdown, Menu, Icon, Modal, Select, Tooltip } from 'antd';
import { DURATION } from 'utils/constants';
import { roles } from 'utils/common';
import { setPath } from 'utils/path';
import base64 from 'utils/base64';
import style from './index.scss';
import Pagination from '../../../components/Pagination/Pagination';
import AddPolicy from './AddPolicy';

const confirm = Modal.confirm;
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
        selectedRowKeys: [],
        searchFields: this.props.searchFields.policy || {},
        type: 'policy'
    };
    componentDidMount() {
        const {
            dispatch,
        } = this.props;
        const { type, } = this.state;
        dispatch({
            type: 'common/setSearchFields',
            payload: {
                type,
                searchFields: {},
            },
        });
    }
    onPageChange = (pageNum, pageSize, sysId) => {
        const {
            form,
            loading,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
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
            this.query({
                ...values,
                pageNum: 1,
                pageSize,
                sysId,
            });
        });
    }
    onReset = () => {
        const { pageSize, form, dispatch } = this.props;
        const { type } = this.state;
        form.resetFields();
        this.query({
            pageNum: 1,
            pageSize,
        });
        dispatch({
            type: 'common/setSearchFields',
            payload: {
                type,
                searchFields: {},
            },
        });
    };
    onRowChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys,
        });
    };

    onSelect = (record) => {
        this.setState({
            clone: record,
        });
    };
    onEdit = (id, isEnable) => {
        const {
            pageSize,
            pageNum,
            form,
            dispatch,
        } = this.props;
        const userInfo = sessionStorage.getItem('userInfo');
        let operator = '';
        if (userInfo) {
            operator = JSON.parse(userInfo).user.realName;
        }
        new Promise((resolve) => {
            dispatch({
                type: 'policy/updataEnable',
                payload: {
                    data: { id, isEnable: (Number(isEnable) + 1), operator },
                    resolve,
                },
            });
        }).then(() => {
            message.success('操作成功', DURATION);
            form.validateFields((errors, values) => {
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                });
            });
        });
    }
    onDelete(ids) {
        const {
            pageSize,
            pageNum,
            form,
            dispatch,
        } = this.props;
        new Promise((resolve) => {
            dispatch({
                type: 'policy/del',
                payload: {
                    data: {
                        id: ids,
                    },
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
            if (
                this.state.selectedRowKeys.length !== 0 &&
                ids === this.state.selectedRowKeys[0]
            ) {
                this.setState({
                    clone: {},
                    selectedRowKeys: [],
                });
            }
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
            url = 'policy/update';
            break;
        case 'clone':
            url = 'policy/clone';
            break;
        default:
            break;
        }
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        Object.assign(data, { companyId });
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
            type: 'policy/getPolicyList',
            payload,
        });
    }
    stage = (e, value) => {
        e.preventDefault();
        const { type } = this.state;
        const {
            form,
            dispatch,
            pageNum,
        } = this.props;
        form.validateFields((err, values) => {
            Object.assign(values, { pageNum });
            dispatch({
                type: 'common/setSearchFields',
                payload: {
                    type,
                    searchFields: values,
                },
            });
        });
        this.props.history.push(setPath(`/strategy/${base64.encode(value.id)}`));
    }
    showDeleteConfirm = (ids) => {
        confirm({
            title: '您确认删除此策略吗?',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => this.onDelete(ids),
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onChange: this.onRowChange,
            onSelect: this.onSelect,
        };
        const { getFieldDecorator } = this.props.form;
        const {
            pageSize,
            pageNum,
            list: dataSource,
            loading,
        } = this.props;
        const { searchFields, } = this.state;
        const columns = [
            {
                title: '策略标识',
                dataIndex: 'id',
                key: 'id',
                width: 100,
            },
            {
                title: '策略名称',
                dataIndex: 'name',
                key: 'name',
                width: 100,
            },
            {
                title: '源策略名称',
                dataIndex: 'sourceStrategyName',
                key: 'sourceStrategyName',
                width: 100,
            },
            {
                title: '策略描述',
                dataIndex: 'describ',
                key: 'describ',
                width: 100,
                render: (text, record) => (
                    <Tooltip title={record.describ} className="description">
                        <span style={{ '-webkit-box-orient': 'vertical' }} className="description">
                            {record.describ}
                        </span>
                    </Tooltip>
                ),
            },
            {
                title: '通过分',
                dataIndex: 'passScore',
                key: 'passScore',
                width: 100,
            },
            {
                title: '拒绝分',
                dataIndex: 'refuseScore',
                key: 'refuseScore',
                width: 100,
            },
            {
                title: '状态',
                dataIndex: 'isEnable',
                key: 'isEnable',
                render: (...rest) => {
                    let type = '';
                    switch (rest[1].isEnable) {
                    case '0':
                        type = '未上架';
                        break;
                    case '1':
                        type = '已上架';
                        break;
                    case '2':
                        type = '已下架';
                        break;
                    default:
                        break;
                    }
                    return (
                        <span>{type}</span>
                    );
                },
                width: 100, },
            {
                title: '操作',
                dataIndex: 'valueType',
                key: 'valueType',
                render: (...rest) => (
                    <div className={style.edits}>
                        {
                            Number(rest[1].isEnable) === 0 &&
                                <Popconfirm
                                    placement="topRight"
                                    title="是否上架？"
                                    onConfirm={() => this.onEdit(rest[1].id, rest[1].isEnable)}
                                >
                                    <span className={style.isEnable}>{Number(rest[1].isEnable) === 0 && '上架'}</span>
                                </Popconfirm>
                        }
                        {
                            Number(rest[1].isEnable) > 0 ?
                                <span role="button" tabIndex="-1" onClick={(e) => this.stage(e, rest[1])}>阶段管理</span>
                                :
                                <Dropdown overlay={(
                                    <Menu>
                                        <Menu.Item>
                                            <span role="button" tabIndex="-1" onClick={(e) => this.stage(e, rest[1])}>阶段管理</span>
                                        </Menu.Item>
                                        {
                                            roles('R_policy_ply_edit') &&
                                        <Menu.Item>
                                            {
                                                roles('R_policy_ply_edit') && Number(rest[1].isEnable) === 0 &&
                                    <AddPolicy
                                        type="edit"
                                        record={rest[1]}
                                        onOk={this.modalOk}
                                    >
                                        <span>编辑</span>
                                    </AddPolicy>
                                            }
                                        </Menu.Item>
                                        }
                                        {
                                            Number(rest[1].isEnable) === 0 &&
                                        <Menu.Item>
                                            <span role="button" tabIndex="-1" onClick={() => this.showDeleteConfirm(rest[1].id)} type="dashed">
                                                删除
                                            </span>
                                        </Menu.Item>
                                        }
                                    </Menu>
                                )}
                                >
                                    <a className="ant-dropdown-link">
                                        更多<Icon type="down" />
                                    </a>
                                </Dropdown>
                        }
                    </div>),
                width: 100, },
        ];
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="策略名称" >
                        {
                            getFieldDecorator('name', {
                                initialValue: searchFields.name,
                            })(<Input placeholder="请输入策略名称" />)
                        }
                    </FormItem>
                    <FormItem label="策略标识" >
                        {
                            getFieldDecorator('id', {
                                initialValue: searchFields.id,
                            })(<Input placeholder="请输入策略标识" />)
                        }
                    </FormItem>
                    <FormItem label="上架状态" >
                        {
                            getFieldDecorator('isEnable', {
                                initialValue: searchFields.isEnable,
                            })(
                                <Select style={{ width: '157px' }}>
                                    <Select.Option value="1">已上架</Select.Option>
                                    <Select.Option value="0">未上架</Select.Option>
                                    <Select.Option value="">全部</Select.Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        {
                            roles('R_policy_ply_qry') &&
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        }
                        {
                            roles('R_policy_ply_rst') &&
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                        }
                    </FormItem>
                </Form>
                <div className={style.btns}>
                    {
                        roles('R_policy_ply_add') &&
                    <AddPolicy
                        type="add"
                        record={{}}
                        onOk={this.modalOk}
                    >
                        <Button type="primary">新增策略</Button>
                    </AddPolicy>
                    }
                    {
                        roles('R_policy_ply_clone') &&
                    <AddPolicy
                        type="clone"
                        record={this.state.clone}
                        onOk={this.modalOk}
                    >
                        <Button type="primary" disabled={this.state.selectedRowKeys.length === 0} className={style.addBtn}>克隆策略</Button>
                    </AddPolicy>
                    }
                </div>
                <Table
                    columns={columns}
                    loading={loading}
                    dataSource={dataSource}
                    pagination={false}
                    rowKey="id"
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
    searchFields: state.common.searchFields,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Policy)));
