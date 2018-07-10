import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { roles } from 'utils/common';
import { Layout, Input, Form, Select, Button, Table, message, Tooltip } from 'antd';
import { DURATION } from 'utils/constants';
import style from './index.scss';
import Pagination from '../../../components/Pagination/Pagination';
import AddStruc from './AddStru';

const FormItem = Form.Item;
const Option = Select.Option;

class Structure extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        parentlist: PropTypes.array.isRequired,
    };
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
        const { pageSize, form } = this.props;
        form.resetFields();
        this.query({
            pageNum: 1,
            pageSize,
        });
    };
    query(payload) {
        this.props.dispatch({
            type: 'structure/getStructureList',
            payload,
        });
    }
    modalOk = (data, callback) => {
        const {
            dispatch,
            pageSize,
            pageNum,
            form,
        } = this.props;
        let url = 'structure/add';
        let content = '类别新增';
        if (data.id !== undefined) {
            content = '类别更新成功';
            url = 'structure/update';
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
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            pageSize,
            pageNum,
            list: dataSource,
            loading,
        } = this.props;
        const columns = [
            {
                title: '类别名称',
                dataIndex: 'name',
                key: 'name',
                width: 100,
            },
            {
                title: '类别级别',
                dataIndex: 'level',
                key: 'level',
                width: 100,
            },
            {
                title: '父级别名称',
                dataIndex: 'pname',
                key: 'pname',
                width: 100,
            },
            {
                title: '类别描述',
                dataIndex: 'describ',
                key: 'describ',
                width: 100,
                render: (...rest) => (
                    <Tooltip title={rest[1].describ}>
                        <span style={{ '-webkit-box-orient': 'vertical' }} className="description">
                            {rest[1].describ}
                        </span>
                    </Tooltip>
                ) },
            {
                title: '操作',
                dataIndex: 'operator',
                key: 'operator',
                render: (...rest) => (
                    <div>
                        {
                            roles('R_policy_rule_stru_edit') &&
                    <AddStruc
                        type="edit"
                        record={rest[1]}
                        onOk={this.modalOk}
                        parent={this.props.parentlist}
                    >
                        <Button icon="edit" style={{ marginRight: 5 }} />
                    </AddStruc>
                        }
                    </div>
                ),
                width: 100,
            },
        ];
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="类别名称" >
                        {
                            getFieldDecorator('name')(<Input placeholder="请输入类别名称" />)
                        }
                    </FormItem>
                    <FormItem label="类别级别" >
                        {getFieldDecorator('level')(<Select style={{ width: 150 }} placeholder="请选择类别级别"><Option value="1">一级类别</Option><Option value="2">二级类别</Option><Option value="3">三级类别</Option></Select>)}
                    </FormItem>
                    <FormItem>
                        {
                            roles('R_policy_rule_stru_qry') &&
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        }
                        {
                            roles('R_policy_rule_stru_rst') &&
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                        }
                    </FormItem>
                </Form>
                {
                    roles('R_policy_rule_stru_add') &&
                <AddStruc
                    visible={false}
                    type="add"
                    record={{}}
                    onOk={this.modalOk}
                    parent={this.props.getParentCategory}
                >
                    <Button
                        type="primary"
                        onClick={this.showModal}
                        className={style.addBtn}
                    >新增
                    </Button>
                </AddStruc>
                }
                <Table
                    columns={columns}
                    loading={loading}
                    dataSource={dataSource}
                    pagination={false}
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
    list: state.structure.list,
    sysId: state.structure.sysId,
    loading: state.loading.models.structure,
    pageNum: state.structure.pageNum,
    pageSize: state.structure.pageSize,
    parentlist: state.structure.parentlist,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Structure)));
