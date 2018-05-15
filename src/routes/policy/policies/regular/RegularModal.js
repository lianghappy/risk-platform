import React from 'react';
import {
    Modal,
    Form,
    Input,
    Table,
    Select,
    Button,
    Cascader,
    Popconfirm,
} from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import cs from 'classnames';
import Pagination from 'components/Pagination/Pagination';
import { rowSelect } from 'utils/common';
import styles from './RegularModal.scss';

@connect((state) => ({
    channels: state.regular.channels,
    categories: state.regular.categories,
    regulars: state.regular.regulars,
    pageNum: state.regular._pageNum,
    loading: state.loading.effects['regular/queryRegular'] || false,
    onSubmiting: state.loading.effects['regular/add'] || false,
}))
@Form.create()
export default class RegularModal extends React.PureComponent {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        form: PropTypes.object.isRequired,
        regulars: PropTypes.array.isRequired,
        pageNum: PropTypes.number.isRequired,
        categories: PropTypes.array.isRequired,
        channels: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
        onSubmiting: PropTypes.bool.isRequired,
    };

    state = {
        visible: false,
        selectedRows: [], // 选中规则
        selectedRowKeys: [],
    };

    onOk = (e) => {
        e.preventDefault();

        new Promise(resolve => {
            this.props.onOk({
                stageId: this.props.stageId,
                categoryAndRuleList: this.state.selectedRows,
            }, resolve);
        }).then(() => {
            this.handleCancel();
        });
    };

    onSelectAll = (selected, selectedRows, changeRows) => {
        const result = rowSelect.onSelectAll(this.state, selected, changeRows);
        const _selectedRows = result.selectedRows;
        const { selectedRowKeys } = result;

        this.setState({
            selectedRows: _selectedRows,
            selectedRowKeys,
        });
    };

    onSelect = (record, selected) => {
        const {
            selectedRows,
            selectedRowKeys,
        } = rowSelect.onSelect(this.state, record, selected);

        this.setState({
            selectedRows,
            selectedRowKeys,
        });
    };

    onDelete = (id) => {
        const {
            selectedRows,
            selectedRowKeys,
        } = rowSelect.onDelete(this.state, id);

        this.setState({
            selectedRows,
            selectedRowKeys,
        });
    };

    onPageChange = (pageNum, pageSize) => {
        const {
            loading,
            form,
        } = this.props;
        if (loading) return;

        form.validateFields((errors, values) => {
            this.query({
                ...values,
                pageNum,
                pageSize,
            });
        });
    };

    onReset = () => {
        this.props.form.resetFields();
        this.query({
            pageNum: 1,
            pageSize: 5,
        });
    };

    onQuery = (e) => {
        e.preventDefault();

        this.props.form.validateFields((errors, values) => {
            this.query({
                ...values,
                pageNum: 1,
                pageSize: 5,
            });
        });
    };

    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false,
            selectedRows: [], // 选中货品
            selectedRowKeys: [],
        });
    };

    showModelHandler = () => {
        this.props.dispatch({
            type: 'regular/queryRegular',
            payload: {
                pageNum: 1,
                pageSize: 5,
            },
        });

        this.setState({
            visible: true,
            selectedRows: [],
            selectedRowKeys: [],
        });
    };

    query(payload) {
        this.props.dispatch({
            type: 'publish/queryRegular',
            payload,
        });
    }

    render() {
        const {
            regulars: dataSource,
            children,
            form,
            loading,
            pageNum,
            channels,
            categories,
            onSubmiting,
            ruleName,
        } = this.props;
        const {
            visible,
            selectedRowKeys,
            selectedRows,
        } = this.state;
        const { getFieldDecorator } = form;
        const addTitle = `你确定要添加这些规则到${ruleName}下吗`;

        const columns = [{
            title: '规则编号',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        }, {
            title: '规则名称',
            dataIndex: 'ruleName',
            key: 'ruleName',
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
        }, {
            title: '规则值类型',
            dataIndex: 'valueType',
            key: 'valueType',
            width: 100,
        }];
        const rowSelection = {
            selectedRowKeys,
            onSelect: this.onSelect,
            onSelectAll: this.onSelectAll,
        };
        const columnsRight = [{
            title: '规则编号',
            dataIndex: 'id',
            key: 'id',
            width: 100,
        }, {
            title: '规则名称',
            dataIndex: 'ruleName',
            key: 'ruleName',
            width: 100,
        }, {
            title: '操作',
            key: 'operate',
            width: 50,
            render: (text, record) => <Button icon="delete" onClick={() => this.onDelete(record.id)} />,
        }];

        return (
            <span>
                <span
                    role="button"
                    tabIndex="-1"
                    onClick={this.showModelHandler}
                >
                    { children }
                </span>
                <Modal
                    title="新增规则"
                    width="89%"
                    bodyStyle={{ padding: 0 }}
                    visible={visible}
                    onCancel={this.handleCancel}
                    onOk={this.handleSubmit}
                    footer={null}
                >
                    <div className={styles.layout}>
                        <div className={styles.left}>
                            <Form
                                className={cs('jm-searchForm', styles.form)}
                                layout="inline"
                                onSubmit={this.onQuery}
                            >
                                <Form.Item label="规则类型">
                                    {
                                        getFieldDecorator('categoryId')(
                                            <Cascader
                                                options={categories}
                                                placeholder=""
                                                changeOnSelect
                                                style={{ width: '270px' }}
                                            />
                                        )
                                    }
                                </Form.Item>
                                <Form.Item label="规则来源">
                                    {getFieldDecorator('channel')(
                                        <Select allowClear>
                                            {channels.map(item => (
                                                <Select.Option value={item.id} key={item.id}>
                                                    {item.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    )}
                                </Form.Item>
                                <Form.Item label="规则名称">
                                    {
                                        getFieldDecorator('ruleName')(<Input />)
                                    }
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        disabled={loading}
                                    >
                                        查询
                                    </Button>
                                </Form.Item>
                                <Form.Item>
                                    <Button
                                        onClick={this.onReset}
                                        disabled={loading}
                                    >
                                        重置
                                    </Button>
                                </Form.Item>

                            </Form>
                            <Table
                                bordered
                                columns={columns}
                                rowSelection={rowSelection}
                                size="small"
                                dataSource={dataSource}
                                style={{ height: 230 }}
                                scroll={{ y: 190 }}
                                rowKey="id"
                                loading={loading}
                                pagination={false}
                            />
                            <Pagination
                                current={pageNum}
                                pageSize={5}
                                dataSize={dataSource.length}
                                onChange={this.onPageChange}
                                showQuickJumper
                            />
                        </div>
                        <div className={styles.right}>
                            <p>已选规则：<span>{this.state.selectedRowKeys.length}</span></p>
                            <Table
                                bordered
                                columns={columnsRight}
                                scroll={{ y: 244 }}
                                size="small"
                                dataSource={selectedRows}
                                rowKey="id"
                                style={{ height: 300 }}
                                pagination={false}
                            />
                            <div className={styles.bottom}>
                                <Button onClick={this.handleCancel}>
                                    取消
                                </Button>
                                <Popconfirm
                                    title={addTitle}
                                    onConfirm={this.onOk}
                                >
                                    <Button
                                        type="primary"
                                        disabled={this.state.selectedRowKeys.length === 0}
                                        loading={onSubmiting}
                                    >
                                        确定
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                    </div>
                </Modal>
            </span>
        );
    }
}
