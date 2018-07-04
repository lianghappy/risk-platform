import React from 'react';
import {
    Modal,
    Row,
    Col,
    Button,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from './RegularDetail.scss';

const mapStateToProps = (state) => ({
    experSelect: state.experiment.experSelect,
});
@connect(mapStateToProps)
export default class LookModal extends React.PureComponent {
    state = {
        visible: false,
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    showModelHandler = () => {
        const { analysisSampleId, type } = this.props;
        this.props.dispatch({
            type: 'experiment/selectQuery',
            payload: { analysisSampleId, type }
        });
        this.setState({
            visible: true,
        });
    };

    render() {
        const {
            children,
            experSelect,
        } = this.props;
        const experSelects = experSelect.id !== undefined ? JSON.parse(experSelect.qureyCondition) : {};
        return (
            <span>
                <span
                    role="button"
                    tabIndex="-1"
                    onClick={this.showModelHandler}
                >
                    {children}
                </span>
                <Modal
                    title="详情"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onOk={this.handleSubmit}
                    width="810px"
                    height="700px"
                    footer={[
                        <Button
                            key="submit"
                            type="primary"
                            onClick={this.handleCancel}
                        >
                            确定
                        </Button>,
                    ]}
                >
                    <div>
                        <Row>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>渠道类型：</Col>
                                <Col span={16}>{experSelects.categoryName}</Col>
                            </Col>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>逾期期数：</Col>
                                <Col span={16}>{experSelects.name}</Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>商品类型：</Col>
                                <Col span={16}>{experSelects.code}</Col>
                            </Col>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>已付期数：</Col>
                                <Col span={16}>{experSelects.channel}</Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>订单状态：</Col>
                                <Col span={16}>{experSelects.valueType}</Col>
                            </Col>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>审核状态：</Col>
                                <Col span={16}>{experSelects.judgeKey}</Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>业务流程：</Col>
                                <Col span={16}>{experSelects.compareSymbol}</Col>
                            </Col>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>下单时间：</Col>
                                <Col span={16}>{moment(experSelects.orderTimeStart * 1000).format('YYYY-MM-DD')}&nbsp;-&nbsp;{moment(experSelects.orderTimeEnd * 1000).format('YYYY-MM-DD')}
                                </Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>历史最大逾期天数：</Col>
                                <Col span={16}>{experSelects.score}</Col>
                            </Col>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>当前最大逾期天数：</Col>
                                <Col span={16}>{experSelects.score}</Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>PLD评分：</Col>
                                <Col span={16}>{experSelects.score}</Col>
                            </Col>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>芝麻分：</Col>
                                <Col span={16}>{experSelects.score}</Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>机审结果：</Col>
                                <Col span={16}>{experSelects.weight}</Col>
                            </Col>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>PLD结果：</Col>
                                <Col span={16}>{experSelects.score}</Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>综合结果：</Col>
                                <Col span={16}>{experSelects.weight}</Col>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </span>
        );
    }
}
