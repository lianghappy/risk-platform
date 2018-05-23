import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { roles } from 'utils/common';
import { Layout, Input, Form, Select, Button, Table } from 'antd';
import style from './index.scss';
import Pagination from '../../../components/Pagination/Pagination';

const FormItem = Form.Item;
const Option = Select.Option;

class Permission extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
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
    query(payload) {
        this.props.dispatch({
            type: 'permission/getPermissionList',
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
            { title: '权限ID', dataIndex: 'id', key: 'id' },
            { title: '权限名称', dataIndex: 'name', key: 'name' },
            { title: '权限类型', dataIndex: 'type', key: 'type' },
            { title: '是否显示', dataIndex: 'isShow', key: 'isShow' },
            { title: '排序', dataIndex: 'sort', key: 'sort' },
        ];
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="权限名称" >
                        {
                            getFieldDecorator('name')(<Input placeholder="请输入权限名称" />)
                        }
                    </FormItem>
                    <FormItem label="权限类型" >
                        {getFieldDecorator('type')(<Select style={{ width: 150 }} placeholder="请选择权限类型"><Option value="1">一级类别</Option><Option value="2">二级类别</Option><Option value="3">三级类别</Option></Select>)}
                    </FormItem>
                    <FormItem>
                        {
                            roles('B_system_auth_view') &&
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        }
                        {
                            roles('B_system_auth_reset') &&
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                        }
                    </FormItem>
                </Form>
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
    list: state.permission.list,
    sysId: state.permission.sysId,
    loading: state.loading.models.permission,
    pageNum: state.permission.pageNum,
    pageSize: state.permission.pageSize,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Permission)));
