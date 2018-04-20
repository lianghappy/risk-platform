import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Form, Input, Select, Button, Table } from 'antd';
import CSSModules from 'react-css-modules';
import style from './account.scss';
import AddAccount from '../../components/system/AddAccount';
import Pagination from '../../components/Pagination/Pagination';

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
        this.props.dispatch({
            type: 'account/getAccountListSuc',
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
           type: 'account/getAccountListSuc',
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
   render() {
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
           { title: '操作', dataIndex: 'operator', key: 'operator' },
       ];
       return (
           <Layout className={style.container}>
               <Form layout="inline" className={style.inputs}>
                   <FormItem label="用户账号">
                       <Input />
                   </FormItem>
                   <FormItem label="用户姓名">
                       <Input />
                   </FormItem>
                   <FormItem label="角色名称">
                       <Select style={{ width: 100 }} defaultValue="全部">
                           <Option value="全部">全部</Option>
                           <Option value="123" >123</Option>
                       </Select>
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
               <AddAccount visible={false} >
                   <Button
                       type="primary"
                       className={style.btns}
                       onClick={this.showModal}
                   >新增账号
                   </Button>
               </AddAccount>
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
    list: state.account.list,
    pageNum: state.account.pageNum,
    pageSize: state.account.pageSize,
    loading: state.loading.models.account,
    sysId: state.account.sysId,
});
export default connect(mapStateToProps)(CSSModules(DecisionIndex));
