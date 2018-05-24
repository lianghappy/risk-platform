import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Select, Button, Table, Popconfirm, message, Menu, Tree } from 'antd';
import { DURATION } from 'utils/constants';
import { roles } from 'utils/common';
import treeConvert from 'utils/treeConvert';
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
    };
    state = {
        selectedRows: [],
        disabled: true,
        current: '.$linkRuler',
        idList: [],
        selectedKeys: '',
        ruleName: '',
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
        if (selectedRows.length > 0) {
            const idList = [];
            selectedRows.forEach((item) => {
                idList.push(item.categoryId);
            });
            this.setState({
                disabled: false,
                idList,
            });
        } else {
            this.setState({
                disabled: true,
            });
        }
    }
    onSelect = (selectedKeys) => {
        const {
            pageSize,
            pageNum,
            form,
        } = this.props;
        this.setState({ selectedKeys: selectedKeys[0].substring(selectedKeys[0].indexOf('$') + 1) });
        const categoryId = selectedKeys[0].substring(selectedKeys[0].indexOf('$') + 1);
        form.validateFields((errors, values) => {
            Object.assign(values, { categoryId });
            this.query({
                ...values,
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
            form.validateFields((errors, values) => {
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                });
            });
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
                        {
                            roles('R_B_PLY_catg_linkrl_del') &&
                        <Button icon="delete" />
                        }
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
        const treeDatas = [];
        const { categoryList } = this.props;
        // 树结构
        this.props.categoryList.forEach((item) => {
            if (Number(item.level) === 1) {
                treeDatas.push({
                    title: item.name,
                    key: item.id,
                    children: treeConvert({
                        pId: 'pid',
                        rootId: item.id,
                        id: 'id',
                        name: 'pname',
                        tId: 'key',
                        tName: 'title',
                    }, categoryList),
                });
            }
        });
        return (
            <Layout className={style.container}>
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                >
                    <Menu.Item key="structure">
                        <a href="/categoryStru">类别构建</a>
                    </Menu.Item>
                    <Menu.Item key="linkRuler">
                        关联规则
                    </Menu.Item>
                </Menu>
                <div className={style.layout}>
                    <div className={style.left}>
                        <Tree
                            onSelect={this.onSelect}
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
                            <Button
                                type="primary"
                                onClick={this.delList}
                                className={style.addBtn}
                                disabled={this.state.disabled}
                            >批量删除
                            </Button>
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
});
export default connect(mapStateToProps)(Form.create()(CSSModules(LinkRuler)));
