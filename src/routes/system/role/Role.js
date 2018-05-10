import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Form, Input, Select, Button, Table } from 'antd';
import CSSModules from 'react-css-modules';
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
        this.props.dispatch({
            type: 'role/getroleListSuc',
            payload: {
                pageNum,
                pageSize,
                sysId,
            },
        });
    };
   onQuery = () => {
       const {
           pageSize,
           dispatch,
           sysId,
       } = this.props;
       dispatch({
           type: 'role/getRoleListSuc',
           payload: {
               pageNum: 1,
               pageSize,
               sysId,
           },
       });
   };
   handleSubmit = (e) => {
       e.preventDefault();
   }
   addrole = (e) => {
       e.preventDefault();
       this.props.history.push('/role/addRole');
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
           { title: '用户账号', dataIndex: 'account', key: 'account' },
           { title: '用户姓名', dataIndex: 'name', key: 'name' },
           { title: '用户手机号', dataIndex: 'tel', key: 'tel' },
           { title: '公司名称', dataIndex: 'connectName', key: 'connectName' },
           { title: '角色类型', dataIndex: 'type', key: 'type' },
           { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
           { title: '启用状态', dataIndex: 'status', key: 'status' },
           { title: '操作', dataIndex: 'operator', key: 'operator' },
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
                   <FormItem>
                       <Button
                           type="primary"
                           className={style.btns}
                           onClick={this.showModal}
                       >批量删除
                       </Button>
                   </FormItem>
               </Form>
               <Table columns={columns} loading={loading} />
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
