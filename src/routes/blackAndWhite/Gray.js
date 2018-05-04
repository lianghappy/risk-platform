import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Select, Button, Table, Popconfirm, message } from 'antd';
import { DURATION } from 'utils/constants';
import style from './index.scss';
import Pagination from '../../components/Pagination/Pagination';
import AddModal from './AddModal';

const FormItem = Form.Item;
const Option = Select.Option;

class Gray extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        typeList: PropTypes.array.isRequired,
    };
    onPageChange = (pageNum, pageSize, sysId) => {
        this.query({
            pageNum,
            pageSize,
            sysId,
            type: 2,
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
                type: 0,
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
                type: 'gray/del',
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
                    type: 0,
                });
            });
        });
    }
    onReset = () => {
        const { pageSize, form } = this.props;
        form.resetFields();
        this.query({
            pageNum: 1,
            pageSize,
            type: 0,
        });
    };
    query(payload) {
        this.props.dispatch({
            type: 'gray/getBlackList',
            payload,
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
            { title: '用户手机号', dataIndex: 'phone', key: 'phone' },
            { title: '用户姓名', dataIndex: 'idCardName', key: 'idCardName' },
            { title: '用户身份证号', dataIndex: 'idCard', key: 'idCard' },
            { title: '用户描述', dataIndex: 'description', key: 'description' },
            { title: '操作人员', dataIndex: 'operators', key: 'operators' },
            { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
            { title: '名单来源', dataIndex: 'valueType', key: 'valueType' },
            { title: '名单分类', dataIndex: 'valueType', key: 'valueType' },
            { title: '操作',
                dataIndex: 'valueType',
                key: 'valueType',
                render: (...rest) => (
                    <div className={style.edits}>
                        <Popconfirm
                            placement="topRight"
                            title="是否确认删除"
                            onConfirm={() => this.delete(rest[1].id)}
                        >
                            <span className={style.isEnable}>删除</span>
                        </Popconfirm>
                        <AddModal
                            type="edit"
                            record={rest[1]}
                            onOk={this.modalOk}
                        >
                            <span>编辑</span>
                        </AddModal>
                    </div>) },
        ];
        const options = [];
        if (this.props.typeList) {
            this.props.typeList.forEach((item) => {
                options.push(<Option key={item.name} value={item.name}>{item.name}</Option>);
            });
        }
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="用户手机号" >
                        {
                            getFieldDecorator('id')(<Input placeholder="请输入用户手机号" />)
                        }
                    </FormItem>
                    <FormItem label="身份证号" >
                        {
                            getFieldDecorator('code')(<Input placeholder="请输入身份证号" />)
                        }
                    </FormItem>
                    {/* <FormItem label="身份证号" >
                        {getFieldDecorator('channel')(<Select style={{ width: 150 }} placeholder="请选择规则来源">{options}</Select>)}
                    </FormItem> */}
                    <FormItem label="用户姓名" >
                        {
                            getFieldDecorator('code')(<Input placeholder="请输入用户姓名" />)
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                    </FormItem>
                </Form>
                <AddModal
                    type="add"
                    record={{}}
                    onOk={this.modalOk}
                >
                    <Button type="primary" className={style.add}>新增</Button>
                </AddModal>
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
    list: state.gray.list,
    sysId: state.gray.sysId,
    loading: state.loading.models.gray,
    pageNum: state.gray.pageNum,
    pageSize: state.gray.pageSize,
    typeList: state.gray.typeList,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Gray)));
