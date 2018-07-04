import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
    Row,
    Col,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import style from '../index.scss';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const mapStateToProps = (state) => ({
    selects: state.samples.selects,
});
@connect(mapStateToProps)

class SamplesModal extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        // record: PropTypes.object.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]).isRequired,
    };
    state = {
        visible: this.props.visible || false,
    };
    handleShow = () => {
        // this.props.form.validateFields();
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false,
        });
    };
    render() {
        const {
            form,
            children,
            selects,
        } = this.props;
        const content = selects.id !== undefined ? JSON.parse(selects.qureyCondition) : {};
        const {
            getFieldsError,
        } = form;
        return (
            <span>
                <span role="button" tabIndex="0" onClick={this.handleShow}>
                    {children}
                </span>
                <Modal
                    title={this.state.title}
                    visible={this.state.visible}
                    onOk={this.handleCancel}
                    onCancel={this.handleCancel}
                    width="682px"
                    footer={[
                        <Button
                            key="submit"
                            type="primary"
                            disabled={hasErrors(getFieldsError())}
                            onClick={this.handleCancel}
                        >
                            确定
                        </Button>,
                    ]}
                >
                    <Row style={{ marginBottom: '16px' }}>
                        <Col span="12">
                            <span>渠道类型：</span>
                            <span className={style.result}>{content.channelType}</span>
                        </Col>
                        <Col span="12">
                            <span>逾期期数：</span>
                            <span className={style.result}>{content.overduePeriods}</span>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '16px' }}>
                        <Col span="12">
                            <span>商品类型：</span>
                            <span className={style.result}>{content.productType}</span>
                        </Col>
                        <Col span="12">
                            <span>已付期数：</span>
                            <span className={style.result}>{content.paidPeriods}</span>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '16px' }}>
                        <Col span="12">
                            <span>订单状态：</span>
                            <span className={style.result}>{content.orderStatus}</span>
                        </Col>
                        <Col span="12">
                            <span>审核状态：</span>
                            <span className={style.result}>{content.channelType}</span>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '16px' }}>
                        <Col span="12">
                            <span>业务流程：</span>
                            <span className={style.result}>{content.businessProcess}</span>
                        </Col>
                        <Col span="12">
                            <span>下单时间：</span>
                            <span className={style.result}>{moment(content.orderTimeStart * 1000).format('YYYY-MM-DD')}&nbsp;-&nbsp;{moment(content.orderTimeEnd * 1000).format('YYYY-MM-DD')}</span>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '16px' }}>
                        <Col span="12">
                            <span>历史最大逾期天数：</span>
                            <span className={style.result}>{content.historyMaxOverdueDays}</span>
                        </Col>
                        <Col span="12">
                            <span>当前最大逾期天数：</span>
                            <span className={style.result}>{content.nowMaxOverdueDays}</span>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '16px' }}>
                        <Col span="12">
                            <span>PLD评分：</span>
                            <span className={style.result}>{content.pldScorelower}&nbsp;-&nbsp;{content.pldScoreUpper}</span>
                        </Col>
                        <Col span="12">
                            <span>芝麻分：</span>
                            <span className={style.result}>{content.zhiMaScorelower}&nbsp;-&nbsp;{content.zhiMaScoreUpper}</span>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '16px' }}>
                        <Col span="12">
                            <span>机审结果：</span>
                            <span className={style.result}>{content.machineResult}</span>
                        </Col>
                        <Col span="12">
                            <span>PLD结果：</span>
                            <span className={style.result}>{content.pldResult}</span>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '16px' }}>
                        <Col span="12">
                            <span>综合结果：</span>
                            <span className={style.result}>{content.synthesizeResult}</span>
                        </Col>
                    </Row>
                </Modal>
            </span>
        );
    }
}
export default Form.create()(SamplesModal);
