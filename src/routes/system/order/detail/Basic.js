import React from 'react';
import { Layout, Row, Col } from 'antd';
import { connect } from 'dva';
import styles from './index.scss';

const mapStateToProps = (state) => {
    return {
        orderBasic: state.orderDetail.orderBasic
    };
};
@connect(mapStateToProps)
export default class Basic extends React.PureComponent {
    render() {
        const { orderBasic } = this.props;
        return (
            <Layout className={styles.basic}>
                <Row className={styles.columns}>
                    <Col span={12}>
                        <span>风控订单ID：</span>
                        <span className={styles.words}>{orderBasic.sampleId}</span>
                    </Col>
                    <Col span={12}>
                        <span>公司名称：</span>
                        <span>{orderBasic.orderCompanyName}</span>
                    </Col>
                </Row>
                <Row className={styles.columns}>
                    <Col span={12}>
                        <span>授权认证类型：</span>
                        <span>{orderBasic.liveType}</span>
                    </Col>
                    <Col span={12}>
                        <span>调用方唯一标识：</span>
                        <span>{orderBasic.clientId}</span>
                    </Col>
                </Row>
                <Row className={styles.columns}>
                    <Col span={12}>
                        <span>用户手机号：</span>
                        <span>{orderBasic.phone}</span>
                    </Col>
                    <Col span={12}>
                        <span>应用唯一标识：</span>
                        <span>{orderBasic.orderAppId}</span>
                    </Col>
                </Row>
                <Row className={styles.columns}>
                    <Col span={12}>
                        <span>风控产品ID：</span>
                        <span>{orderBasic.productId}</span>
                    </Col>
                    <Col span={12}>
                        <span>用户身份证姓名：</span>
                        <span>{orderBasic.idcardName}</span>
                    </Col>
                </Row>
                <Row className={styles.columns}>
                    <Col span={12}>
                        <span>风控审核状态：</span>
                        <span>{orderBasic.result === 0 && '拒绝'}{orderBasic.result === 1 && '通过'}{orderBasic.result === 2 && '进人审'}</span>
                    </Col>
                    <Col span={12}>
                        <span>策略标识：</span>
                        <span>{orderBasic.strategyId}</span>
                    </Col>
                </Row>
                <Row className={styles.columns}>
                    <Col span={12}>
                        <span>用户身份证号：</span>
                        <span>{orderBasic.idcardNum}</span>
                    </Col>
                    <Col span={12}>
                        <span>风控下单时间：</span>
                        <span>{orderBasic.sampleCreatime}</span>
                    </Col>
                </Row>
                <Row className={styles.columns}>
                    <Col span={12}>
                        <span>策略名称：</span>
                        <span>{orderBasic.strategyName}</span>
                    </Col>
                    <Col span={12}>
                        <span>用户收货地址：</span>
                        <span>{orderBasic.userAddress}</span>
                    </Col>
                </Row>
                <Row className={styles.columns}>
                    <Col span={12}>
                        <span>风控审核结束时间：</span>
                        <span>{orderBasic.detailCreatime}</span>
                    </Col>
                </Row>
            </Layout>
        );
    }
}
