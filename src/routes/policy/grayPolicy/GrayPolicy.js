import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Form, Input, Button, Table, message, Select } from 'antd';
import { DURATION, SYSID } from 'utils/constants';
// import { roles } from 'utils/common';
import style from './index.scss';
import AddModal from './AddModal';
import Pagination from '../../../components/Pagination/Pagination';

const FormItem = Form.Item;
const Option = Select.Option;
const mapStateToProps = (state) => {
    return {
        grayPolicyList: state.grayPolicy.grayPolicyList,
        pageNum: state.grayPolicy.pageNum,
        pageSize: state.grayPolicy.pageSize,
        loading: state.loading.models.grayPolicy,
        typeList: state.grayPolicy.typeList,
    };
};
@connect(mapStateToProps)
@Form.create()
export default class GrayPolicy extends React.PureComponent {
    static propTypes = {
        loading: PropTypes.bool.isRequired,
        dispatch: PropTypes.func.isRequired,
        grayPolicyList: PropTypes.array.isRequired,
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
   modalOk = (data, callback) => {
       const {
           dispatch,
           pageSize,
           pageNum,
           form,
       } = this.props;
       const content = '新增成功';
       new Promise((resolve) => {
           dispatch({
               type: 'thirdParty/add',
               payload: {
                   data,
                   resolve,
               },
           });
       }).then(() => {
           callback();
           message.success(content, DURATION);
           form.validateFields((errors, values) => {
               this.query({
                   ...values,
                   pageNum,
                   pageSize,
               });
           });
       });
   };
   query(payload) {
       Object.assign(payload, { sysId: 'risk' });
       this.props.dispatch({
           type: 'grayPolicy/getGrayPolicyList',
           payload,
       });
   }
   render() {
       const { getFieldDecorator } = this.props.form;
       const {
           grayPolicyList: dataSource,
           pageNum,
           pageSize,
           loading,
       } = this.props;
       const columns = [
           {
               title: '灰度策略标识',
               dataIndex: 'thirdparty',
               key: 'thirdparty',
               width: 100,
           },
           {
               title: '灰度策略名称',
               dataIndex: 'productName',
               key: 'productName',
               width: 100,
           },
           {
               title: '更新人姓名',
               dataIndex: 'phone',
               key: 'phone',
               width: 100,
           },
           {
               title: '更新时间',
               dataIndex: 'company',
               key: 'company',
               width: 100,
           },
           {
               title: '状态',
               dataIndex: 'roleType',
               key: 'roleType',
               width: 100,
           },
           {
               title: '备注',
               dataIndex: 'roleName',
               key: 'roleName',
               width: 100,
           },
           {
               title: '操作',
               dataIndex: 'operate',
               key: 'operate',
               width: 100,
               render: (text, record) => {
                   let str = '';
                   switch (record.chargeType) {
                   case '1':
                       str = '单位,元/次';
                       break;
                   case '2':
                       str = '按月计费';
                       break;
                   case '3':
                       str = '按年计费';
                       break;
                   default:
                       break;
                   }
                   return (<span>{str}</span>);
               },
           }
       ];
       return (
           <Layout className={style.container}>
               <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                   <FormItem label="灰度策略名称">
                       {
                           getFieldDecorator('thirdparty')(<Input />)
                       }
                   </FormItem>
                   <FormItem label="策略名称">
                       {
                           getFieldDecorator('statisticsDate')(<Input placeholder="请输入策略名称" />)
                       }
                   </FormItem>
                   <FormItem label="灰度策略标识" >
                       {
                           getFieldDecorator('times')(<Input />)
                       }
                   </FormItem>
                   <FormItem label="状态">
                       {
                           getFieldDecorator('isFree')(
                               <Select style={{ width: '157px' }}>
                                   <Option value="1">禁用</Option>
                                   <Option value="0">启用</Option>
                                   <Option value="">所有</Option>
                               </Select>
                           )
                       }
                   </FormItem>
                   <FormItem>

                       <Button type="primary" htmlType="submit" disabled={this.props.loading}>
                     查询
                       </Button>

                   </FormItem>
                   <FormItem>
                       <Button type="primary" onClick={this.onReset} disabled={this.props.loading}>
                  重置
                       </Button>
                   </FormItem>

               </Form>
               <AddModal
                   visible={false}
                   type="add"
                   onOk={this.modalOk}
                   record={{}}
               >
                   <Button
                       type="primary"
                       className={style.btns}
                   >新增账号
                   </Button>
               </AddModal>

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
