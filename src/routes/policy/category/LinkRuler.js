import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Select, Button, Table, Popconfirm, message } from 'antd';
import { DURATION } from 'utils/constants';
import style from './index.scss';
import Pagination from '../../../components/Pagination/Pagination';

const FormItem = Form.Item;
const Option = Select.Option;

class LinkRuler extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        typeList: PropTypes.array.isRequired,
        categoryList: PropTypes.array.isRequired,
    };
    state = {
        selectedRows: [],
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
    onDelete(ids) {
        const {
            pageSize,
            pageNum,
            form,
            dispatch,
        } = this.props;
        new Promise((resolve) => {
            dispatch({
                type: 'linkRuler/del',
                payload: {
                    data: { id: ids },
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
    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log(selectedRows);
        if (selectedRows.length > 0) {
            this.setState({
                disabled: false,
            });
        } else {
            this.setState({
                disabled: true,
            });
        }
    }
    query(payload) {
        this.props.dispatch({
            type: 'linkRuler/getLinkRulerList',
            payload,
        });
    }
    render() {
        console.log(this.props.categoryList);
        const { getFieldDecorator } = this.props.form;
        const {
            pageSize,
            pageNum,
            list: dataSource,
            loading,
        } = this.props;
        const columns = [
            { title: '规则编号', dataIndex: 'id', key: 'id' },
            { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName' },
            { title: '判定指定Key', dataIndex: 'judgeKey', key: 'judgeKey' },
            { title: '风险代码', dataIndex: 'code', key: 'code' },
            { title: '规则来源', dataIndex: 'channel', key: 'channel' },
            { title: '规则值类型', dataIndex: 'valueType', key: 'valueType' },
            { title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (...rest) => (
                    <Popconfirm
                        placement="topRight"
                        title="您确定要删除吗？"
                        onConfirm={() => this.onDelete(rest[1].categoryId)}
                    >
                        <Button icon="delete" />
                    </Popconfirm>
                ),
            },
        ];
        const options = [];
        if (this.props.typeList) {
            this.props.typeList.forEach((item) => {
                options.push(<Option key={item.name} value={item.name}>{item.name}</Option>);
            });
        }
        const { selectedRows } = this.state;
        const rowSelection = {
            selectedRows,
            onChange: this.onSelectChange,
        };
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="规则编号" >
                        {
                            getFieldDecorator('ruleId')(<Input placeholder="请输入规则编号" />)
                        }
                    </FormItem>
                    <FormItem label="规则来源" >
                        {getFieldDecorator('channel')(<Select style={{ width: 150 }} placeholder="请选择规则来源">{options}</Select>)}
                    </FormItem>
                    <FormItem label="风险代码" >
                        {
                            getFieldDecorator('code')(<Input placeholder="请输入风险代码" />)
                        }
                    </FormItem>
                    <FormItem label="规则名称" >
                        {
                            getFieldDecorator('ruleName')(<Input placeholder="请输入规则名称" />)
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                    </FormItem>
                </Form>
                <div>
                    <Button
                        type="primary"
                        onClick={this.showModal}
                        className={style.addBtn}
                    >新增规则
                    </Button>
                    <Button
                        type="primary"
                        onClick={this.showModal}
                        className={style.addBtn}
                        disabled={this.state.disabled}
                    >批量删除
                    </Button>
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
    list: state.linkRuler.list,
    sysId: state.linkRuler.sysId,
    loading: state.loading.models.linkRuler,
    pageNum: state.linkRuler.pageNum,
    pageSize: state.linkRuler.pageSize,
    typeList: state.linkRuler.typeList,
    categoryList: state.linkRuler.categoryList,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(LinkRuler)));
