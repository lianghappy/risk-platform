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
        typeList: state.orderDetail.typeList,
    };
};
@connect(mapStateToProps)
export default class RiskReport extends React.PureComponent {
    static propTypes ={
        getReport: PropTypes.array.isRequired,
    }
    checkCode = (code) => {
        let name = '';
        this.props.typeList.forEach(item => {
            if (item.code === code) {
                name = item.name;
            }
        });
        return name;
    }
    changeColumn = (ids) => {
        const columns = [
            {
                title: '规则编号',
                dataIndex: 'normId',
                key: 'normId',
                width: 100,
            },
            {
                title: '规则名称',
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
                render: (text, record) => (<span>{this.checkCode(record.channel)}</span>)
            },
            {
                title: '所有类别',
                dataIndex: 'categoryName',
                key: 'categoryName',
                width: 100,
            },
        ];
        if (ids === '2') {
            columns.splice(columns.length - 2, 0,
                {
                    title: '判定规则key',
                    dataIndex: 'judgeKey',
                    key: 'judgeKey',
                    width: 100,
                }, {
                    title: '判定符号',
                    dataIndex: 'compareSymbol',
                    key: 'compareSymbol',
                    width: 100,
                }, {
                    title: '判定阈值',
                    dataIndex: 'judgeValue',
                    key: 'judgeValue',
                    width: 100,
                }, {
                    title: '分值',
                    dataIndex: 'score',
                    key: 'score',
                    width: 100,
                }, {
                    title: '权重',
                    dataIndex: 'weight',
                    key: 'weight',
                    width: 100,
                }
            );
        }
        return columns;
    }
    render() {
        const {
            getReport,
            loading,
        } = this.props;
        return (
            <Layout className={styles.riskReport}>
                {
                    getReport.map((item, index) => {
                        return (
                            <div className={styles.lists} key={index}>
                                <div className={styles.headers}>
                                    <span>阶段排序：{item.stageSort}</span>
                                    <span>阶段名称：{item.stageName }</span>
                                    <span>阶段模式：
                                        {item.stageType === '1' && '最坏匹配'}
                                        {item.stageType === '2' && '权重匹配'}
                                        {item.stageType === '3' && '最好匹配'}
                                        {item.stageType === '4' && '人审预阶段'}
                                    </span>
                                    <span>阶段得分：{item.stageScore}</span>
                                    <span>阶段审核结果：
                                        {item.stageVerifyResult === 'Y' && '风控拒绝'}
                                        {item.stageVerifyResult === 'N' && '风控通过'}
                                    </span>
                                </div>
                                <Table
                                    className={styles.tables}
                                    rowClassName={styles.tableTr}
                                    indentSize={10}
                                    columns={this.changeColumn(item.stageType)}
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
