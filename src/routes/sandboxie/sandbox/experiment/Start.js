import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import base64 from 'utils/base64';
import { Form, Button, Col, Row, Input } from 'antd';
import { setPath } from 'utils/path';
import SampleDetail from './Details';
import style from '../index.scss';

const FormItem = Form.Item;
moment.locale('zh-cn');

class Start extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        total: PropTypes.string.isRequired,
        orderTimes: PropTypes.number.isRequired,
        orderTimee: PropTypes.number.isRequired,
        loading: PropTypes.bool.isRequired,
    };
    state = {
        total: this.props.total,
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            total: nextProps.total,
        });
    }
    starts = (e) => {
        const {
            form,
            dispatch,
            values,
            loading,
        } = this.props;
        e.preventDefault();
        const username = JSON.parse(sessionStorage.userInfo).user.realName;
        const strategyId = base64.decode(this.props.match.params.id);
        if (loading) return;
        form.validateFields((errors, value) => {
            if (!errors) {
                new Promise((resolve) => {
                    dispatch({
                        type: 'experiment/add',
                        payload: {
                            data: {
                                name: value.name,
                                username,
                                strategyId,
                                ...values,
                            },
                            resolve,
                        },
                    });
                }).then(() => {
                    this.props.history.push(setPath(`/sandboxie/recordHistory/${this.props.match.params.id}`));
                });
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 },
        };
        return (
            <div>
                <Form className={style.inputs} name="forms" onSubmit={this.starts} ref={this.forms}>
                    <Row>
                        <Col span={12}>
                            <FormItem label="已选训练样本数量" {...formItemLayout}>
                                <SampleDetail
                                    orderTimes={this.props.orderTimes}
                                    orderTimee={this.props.orderTimee}
                                    {...this.props}
                                >
                                    <a>{this.state.total}</a>
                                </SampleDetail>
                                <span style={{ fontSize: '12px' }}>（点击数量可查看已选训练样本明细）</span>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label="样本名称" {...formItemLayout}>
                                {
                                    getFieldDecorator('name', {
                                        rules: [
                                            { required: true, message: '请输入样本名称' },
                                        ],
                                    })(<Input placeholder="请输入样本名称" />)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem>
                        <Button style={{ marginLeft: '170px' }} type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>开始实验</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    sysId: state.experiment.sysId,
    loading: state.loading.models.experiment,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Start)));
