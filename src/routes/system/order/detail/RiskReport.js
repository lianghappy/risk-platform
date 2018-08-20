import React from 'react';
import { Layout, Table, Icon, Col, Row } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import styles from './index.scss';

const mapStateToProps = (state) => {
    return {
        getReport: state.orderDetail.getReport,
        getReportList: state.orderDetail.getReportList,
        loading: state.loading.models.orderDetail,
        typeList: state.orderDetail.typeList,
        categoryList: state.orderDetail.categoryList,
        reportResult: state.orderDetail.reportResult,
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
        const { typeList, categoryList } = this.props;
        const filters = [];
        const category = [];
        typeList.forEach(item => {
            filters.push({
                text: item.name,
                value: item.code,
            });
        });
        categoryList.forEach(item => {
            category.push({
                text: item.name,
                value: item.name,
            });
        });
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
                render: (text, record) => (<span>{this.checkCode(record.channel)}</span>),
                filters,
                onFilter: (value, record) => record.channel.indexOf(value) === 0,
                filterIcon: (<Icon type="search" />),
                filtered: true,
            },
            {
                title: '所有类别',
                dataIndex: 'categoryName',
                key: 'categoryName',
                width: 100,
                filters: category,
                onFilter: (value, record) => record.categoryName.indexOf(value) === 0,
                filterIcon: (<Icon type="search" />),
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
            reportResult,
            getReport,
            loading,
        } = this.props;
        return (
            <Layout className={styles.riskReport}>
                {
                    !reportResult.msg && getReport &&
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
                                        {item.stageVerifyResult === 'Y' && '命中'}
                                        {item.stageVerifyResult === 'N' && '未命中'}
                                    </span>
                                </div>
                                <Table
                                    scroll={{ y: 340 }}
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
                {
                    reportResult.msg &&
                    <div className={styles.lists}>
                        <div>
                            <Row>
                                <Col span={12}>
                                    <span>样本策略评估结果：</span>
                                    <span>{reportResult.result === '0' && '拒绝'}{reportResult.result === '1' && '通过'}{reportResult.result === '2' && '进人审'}</span>
                                </Col>
                                <Col span={12}>
                                    <span>样本策略评估异常信息：</span>
                                    <span>{reportResult.msg}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <span>评估得分：</span>
                                    <span>{reportResult.score}</span>
                                </Col>
                            </Row>
                        </div>
                    </div>
                }
            </Layout>
        );
    }
}
