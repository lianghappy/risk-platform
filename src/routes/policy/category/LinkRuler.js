import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Select, Button, Table, Popconfirm, message, Tree } from 'antd';
import { DURATION } from 'utils/constants';
import { roles } from 'utils/common';
import style from './index.scss';
import RegularModal from './RegularModal';
import Pagination from '../../../components/Pagination/Pagination';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

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
        treeDatas: PropTypes.array.isRequired,
    };
    state = {
        selectedRowKeys: [],
        selectedRows: [],
        idList: [],
        selectedKeys: '',
        ruleName: '',
    };
    componentWillMount() {
        this.props.dispatch({
            type: 'linkRuler/getCategoryList',
        });
    }
    onPageChange = (pageNum, pageSize, sysId) => {
        const { form, loading } = this.props;
        if (loading) return;
        const categoryId = this.state.selectedKeys;
        form.validateFields((errors, values) => {
            this.query({
                ...values,
                pageNum,
                pageSize,
                sysId,
                categoryId,
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
            const categoryId = this.state.selectedKeys;
            this.query({
                ...values,
                pageNum: 1,
                pageSize,
                sysId,
                categoryId,
            });
        });
    }
    onReset = () => {
        const { pageSize, form } = this.props;
        form.resetFields();
        this.setState({ selectedRowKeys: [] });
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
            const categoryId = this.state.selectedKeys;
            form.validateFields((errors, values) => {
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                    categoryId,
                });
            });
        });
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        if (selectedRows.length > 0) {
            const idList = [];
            selectedRows.forEach((item) => {
                idList.push(item.id);
            });
            this.setState({
                idList,
                selectedRows,
                selectedRowKeys,
            });
        }
    }
    onCheck = (keys) => {
        const {
            pageSize,
            pageNum,
            form,
        } = this.props;
        const categoryId = keys[0].substring(keys[0].indexOf('$') + 1);
        this.setState({ selectedKeys: categoryId, selectedRowKeys: [] });
        form.validateFields((errors, values) => {
            this.query({
                ...values,
                categoryId,
                pageNum,
                pageSize,
            });
        });
        this.props.categoryList.forEach((item) => {
            if (categoryId === item.id) {
                this.setState({ ruleName: item.name });
            }
        });
    }
    checkCode = (code) => {
        let name = '';
        this.props.typeList.forEach(item => {
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
                type: 'linkRuler/add',
                payload: {
                    data,
                    resolve,
                },
            });
        }).then(() => {
            callback();
            message.success('规则新增成功', DURATION);
            const categoryId = this.state.selectedKeys;
            form.validateFields((errors, values) => {
                Object.assign(values, { categoryId });
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
            type: 'linkRuler/getLinkRulerList',
            payload,
        });
    }
    delList = () => {
        const {
            pageSize,
            pageNum,
            form,
            dispatch,
        } = this.props;
        const { idList } = this.state;
        new Promise((resolve) => {
            dispatch({
                type: 'linkRuler/delList',
                payload: {
                    data: { idList },
                    resolve,
                },
            });
        }).then(() => {
            message.success('删除成功', DURATION);
            const categoryId = this.state.selectedKeys;
            form.validateFields((errors, values) => {
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                    categoryId,
                });
            });
            this.setState({ selectedRowKeys: [] });
        });
    }
    messages = () => {
        message.error('请选择类别');
    }
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode {...item} key={item.key} />;
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
            { title: '规则编号', dataIndex: 'id', key: 'id', width: 100, },
            { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName', width: 100, },
            { title: '判定指定Key', dataIndex: 'judgeKey', key: 'judgeKey', width: 100, },
            { title: '风险代码', dataIndex: 'code', key: 'code', width: 100, },
            { title: '规则来源', dataIndex: 'channel', key: 'channel', render: (text, record) => (<span>{this.checkCode(record.channel)}</span>), width: 100, },
            { title: '规则值类型', dataIndex: 'valueType', key: 'valueType', width: 100, },
            { title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (...rest) => (
                    <Popconfirm
                        placement="topRight"
                        title="您确定要删除吗？"
                        onConfirm={() => this.onDelete(rest[1].id)}
                    >
                        {
                            roles('R_B_PLY_catg_linkrl_del') &&
                        <Button icon="delete" />
                        }
                    </Popconfirm>
                ),
                width: 100,
            },
        ];
        const options = [];
        if (this.props.typeList) {
            this.props.typeList.forEach((item) => {
                options.push(<Option key={item.code} value={item.code}>{item.name}</Option>);
            });
        }
        const { selectedRows, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            selectedRows,
            onChange: this.onSelectChange,
        };

        const { treeDatas } = this.props;
        return (
            <Layout className={style.container}>
                <div className={style.layout}>
                    <div className={style.left}>
                        <Tree
                            onSelect={(checkedKeys) => this.onCheck(checkedKeys)}
                        >{this.renderTreeNodes(treeDatas)}
                        </Tree>
                    </div>
                    <div className={style.right}>
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
                                {
                                    roles('R_B_PLY_catg_linkrl_view') &&
                                <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                                }
                                {
                                    roles('R_B_PLY_catg_linkrl_reset') &&
                                <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                                }
                            </FormItem>
                        </Form>
                        <div>
                            {
                                this.state.selectedKeys && roles('R_B_PLY_catg_linkrl_add') ?
                                    <RegularModal
                                        onOk={this.modalOk}
                                        categoryId={this.state.selectedKeys}
                                        ruleName={this.state.ruleName}
                                    >
                                        <Button type="primary" style={{ marginRight: 20 }}>
                                        新增规则
                                        </Button>
                                    </RegularModal>
                                    :
                                    <Button type="primary" style={{ marginRight: 20 }} onClick={() => this.messages()}>
                                    新增规则
                                    </Button>
                            }
                            {
                                roles('R_B_PLY_catg_linkrl_listdel') &&
                                <Popconfirm
                                    placement="topRight"
                                    title="您确定要批量删除吗？"
                                    onConfirm={() => this.delList()}
                                >
                                    <Button
                                        type="primary"
                                        className={style.addBtn}
                                        disabled={this.state.selectedRowKeys.length === 0}
                                    >批量删除
                                    </Button>
                                </Popconfirm>
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
                    </div>
                </div>
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
    treeDatas: state.linkRuler.treeDatas,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(LinkRuler)));
