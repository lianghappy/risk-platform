import React from 'react';
import { Layout, Table } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import styles from './index.scss';

const mapStateToProps = (state) => {
    return {
        getReport: state.orderDetail.getReport,
        getReportList: state.orderDetail.getReportList,
        loading: state.loading.models.orderDetail,
    };
};
@connect(mapStateToProps)
export default class RiskReport extends React.PureComponent {
    static propTypes ={
        getReport: PropTypes.array.isRequired,
    }
    render() {
        const {
            getReport,
            loading,
        } = this.props;
        const columns = [
            {
                title: '规则编号',
                dataIndex: 'normId',
                key: 'normId',
                width: 100,
            },
            {
                title: '规则编号',
                dataIndex: 'normName',
                key: 'normName',
                width: 100,
            },
            {
                title: '返回值',
                dataIndex: 'riskValue',
                key: 'riskValue',
                width: 100,
            },
            {
                title: '所有来源',
                dataIndex: 'channel',
                key: 'channel',
                width: 100,
            },
            {
                title: '所有类别',
                dataIndex: 'categoryName',
                key: 'categoryName',
                width: 100,
            },
        ];
        return (
            <Layout className={styles.riskReport}>
                {
                    getReport.map((item, index) => {
                        return (
                            <div className={styles.lists} key={index}>
                                <div className={styles.headers}>
                                    <span>阶段排序：{item.stageSort}</span>
                                    <span>阶段名称：{item.stageName }</span>
                                    <span>阶段模式：{item.stageType}</span>
                                    <span>阶段得分：{item.stageScore}</span>
                                    <span>阶段审核结果：{item.stageVerifyResult}</span>
                                </div>
                                <Table
                                    columns={columns}
                                    dataSource={item.normList}
                                    pagination={false}
                                    loading={loading}
                                />
                            </div>
                        );
                    })
                }
            </Layout>
        );
    }
}
