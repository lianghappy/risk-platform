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
import RegularModal from './RegularModal';
import RegularEdit from './RegularEdit';
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
        ruleName: this.props.history.location.state.name,
        selectedRow: {},
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
                    selectedRow: {},
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

    onSelect = (record) => {
        this.setState({
            selectedRow: record,
        });
    };

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
    checkChannel = (code) => {
        let name = '';
        this.props.channels.forEach(item => {
            if (item.code === code) {
                name = item.name;
            }
        });
        return name;
    }
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
        const categoryList = treeConvert({
            pId: 'pid',
            tId: 'value',
            tName: 'label',
        }, categories);
        const dataSource = list.normList !== undefined ? list.normList : [];
        const { getFieldDecorator } = form;
        const {
            selectedRowKeys,
            selectedRow,
            stageId,
            ruleName,
        } = this.state;
        const type = list.stage !== undefined ? list.stage.type : '2';
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
            title: '规则类型',
            dataIndex: 'categoryName',
            key: 'categoryName',
            width: 100,
        }, {
            title: '风险代码',
            dataIndex: 'code',
            key: 'code',
            width: 100,
        }, {
            title: '规则来源',
            dataIndex: 'channel',
            key: 'channel',
            width: 100,
            render: (text, record) => (<span>{this.checkChannel(record.channel)}</span>)
        }, {
            title: '判断符号',
            dataIndex: 'compareSymbol',
            key: 'compareSymbol',
            width: 100,
        }, {
            title: '判定阀值',
            dataIndex: 'judgeValue',
            key: 'judgeValue',
            width: 100,
        }, {
            title: '操作',
            key: 'operate',
            width: 100,
            render: (text, record) => (
                <div>
                    {
                        roles('R_B_PLY_policy_st_rule_edit') && Number(status) === 0 &&
                    <RegularEdit
                        type="update"
                        stageType={type}
                        record={record}
                        disabled={false}
                        onOk={this.editOk}
                    >
                        <a style={{ marginRight: 5 }}>编辑</a>
                    </RegularEdit>
                    }
                    {
                        roles('R_B_PLY_policy_st_rule_dtl') &&
                    <RegularDetail
                        record={record}
                        type={type}
                        onOk={this.modalOk}
                    >
                        <a style={{ marginRight: 5 }}>详情</a>
                    </RegularDetail>
                    }
                    {
                        roles('R_B_PLY_policy_st_rule_del') && Number(status) === 0 &&
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

        if (type === '2') {
            columns.splice(columns.length - 2, 0, {
                title: '分值',
                dataIndex: 'weight',
                key: 'weight',
                width: 100,
            }, {
                title: '权重',
                dataIndex: 'score',
                key: 'score',
                width: 100,
            });
        }

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
                        roles('R_B_PLY_policy_st_rule_view') &&
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
                        roles('R_B_PLY_policy_st_rule_rst') &&
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
                        roles('R_B_PLY_policy_st_rule_add') && Number(status) === 0 &&
                    <RegularModal
                        stageId={stageId}
                        ruleName={ruleName}
                        onOk={this.modalOk}
                    >
                        <Button type="primary" style={{ marginRight: 20 }}>
                            新增规则
                        </Button>
                    </RegularModal>
                    }
                    {
                        roles('R_B_PLY_policy_st_rule_cle') && Number(status) === 0 &&
                    <RegularEdit
                        type="clone"
                        stageType={type}
                        record={selectedRow}
                        disabled={selectedRowKeys.length === 0}
                        onOk={this.editOk}
                    >
                        <Button type="primary" disabled={selectedRowKeys.length === 0}>
                            克隆规则
                        </Button>
                    </RegularEdit>
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
