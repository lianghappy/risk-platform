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
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
    };
    onPageChange = (pageNum, pageSize) => {
        const { form, loading } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            this.query({
                ...values,
                pageNum,
                pageSize,
                sysId: 'risk',
            });
        });
    };
    onQuery = (e) => {
        e.preventDefault();
        const {
            pageSize,
            loading,
            form,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            this.query({
                ...values,
                pageNum: 1,
                pageSize,
                sysId: 'risk',
            });
        });
    }
    onReset = () => {
        const { pageSize, form } = this.props;
        form.resetFields();
        this.query({
            pageNum: 1,
            pageSize,
            sysId: 'risk',
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
        const seles = [
            { name: '菜单', key: 'menu' },
            { name: '按钮', key: 'button' },
            { name: '模块', key: 'module' },
        ];
        const columns = [
            { title: '权限ID', dataIndex: 'id', key: 'id' },
            { title: '权限名称', dataIndex: 'name', key: 'name' },
            { title: '权限类型',
                dataIndex: 'type',
                key: 'type',
                render: (...rest) => {
                    let types = '';
                    switch (rest[1].type) {
                    case 'button':
                        types = '按钮';
                        break;
                    case 'menu':
                        types = '菜单';
                        break;
                    case 'module':
                        types = '模块';
                        break;
                    case 'Module':
                        types = '模块';
                        break;
                    default:
                        break;
                    }
                    return (<span>{types}</span>);
                } },
            { title: '是否显示',
                dataIndex: 'isShow',
                key: 'isShow',
                render: (text, record) => (<span>{record.isShow === 'true' ? '是' : '否'}</span>) },
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
                        {getFieldDecorator('type')(
                            <Select style={{ width: '157px' }}>
                                {
                                    seles.map((item, index) => {
                                        return (<Option value={item.key} key={index}>{item.name}</Option>);
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem>
                        {
                            roles('R_B_system_auth_view') &&
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        }
                        {
                            roles('R_B_system_auth_reset') &&
                        <Button type="default" onClick={() => this.onReset()} disabled={this.props.loading}>重置</Button>
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
    loading: state.loading.models.permission,
    pageNum: state.permission.pageNum,
    pageSize: state.permission.pageSize,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Permission)));
