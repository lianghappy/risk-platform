import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Form, Button, Table, message, Select, DatePicker } from 'antd';
import { DURATION, SYSID } from 'utils/constants';
import moment from 'moment';
// import { roles } from 'utils/common';
import style from './index.scss';
import AddModal from './AddModal';
import Pagination from '../../../components/Pagination/Pagination';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const mapStateToProps = (state) => {
    return {
        list: state.thirdParty.list,
        pageNum: state.thirdParty.pageNum,
        pageSize: state.thirdParty.pageSize,
        loading: state.loading.models.thirdParty,
        typeList: state.thirdParty.typeList,
    };
};
@connect(mapStateToProps)
@Form.create()
export default class ThirdPartyManage extends React.PureComponent {
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
            if (values && values.statisticsDate && values.statisticsDate.length > 0) {
                Object.assign(values, { statisticsDateU: moment(values.statisticsDate[0]._d).format('X') });
                Object.assign(values, { statisticsDateL: moment(values.statisticsDate[1]._d).format('X') });
                delete values.statisticsDate;
            }
            if (values && values.times && values.times.length > 0) {
                Object.assign(values, { startDateU: moment(values.times[0]._d).format('X') });
                Object.assign(values, { startDateL: moment(values.times[1]._d).format('X') });
                delete values.times;
            }
            if (values && values.time && values.time.length > 0) {
                Object.assign(values, { endDateU: moment(values.time[0]._d).format('X') });
                Object.assign(values, { endDateL: moment(values.time[1]._d).format('X') });
                delete values.time;
            }
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
           if (values && values.statisticsDate && values.statisticsDate.length > 0) {
               Object.assign(values, { statisticsDateU: moment(values.statisticsDate[0]._d).format('X') });
               Object.assign(values, { statisticsDateL: moment(values.statisticsDate[1]._d).format('X') });
               delete values.statisticsDate;
           }
           if (values && values.times && values.times.length > 0) {
               Object.assign(values, { startDateU: moment(values.times[0]._d).format('X') });
               Object.assign(values, { startDateL: moment(values.times[1]._d).format('X') });
               delete values.times;
           }
           if (values && values.time && values.time.length > 0) {
               Object.assign(values, { endDateU: moment(values.time[0]._d).format('X') });
               Object.assign(values, { endDateL: moment(values.time[1]._d).format('X') });
               delete values.time;
           }
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
           type: 'thirdParty/getThirdParty',
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
           typeList,
       } = this.props;
       const columns = [
           {
               title: '三方数据源',
               dataIndex: 'thirdparty',
               key: 'thirdparty',
               width: 100,
           },
           {
               title: '产品名称',
               dataIndex: 'productName',
               key: 'productName',
               width: 100,
           },
           {
               title: '调用次数',
               dataIndex: 'phone',
               key: 'phone',
               width: 100,
           },
           {
               title: '成功次数',
               dataIndex: 'company',
               key: 'company',
               width: 100,
           },
           {
               title: '失败次数',
               dataIndex: 'roleType',
               key: 'roleType',
               width: 100,
           },
           {
               title: '已使用金额',
               dataIndex: 'roleName',
               key: 'roleName',
               width: 100,
           },
           {
               title: '总金额',
               dataIndex: 'rental',
               key: 'rental',
               width: 100,
           },
           {
               title: '上线时间',
               dataIndex: 'releaseDate',
               key: 'releaseDate',
               width: 100,
           },
           {
               title: '签约日',
               dataIndex: 'startDate',
               key: 'startDate',
               width: 100,
           },
           {
               title: '到期日',
               dataIndex: 'endDate',
               key: 'endDate',
               width: 100,
           },
           {
               title: '是否免费',
               dataIndex: 'isFree',
               key: 'isFree',
               width: 100,
               render: (text, record) => (<span>{record.isFree === '1' ? '免费' : '付费'}</span>)
           },
           {
               title: '价格',
               dataIndex: 'price',
               key: 'price',
               width: 100,
           },
           {
               title: '收费方式',
               dataIndex: 'chargeType',
               key: 'chargeType',
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
           },
           {
               title: '查得/查询',
               dataIndex: 'operator',
               key: 'operator',
               render: (text, record) => (<span>{record.costType === '1' ? '查得' : '查询'}</span>),
               width: 100,
           },
       ];
       return (
           <Layout className={style.container}>
               <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                   <FormItem label="三方数据源">
                       {
                           getFieldDecorator('thirdparty')(
                               <Select style={{ width: '157px' }}>
                                   {
                                       typeList.map((item, index) => {
                                           return (<Option value={item.code} key={index}>{item.name}</Option>);
                                       })
                                   }
                               </Select>
                           )
                       }
                   </FormItem>
                   <FormItem label="统计时间">
                       {
                           getFieldDecorator('statisticsDate')(
                               <RangePicker
                                   showTime={{
                                       hideDisabledOptions: true,
                                       defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                   }}
                               />
                           )
                       }
                   </FormItem>
                   <FormItem label="签约日" >
                       {
                           getFieldDecorator('times')(<RangePicker
                               showTime={{
                                   hideDisabledOptions: true,
                                   defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                               }}
                           />)
                       }
                   </FormItem>
                   <FormItem label="到期日" >
                       {
                           getFieldDecorator('time')(<RangePicker
                               showTime={{
                                   hideDisabledOptions: true,
                                   defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                               }}
                           />)
                       }
                   </FormItem>
                   <FormItem label="是否免费">
                       {
                           getFieldDecorator('isFree')(
                               <Select style={{ width: '157px' }}>
                                   <Option value="1">免费</Option>
                                   <Option value="0">付费</Option>
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
