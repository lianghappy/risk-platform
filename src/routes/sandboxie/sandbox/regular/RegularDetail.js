import React from 'react';
import {
    Modal,
    Row,
    Col,
    Button,
} from 'antd';
import { connect } from 'dva';
import styles from './RegularDetail.scss';

@connect((state) => ({
    channels: state.regular.channels,
}))
export default class RegularDetail extends React.PureComponent {
    state = {
        visible: false,
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    showModelHandler = () => {
        this.setState({
            visible: true,
        });
    };
    checkChannel = (code) => {
        let name = '';
        this.props.channels.forEach(item => {
            if (item.code === code) {
                name = item.name;
            }
        });
        return name;
    }
    render() {
        const {
            record,
            children,
            type,
        } = this.props;

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
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>返回</Button>
                    ]}
                >
                    <div>
                        <Row className={styles.row}>
                            <Col span={8} className={styles.title}>规则类型：</Col>
                            <Col span={16}>{record.categoryName}</Col>
                        </Row>
                        <Row className={styles.row}>
                            <Col span={8} className={styles.title}>规则名称：</Col>
                            <Col span={16}>{record.name}</Col>
                        </Row>
                        <Row className={styles.row}>
                            <Col span={8} className={styles.title}>风险代码：</Col>
                            <Col span={16}>{record.code}</Col>
                        </Row>
                        <Row className={styles.row}>
                            <Col span={8} className={styles.title}>规则来源：</Col>
                            <Col span={16}>{this.checkChannel(record.channel)}</Col>
                        </Row>
                        <Row className={styles.row}>
                            <Col span={8} className={styles.title}>规则值类型：</Col>
                            <Col span={16}>{record.valueType}</Col>
                        </Row>
                        <Row className={styles.row}>
                            <Col span={8} className={styles.title}>判定规则key：</Col>
                            <Col span={16}>{record.judgeKey}</Col>
                        </Row>
                        <Row className={styles.row}>
                            <Col span={8} className={styles.title}>判定符号：</Col>
                            <Col span={16}>{record.compareSymbol}</Col>
                        </Row>
                        <Row className={styles.row}>
                            <Col span={8} className={styles.title}>判定阈值：</Col>
                            <Col span={16}>{record.judgeValue}</Col>
                        </Row>
                        {
                            type === '2' &&
                            <Row className={styles.row}>
                                <Col span={8} className={styles.title}>分值：</Col>
                                <Col span={16}>{record.score}</Col>
                            </Row>
                        }
                        {
                            type === '2' &&
                            <Row className={styles.row}>
                                <Col span={8} className={styles.title}>权重：</Col>
                                <Col span={16}>{record.weight}</Col>
                            </Row>
                        }
                    </div>
                </Modal>
            </span>
        );
    }
}
