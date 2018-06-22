import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Button, Table, message, Popconfirm, Dropdown, Menu, Icon, Modal } from 'antd';
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
        this.props.history.push(setPath(`strategy/${base64.encode(value.id)}`));
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
                } },
            { title: '操作',
                dataIndex: 'valueType',
                key: 'valueType',
                render: (...rest) => (
                    <div className={style.edits}>
                        {
                            rest[1].isEnable < 2 &&
                                <Popconfirm
                                    placement="topRight"
                                    title={Number(rest[1].isEnable) === 1 && Number(rest[1].isEnable) < 2 ? '是否下架？' : '是否上架？'}
                                    onConfirm={() => this.onEdit(rest[1].id, rest[1].isEnable)}
                                >
                                    <span className={style.isEnable}>{Number(rest[1].isEnable) === 1 && Number(rest[1].isEnable) < 2 ? '下架' : '上架'}</span>
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
                                            roles('R_B_SB_sandbox_edit') &&
                                        <Menu.Item>
                                            {
                                                roles('R_B_PLY_policies_edit') && Number(rest[1].isEnable) === 0 &&
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
                                            <span role="button" tabIndex="-1" onClick={(e) => this.showDeleteConfirm(rest[1].id)} type="dashed">
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
                        {
                            roles('R_B_PLY_policies_view') &&
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        }
                        {
                            roles('R_B_PLY_policies_reset') &&
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                        }
                    </FormItem>
                </Form>
                <div className={style.btns}>
                    {
                        roles('R_B_PLY_policies_add') &&
                    <AddPolicy
                        type="add"
                        record={{}}
                        onOk={this.modalOk}
                    >
                        <Button type="primary">新增策略</Button>
                    </AddPolicy>
                    }
                    {
                        roles('R_B_PLY_policies_clone') &&
                    <AddPolicy
                        type="clone"
                        record={this.state.clone}
                        onOk={this.modalOk}
                    >
                        <Button type="primary" disabled={this.state.disabled} className={style.addBtn}>克隆策略</Button>
                    </AddPolicy>
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
    list: state.policy.list,
    sysId: state.policy.sysId,
    loading: state.loading.models.policy,
    pageNum: state.policy.pageNum,
    pageSize: state.policy.pageSize,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Policy)));
