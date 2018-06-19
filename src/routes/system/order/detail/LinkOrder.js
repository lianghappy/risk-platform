import React from 'react';
import { connect } from 'dva';
import { Layout, Form, Table, } from 'antd';
import { setPath } from 'utils/path';
import base64 from 'utils/base64';
import Pagination from 'components/Pagination/Pagination';
import styles from './index.scss';

const mapStateToProps = (state) => {
    return {
        orderList: state.orderDetail.orderList,
        pageNum: state.orderDetail.pageNum,
        pageSize: state.orderDetail.pageSize,
        loading: state.loading.models.orderDetail,
    };
};
@connect(mapStateToProps)
@Form.create()
export default class LinkOrder extends React.PureComponent {
    onPageChange = (pageNum, pageSize) => {
        this.query({
            pageNum,
            pageSize,
        });
    };
    detail = (id) => {
        this.props.history.push(setPath(`/orderDetail/${base64.encode(id)}`));
    }
    query(payload) {
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        const sampleId = base64.decode(this.props.match.params.id);
        Object.assign(payload, { companyId, sampleId });
        this.props.dispatch({
            type: 'orderDetail/getOrderList',
            payload,
        });
    }
    render() {
        const {
            orderList: dataSource,
            loading,
            pageSize,
            pageNum,
        } = this.props;
        const columns = [
            { title: '风控订单ID',
                dataIndex: 'sampleId',
                key: 'sampleId',
                render: (text, record) => (<a role="button" tabIndex="-1" onClick={() => this.detail(record.sampleId)}>{record.sampleId}</a>) },
            { title: '调用方唯一标识', dataIndex: 'clientId', key: 'clientId' },
            { title: '风控产品ID', dataIndex: 'productId', key: 'productId' },
            { title: '风控审核状态', dataIndex: 'result', key: 'result' },
            { title: '风控下单时间', dataIndex: 'sampleCreatime', key: 'sampleCreatime' },
            { title: '风控审核结束时间', dataIndex: 'detailCreatime', key: 'detailCreatime' },
            { title: '公司名称', dataIndex: 'orderCompanyName', key: 'orderCompanyName' },
            { title: '策略标识', dataIndex: 'strategyId', key: 'strategyId' },
            { title: '策略名称', dataIndex: 'strategyName', key: 'strategyName' },
            { title: '用户手机号', dataIndex: 'phone', key: 'phone' },
            { title: '用户身份证姓名', dataIndex: 'idcardName', key: 'idcardName' },
            { title: '用户身份证号码', dataIndex: 'idcardNum', key: 'idcardNum' },
        ];
        return (
            <Layout className={styles.linkOrder}>
                <Table
                    style={{ backgroundColor: '#fff' }}
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
