import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Form, Input, Select, Button, Table, message, Popconfirm } from 'antd';
import CSSModules from 'react-css-modules';
import { DURATION } from 'utils/constants';
import style from './index.scss';
import Pagination from '../../../components/Pagination/Pagination';

const FormItem = Form.Item;
const Option = Select.Option;
class RoleIndex extends React.PureComponent {
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
   };
   onDetail = () => {

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
               type: 'role/del',
               payload: {
                   data: { id: ids },
                   resolve,
               },
           });
       }).then(() => {
           message.success('删除成功', DURATION);
           form.validateFields((errors, values) => {
               Object.assign(values, { sysId: this.props.sysId });
               this.query({
                   ...values,
                   pageNum,
                   pageSize,
               });
           });
       });
   }
   addrole = (e) => {
       e.preventDefault();
       this.props.history.push('/role/addRole');
   }
   query(payload) {
       this.props.dispatch({
           type: 'role/getRoleList',
           payload,
       });
   }
   render() {
       const {
           list: dataSource,
           pageNum,
           pageSize,
           loading,
       } = this.props;
       const { getFieldDecorator } = this.props.form;
       const columns = [
           { title: '角色类型', dataIndex: 'type', key: 'type' },
           { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
           { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
           { title: '操作',
               dataIndex: 'operator',
               key: 'operator',
               render: (...rest) => (
                   <div>
                       <span role="button" tabIndex="-1" className="jm-operate" onClick={() => this.onDetail(rest[1].id)}>详情</span>
                       <Popconfirm
                           placement="topRight"
                           title="是否确定删除？"
                           onConfirm={() => this.onDelete(rest[1].id)}
                       >
                           <span className="jm-del">删除</span>
                       </Popconfirm>
                   </div>
               ) },
       ];
       return (
           <Layout className={style.containers}>
               <Form layout="inline" className={style.inputs}>
                   <FormItem label="角色名称">
                       {
                           getFieldDecorator('roleName')(<Input />)
                       }
                   </FormItem>
                   <FormItem label="角色类型">
                       {
                           getFieldDecorator('type')(<Select style={{ width: 100 }} defaultValue="全部"><Option value="全部">全部</Option><Option value="123" >公司内</Option><Option value="123" >公司外</Option></Select>)
                       }
                   </FormItem>
                   <FormItem>
                       <Button type="primary" htmlType="submit">
                  查询
                       </Button>
                   </FormItem>
                   <FormItem>
                       <Button type="primary" htmlType="submit">
                  重置
                       </Button>
                   </FormItem>
               </Form>
               <Form layout="inline">
                   <FormItem>
                       <Button
                           type="primary"
                           className={style.btns}
                           onClick={this.addrole}
                       >新增角色
                       </Button>
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
           </Layout>);
   }
}
const mapStateToProps = (state) => ({
    list: state.role.list,
    pageNum: state.role.pageNum,
    pageSize: state.role.pageSize,
    loading: state.loading.models.role,
    sysId: state.role.sysId,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(RoleIndex)));
