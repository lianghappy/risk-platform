import React from 'react';
import {
    Modal,
    Row,
    Col,
    Button,
    Form,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from './RegularDetail.scss';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const mapStateToProps = (state) => ({
    experSelect: state.experiment.experSelect,
});
@connect(mapStateToProps)
@Form.create()
export default class LookRisk extends React.PureComponent {
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
            form,
        } = this.props;
        const {
            getFieldsError,
        } = form;
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
                            disabled={hasErrors(getFieldsError())}
                            onClick={this.handleCancel}
                        >
                            确定
                        </Button>,
                    ]}
                >
                    <div>
                        <Row>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>身份证前6位：</Col>
                                <Col span={16}>{experSelects.idCardTop6}</Col>
                            </Col>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>手机号码前7位：</Col>
                                <Col span={16}>{experSelects.phoneTop7}</Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>年龄开始：</Col>
                                <Col span={16}>{experSelects.ages}</Col>
                            </Col>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>年龄结束：</Col>
                                <Col span={16}>{experSelects.agee}</Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12} className={styles.row}>
                                <Col span={8} className={styles.title}>下单时间：</Col>
                                <Col span={16}>{moment(experSelects.orderTimes * 1000).format('YYYY-MM-DD')}&nbsp;-&nbsp;{moment(experSelects.orderTimee * 1000).format('YYYY-MM-DD')}
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </Modal>
            </span>
        );
    }
}
