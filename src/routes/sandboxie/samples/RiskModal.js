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

class RiskModal extends React.PureComponent {
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
                            <span className={style.result}>{content.idCardTop6}</span>
                        </Col>
                        <Col span="12">
                            <span>逾期期数：</span>
                            <span className={style.result}>{content.phoneTop7}</span>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '16px' }}>
                        <Col span="12">
                            <span>商品类型：</span>
                            <span className={style.result}>{content.ages}</span>
                        </Col>
                        <Col span="12">
                            <span>已付期数：</span>
                            <span className={style.result}>{content.agee}</span>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '16px' }}>
                        <Col span="12">
                            <span>下单时间：</span>
                            <span className={style.result}>{moment(content.orderTimes * 1000).format('YYYY-MM-DD')}&nbsp;-&nbsp;{moment(content.orderTimee * 1000).format('YYYY-MM-DD')}</span>
                        </Col>
                    </Row>
                </Modal>
            </span>
        );
    }
}
export default Form.create()(RiskModal);
