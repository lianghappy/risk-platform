import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Form, Input, Select, Button, Table, Popconfirm } from 'antd';
import CSSModules from 'react-css-modules';
import style from './account.scss';
import SystemManage from '../Index';
import AddAccount from './AddAccount';
import Pagination from '../../../components/Pagination/Pagination';

const FormItem = Form.Item;
const Option = Select.Option;
class DecisionIndex extends React.PureComponent {
    static propTypes = {
        loading: PropTypes.bool.isRequired,
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        sysId: PropTypes.string.isRequired,
        roleNameList: PropTypes.array.isRequired,
    };
    onPageChange = (pageNum, pageSize, sysId) => {
        this.query({
            pageNum,
            pageSize,
            sysId,
        });
    };
   onQuery = () => {
       const {
           pageSize,
           dispatch,
           sysId,
       } = this.props;
       dispatch({
           type: 'account/queryAccountList',
           payload: {
               pageNum: 1,
               pageSize,
               sysId,
           },
       });
   };
   onReset = () => {
       console.log('11111');
   }
   onDelete = (id) => {
       console.log(id);
   }
   handleSubmit = (e) => {
       e.preventDefault();
   }
   query(payload) {
       this.props.dispatch({
           type: 'archive/queryAccountList',
           payload,
       });
   }
   render() {
       const { getFieldDecorator } = this.props.form;
       const {
           list: dataSource,
           pageNum,
           pageSize,
           loading,
       } = this.props;
       console.log(this.props.roleNameList);
       const columns = [
           { title: '用户账号', dataIndex: 'account', key: 'account' },
           { title: '用户姓名', dataIndex: 'name', key: 'name' },
           { title: '用户手机号', dataIndex: 'tel', key: 'tel' },
           { title: '公司名称', dataIndex: 'connectName', key: 'connectName' },
           { title: '角色类型', dataIndex: 'type', key: 'type' },
           { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
           { title: '启用状态', dataIndex: 'status', key: 'status' },
           { title: '操作',
               dataIndex: 'operator',
               key: 'operator',
               render: (...rest) => (
                   <Popconfirm
                       placement="topRight"
                       title="是否确定删除？"
                       onConfirm={() => this.onDelete(rest[1].id)}
                   >
                       <Button icon="delete" />
                   </Popconfirm>
               ) },
       ];
       return (
           <Layout className={style.container}>
               <SystemManage current="account" />
               <Form layout="inline" className={style.inputs}>
                   <FormItem label="用户账号">
                       {
                           getFieldDecorator('account')(<Input />)
                       }
                   </FormItem>
                   <FormItem label="用户姓名">
                       {
                           getFieldDecorator('userName')(<Input />)
                       }
                   </FormItem>
                   <FormItem label="角色名称">
                       {getFieldDecorator('roleType')(<Select style={{ width: 100 }} defaultValue="全部" allowClear><Option value="全部">全部</Option><Option value="123" >123</Option></Select>)}
                   </FormItem>
                   <FormItem>
                       <Button type="primary" htmlType="submit" isabled={this.props.loading}>
                  查询
                       </Button>
                   </FormItem>
                   <FormItem>
                       <Button type="primary" onClick={this.onReset} isabled={this.props.loading}>
                  重置
                       </Button>
                   </FormItem>
               </Form>
               <AddAccount visible={false} >
                   <Button
                       type="primary"
                       className={style.btns}
                       onClick={this.showModal}
                   >新增账号
                   </Button>
               </AddAccount>
               <Table
                   columns={columns}
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
           </Layout>);
   }
}
const mapStateToProps = (state) => ({
    list: state.account.list,
    pageNum: state.account.pageNum,
    pageSize: state.account.pageSize,
    loading: state.loading.models.account,
    sysId: state.account.sysId,
    roleNameList: state.account.roleNameList,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(DecisionIndex)));
