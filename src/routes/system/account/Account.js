import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Form, Input, Select, Button, Table, Popconfirm, message } from 'antd';
import CSSModules from 'react-css-modules';
import { DURATION, SYSID } from 'utils/constants';
import style from './account.scss';
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
       const { pageSize, form } = this.props;
       form.resetFields();
       this.query({
           pageNum: 1,
           pageSize,
           sysId: SYSID,
       });
   }
   onDelete = (id) => {
       const {
           pageSize,
           pageNum,
           form,
           dispatch,
       } = this.props;
       new Promise((resolve) => {
           dispatch({
               type: 'account/del',
               payload: {
                   data: { id },
                   resolve,
               },
           });
       }).then(() => {
           message.success('删除成功', DURATION);
           form.validateFields((errors, values) => {
               Object.assign(values, { sysId: SYSID });
               this.query({
                   ...values,
                   pageNum,
                   pageSize,
               });
           });
       });
   }
   modalOk = (data, callback) => {
       const {
           dispatch,
           pageSize,
           pageNum,
           form,
       } = this.props;
       const content = data.id !== undefined ? '更新成功' : '新增成功';
       let url = '';
       switch (data.type) {
       case 'add':
           url = 'account/add';
           break;
       case 'edit':
           url = 'account/update';
           break;
       default:
           break;
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
               Object.assign(values, { sysId: SYSID });
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
           type: 'account/queryAccountList',
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
               <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                   <FormItem label="用户账号">
                       {
                           getFieldDecorator('account')(<Input placeholder="请输入用户账号" />)
                       }
                   </FormItem>
                   <FormItem label="用户姓名">
                       {
                           getFieldDecorator('userName')(<Input placeholder="请输入用户姓名" />)
                       }
                   </FormItem>
                   <FormItem label="角色名称">
                       {getFieldDecorator('roleId')(<Select style={{ width: 100 }}>
                           {
                               this.props.roleNameList.map((item) => {
                                   return (
                                       <Option key={item.id} value={item.id}>{item.roleName}</Option>
                                   );
                               })
                           }
                                                    </Select>)}
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
               <AddAccount
                   visible={false}
                   type="add"
                   onOk={this.modalOk}
                   record={{}}
               >
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
                   pageSizeOptions={['10']}
                   showQuickJumper
                   showSizeChanger={false}
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
