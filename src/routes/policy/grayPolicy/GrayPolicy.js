import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Form, Input, Button, Table, message, Select, Popconfirm } from 'antd';
import { DURATION } from 'utils/constants';
// import { roles } from 'utils/common';
import style from './index.scss';
import AddModal from './AddModal';
import Pagination from '../../../components/Pagination/Pagination';
import GrayDetails from './Detail';

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
    onPageChange = (pageNum, pageSize) => {
        const { loading, form } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            this.query({
                ...values,
                pageNum,
                pageSize,
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
           });
       });
   };
   onReset = () => {
       const { pageSize, form } = this.props;
       form.resetFields();
       this.query({
           pageNum: 1,
           pageSize,
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
               type: 'grayPolicy/del',
               payload: {
                   data: { id },
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
               });
           });
       });
   }

   changes = (grayStrategyId) => {
       const {
           dispatch,
           pageSize,
           pageNum,
           form,
       } = this.props;
       new Promise((resolve) => {
           dispatch({
               type: 'grayPolicy/changeStatus',
               payload: {
                   data: {
                       grayStrategyId,
                       status: 1,
                   },
                   resolve,
               },
           });
       }).then(() => {
           message.success('状态更新成功', DURATION);
           form.validateFields((errors, values) => {
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
       const content = data.grayStrategyId === undefined ? '新增成功' : '编辑成功';
       const url = data.grayStrategyId === undefined ? 'grayPolicy/add' : 'grayPolicy/update';
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
               dataIndex: 'id',
               key: 'id',
               width: 100,
           },
           {
               title: '灰度策略名称',
               dataIndex: 'name',
               key: 'name',
               width: 100,
           },
           {
               title: '更新人姓名',
               dataIndex: 'updateAuthor',
               key: 'updateAuthor',
               width: 100,
           },
           {
               title: '更新时间',
               dataIndex: 'updateTime',
               key: 'updateTime',
               width: 100,
           },
           {
               title: '备注',
               dataIndex: 'remark',
               key: 'remark',
               width: 100,
           },
           {
               title: '操作',
               dataIndex: 'operate',
               key: 'operate',
               width: 100,
               render: (text, record) => (
                   <span>
                       {
                           record.status === '0' &&
                           <Popconfirm
                               placement="topRight"
                               title="您确定要上架吗？"
                               onConfirm={() => this.changes(record.id)}
                           >
                               <a>上架</a>
                           </Popconfirm>
                       }
                       <GrayDetails
                           grayStrategyId={record.id}
                       >
                           <a className="jm-del">详情</a>
                       </GrayDetails>
                       {
                           record.status === '0' &&
                           <AddModal
                               visible={false}
                               type="edit"
                               onOk={this.modalOk}
                               record={record.id}
                           >
                               <a className="jm-del" >编辑</a>
                           </AddModal>
                       }
                       {
                           record.status === '0' &&
                           <Popconfirm
                               placement="topRight"
                               title="您确定要删除吗？"
                               onConfirm={() => this.onDelete(record.id)}
                           >
                               <a className="jm-del">删除</a>
                           </Popconfirm>
                       }
                   </span>
               ),
           }
       ];
       return (
           <Layout className={style.container}>
               <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                   <FormItem label="灰度策略名称">
                       {
                           getFieldDecorator('grayStrategyName')(<Input />)
                       }
                   </FormItem>
                   <FormItem label="策略名称">
                       {
                           getFieldDecorator('strategyName')(<Input placeholder="请输入策略名称" />)
                       }
                   </FormItem>
                   <FormItem label="灰度策略标识" >
                       {
                           getFieldDecorator('grayStrategyId')(<Input />)
                       }
                   </FormItem>
                   <FormItem label="状态">
                       {
                           getFieldDecorator('status')(
                               <Select style={{ width: '157px' }}>
                                   <Option value="1">已上架</Option>
                                   <Option value="0">未上架</Option>
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
                   record=""
               >
                   <Button
                       type="primary"
                       className={style.btns}
                   >新增
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
