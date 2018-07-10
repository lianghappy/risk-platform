import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Form, Input, Select, Button, Table, Popconfirm, message, Switch } from 'antd';
import CSSModules from 'react-css-modules';
import { DURATION, SYSID } from 'utils/constants';
import { roles } from 'utils/common';
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
    };
    onPageChange = (pageNum, pageSize, sysId) => {
        const { loading, form } = this.props;
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
           form,
           loading,
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
       const userId = JSON.parse(sessionStorage.userInfo).user.id;
       new Promise((resolve) => {
           dispatch({
               type: 'account/del',
               payload: {
                   data: { id, userId, sysId: SYSID },
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
   changes = (value, e) => {
       const {
           dispatch,
           pageNum,
           pageSize,
           form,
       } = this.props;
       delete value.state;
       delete value.createTime;
       const userId = JSON.parse(sessionStorage.userInfo).user.id;
       new Promise((resolve) => {
           dispatch({
               type: 'account/update',
               payload: {
                   data: {
                       state: e,
                       ...value,
                       userId,
                   },
                   resolve,
               },
           });
       }).then(() => {
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
   query(payload) {
       Object.assign(payload, { sysId: 'risk' });
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
           { title: '用户姓名', dataIndex: 'userName', key: 'userName' },
           { title: '用户手机号', dataIndex: 'phone', key: 'phone' },
           { title: '公司名称', dataIndex: 'company', key: 'company' },
           { title: '角色类型',
               dataIndex: 'roleType',
               key: 'roleType',
               render: (...rest) => (<span>{rest[1].roles[0].roleType}</span>) },
           { title: '角色名称',
               dataIndex: 'roleName',
               key: 'roleName',
               render: (...rest) => (<span>{rest[1].roles[0].roleName}</span>) },
           { title: '启用状态',
               dataIndex: 'status',
               key: 'status',
               render: (text, record) => (
                   <div>
                       {
                           roles('R_system_acc_state') ?
                               <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={(e) => this.changes(record, e)} checked={record.state === 'true'} />
                               :
                               <Switch checkedChildren="开启" unCheckedChildren="关闭" disabled checked={record.state === 'true'} />
                       }
                   </div>
               ) },
           { title: '操作',
               dataIndex: 'operator',
               key: 'operator',
               render: (...rest) => (
                   <div>
                       {
                           roles('R_system_acc_up') &&
                           <AddAccount
                               visible={false}
                               type="edit"
                               onOk={this.modalOk}
                               record={rest[1]}
                           >
                               <span className="jm-operate">修改</span>
                           </AddAccount>
                       }
                       {
                           roles('R_system_acc_del') &&
                       <Popconfirm
                           placement="topRight"
                           title="您确定要删除该账号吗？"
                           onConfirm={() => this.onDelete(rest[1].id)}
                       >
                           <span className="jm-del">删除</span>
                       </Popconfirm>
                       }
                   </div>
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
                       {getFieldDecorator('roleId')(
                           <Select style={{ width: 100 }}>
                               {
                                   this.props.roleNameList.map((item) => {
                                       return (
                                           <Option key={item.id} value={item.id}>{item.roleName}</Option>
                                       );
                                   })
                               }
                           </Select>
                       )}
                   </FormItem>
                   <FormItem>
                       {
                           roles('R_B_system_user_view') &&
                          <Button type="primary" htmlType="submit" disabled={this.props.loading}>
                     查询
                          </Button>
                       }
                   </FormItem>
                   {
                       roles('R_system_acc_rst') &&
                   <FormItem>
                       <Button type="primary" onClick={this.onReset} disabled={this.props.loading}>
                  重置
                       </Button>
                   </FormItem>
                   }
               </Form>
               {
                   roles('R_system_acc_add') &&
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
               }
               <Table
                   columns={columns}
                   loading={loading}
                   pagination={false}
                   dataSource={dataSource}
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
