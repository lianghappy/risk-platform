import React from 'react';
import { connect } from 'dva';
import {
    Form,
    Table,
    Button,
    Input,
    Select,
    Popconfirm,
    Cascader,
    message,
} from 'antd';
import PropTypes from 'prop-types';
import base64 from 'utils/base64';
import Pagination from 'components/Pagination/Pagination';
import { DURATION } from 'utils/constants';
import { roles } from 'utils/common';
import treeConvert from 'utils/treeConvert';
import { setPath } from 'utils/path';
import RegularDetail from './RegularDetail';

@connect((state) => ({
    loading: state.loading.effects['regular/query'],
    list: state.regular.list,
    pageNum: state.regular.pageNum,
    pageSize: state.regular.pageSize,
    channels: state.regular.channels,
    categories: state.regular.categories,
    status: state.regular.status,
}))
@Form.create()
export default class Regular extends React.PureComponent {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        form: PropTypes.object.isRequired,
        list: PropTypes.object.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        categories: PropTypes.array.isRequired,
        channels: PropTypes.array.isRequired,
    };

    state = {
        stageId: base64.decode(this.props.match.params.id),
        selectedRowKeys: [],
    };

    onPageChange = (pageNum, pageSize) => {
        const {
            loading,
            form,
        } = this.props;
        if (loading) return;

        form.validateFields((errors, values) => {
            const {
                categoryId,
                ...payload
            } = values;
            if (categoryId && categoryId.length > 0) {
                const categoryIds = categoryId[categoryId.length - 1];
                this.props.categories.forEach(item => {
                    if (item.id === categoryIds) {
                        Object.assign(payload, {
                            categoryName: item.name,
                        });
                    }
                });
            }
            this.query({
                ...values,
                pageNum,
                pageSize,
            });
        });
    };

    onReset = () => {
        const { pageSize, form } = this.props;
        form.resetFields();
        this.query({
            pageNum: 1,
            pageSize,
        });
    };

    onQuery = (e) => {
        e.preventDefault();
        const {
            pageSize,
            form,
        } = this.props;

        form.validateFields((errors, values) => {
            const {
                categoryId,
                ...payload
            } = values;
            if (categoryId && categoryId.length > 0) {
                const categoryIds = categoryId[categoryId.length - 1];
                this.props.categories.forEach(item => {
                    if (item.id === categoryIds) {
                        Object.assign(payload, {
                            categoryName: item.name,
                        });
                    }
                });
            }
            this.query({
                ...payload,
                pageNum: 1,
                pageSize,
            });
        });
    };

    onDelete(id) {
        const {
            pageSize,
            pageNum,
            form,
            dispatch,
        } = this.props;
        new Promise((resolve) => {
            dispatch({
                type: 'regular/del',
                payload: {
                    data: { id },
                    resolve,
                },
            });
        }).then(() => {
            message.success('删除成功', DURATION);
            form.validateFields((errors, values) => {
                const {
                    categoryId,
                    ...payload
                } = values;
                if (categoryId && categoryId.length > 0) {
                    const categoryIds = categoryId[categoryId.length - 1];
                    this.props.categories.forEach(item => {
                        if (item.id === categoryIds) {
                            Object.assign(payload, {
                                categoryName: item.name,
                            });
                        }
                    });
                }
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                });
            });
            if (
                this.state.selectedRowKeys.length !== 0 &&
                id === this.state.selectedRowKeys[0]
            ) {
                this.setState({
                    selectedRowKeys: [],
                });
            }
        });
    }

    onRowChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys,
        });
    };

    checkChannel = (code) => {
        let name = '';
        this.props.channels.forEach(item => {
            if (item.code === code) {
                name = item.name;
            }
        });
        return name;
    }

    editOk = (type, data, callback) => {
        const {
            dispatch,
            pageSize,
            pageNum,
            form,
        } = this.props;

        new Promise((resolve) => {
            dispatch({
                type: `regular/${type}`,
                payload: {
                    data,
                    resolve,
                },
            });
        }).then(() => {
            callback();
            message.success('操作成功', DURATION);
            form.validateFields((errors, values) => {
                const {
                    categoryId,
                    ...payload
                } = values;
                if (categoryId && categoryId.length > 0) {
                    const categoryIds = categoryId[categoryId.length - 1];
                    this.props.categories.forEach(item => {
                        if (item.id === categoryIds) {
                            Object.assign(payload, {
                                categoryName: item.name,
                            });
                        }
                    });
                }
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                });
            });
        });
    };

    modalOk = (data, callback) => {
        const {
            dispatch,
            pageSize,
            pageNum,
            form,
        } = this.props;

        new Promise((resolve) => {
            dispatch({
                type: 'regular/add',
                payload: {
                    data,
                    resolve,
                },
            });
        }).then(() => {
            callback();
            message.success('规则新增成功', DURATION);
            form.validateFields((errors, values) => {
                const {
                    categoryId,
                    ...payload
                } = values;
                if (categoryId && categoryId.length > 0) {
                    const categoryIds = categoryId[categoryId.length - 1];
                    this.props.categories.forEach(item => {
                        if (item.id === categoryIds) {
                            Object.assign(payload, {
                                categoryName: item.name,
                            });
                        }
                    });
                }
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                });
            });
        });
    };

    addRegular = (stageId) => {
        const strangesId = this.props.match.params.strageId;
        this.props.history.push(setPath(`/addRegular/${base64.encode(stageId)}/${strangesId}`));
    }

    editRegular = (stageId, id) => {
        sessionStorage.removeItem('regulars');
        const regular = {
            id,
            type: 'edit',
        };
        sessionStorage.setItem('regulars', JSON.stringify(regular));
        const strangesId = this.props.match.params.strageId;
        this.props.history.push(setPath(`/editRegular/${base64.encode(stageId)}/${strangesId}`));
    }
    cloneRegular = (stageId) => {
        const id = this.state.selectedRowKeys[0];
        sessionStorage.removeItem('regulars');
        const regular = {
            id,
            type: 'clone',
        };
        sessionStorage.setItem('regulars', JSON.stringify(regular));
        const strangesId = this.props.match.params.strageId;
        this.props.history.push(setPath(`/editRegular/${base64.encode(stageId)}/${strangesId}`));
    }

    query(payload) {
        this.props.dispatch({
            type: 'regular/query',
            payload: {
                ...payload,
                stageId: this.state.stageId,
            },
        });
    }

    render() {
        const {
            form,
            loading,
            list,
            pageSize,
            pageNum,
            categories,
            channels,
            status,
        } = this.props;

        const { stageId } = this.state;
        const categoryList = treeConvert({
            pId: 'pid',
            tId: 'value',
            tName: 'label',
        }, categories);
        const dataSource = list !== undefined ? list : [];
        const { getFieldDecorator } = form;
        const {
            selectedRowKeys,
        } = this.state;
        // const type = list.stage !== undefined ? list.stage.type : '1';
        const columns = [{
            title: '规则编号',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        }, {
            title: '规则名称',
            dataIndex: 'name',
            key: 'name',
            width: 100,
        }, {
            title: '分值',
            dataIndex: 'score',
            key: 'score',
            width: 100,
        }, {
            title: '权重',
            dataIndex: 'weight',
            key: 'weight',
            width: 100,
        }, {
            title: '操作',
            key: 'operate',
            width: 100,
            render: (text, record) => (
                <div>
                    {
                        roles('R_policy_ply_stg_rl_edit') && Number(status) === 0 &&
                        <a
                            style={{ marginRight: 5 }}
                            tabIndex="-1"
                            role="button"
                            onClick={() => this.editRegular(stageId, record.id)}
                        >编辑
                        </a>
                    }
                    {
                        roles('R_policy_ply_stg_rl_dtl') &&
                    <RegularDetail
                        id={record.id}
                    >
                        <a style={{ marginRight: 5 }}>详情</a>
                    </RegularDetail>
                    }
                    {
                        roles('R_policy_ply_stg_rl_del') && Number(status) === 0 &&
                    <Popconfirm
                        title="你确定要删除该规则吗"
                        onConfirm={() => this.onDelete(record.id)}
                    >
                        <a style={{ marginRight: 5 }}>删除</a>
                    </Popconfirm>
                    }
                </div>
            ),
        }];

        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onChange: this.onRowChange,
            onSelect: this.onSelect,
        };

        return (
            <div className="jm-main">
                <Form
                    className="jm-searchForm"
                    layout="inline"
                    onSubmit={this.onQuery}
                >
                    <Form.Item label="规则编号">
                        {
                            getFieldDecorator('ruleId')(<Input />)
                        }
                    </Form.Item>
                    <Form.Item label="规则类型">
                        {
                            getFieldDecorator('categoryId')(<Cascader
                                options={categoryList}
                                placeholder=""
                                changeOnSelect
                                style={{ width: '270px' }}
                            />)
                        }
                    </Form.Item>
                    <Form.Item label="规则来源">
                        {
                            getFieldDecorator('channel')(
                                <Select allowClear>
                                    {channels.map(item => (
                                        <Select.Option
                                            value={item.code}
                                            key={item.code}
                                        >
                                            {item.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item label="风险代码">
                        {
                            getFieldDecorator('code')(<Input />)
                        }
                    </Form.Item>
                    <Form.Item label="规则名称">
                        {
                            getFieldDecorator('name')(<Input />)
                        }
                    </Form.Item>
                    {
                        roles('R_exp_sanb_stg_rl_qry') &&
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={loading}
                        >
                            查询
                        </Button>
                    </Form.Item>
                    }
                    {
                        roles('R_exp_sanb_stg_rl_rst') &&
                    <Form.Item>
                        <Button
                            onClick={this.onReset}
                            disabled={loading}
                        >
                            重置
                        </Button>
                    </Form.Item>
                    }
                </Form>
                <div className="jm-toolBar">
                    {
                        roles('R_exp_sanb_stg_rl_add') && Number(status) === 0 &&
                        <Button
                            type="primary"
                            style={{ marginRight: 20 }}
                            onClick={() => this.addRegular(stageId)}
                        >
                            新增规则
                        </Button>
                    }
                    {
                        roles('R_exp_sanb_stg_rl_clone') && Number(status) === 0 &&
                        <Button type="primary" disabled={selectedRowKeys.length === 0}>
                            克隆规则
                        </Button>
                    }
                </div>
                <Table
                    bordered
                    columns={columns}
                    dataSource={dataSource}
                    rowSelection={rowSelection}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                />
                <Pagination
                    current={pageNum}
                    pageSize={pageSize}
                    dataSize={dataSource.length}
                    onChange={this.onPageChange}
                    showQuickJumper
                />
            </div>
        );
    }
}
