import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import { setPath } from 'utils/path';
import { Input, Form, Button, Col, Row, DatePicker, message } from 'antd';
import style from '../index.scss';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
moment.locale('zh-cn');

class StartExper extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        list: PropTypes.object.isRequired,
    };
    onQuery = (e) => {
        e.preventDefault();
        const {
            loading,
            dispatch,
            form,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            if (errors) { delete errors.name; }
            if (values && values.agee && !(/^[0-9]*$/.test(values.agee))) {
                message.error('年龄请输入数字');
            }
            if (!errors) {
                this.props.handleValue(values);
                if (values && Number(values.agee) < Number(values.ages)) {
                    message.error('最小年龄小于最大年龄');
                    return;
                }
                Object.assign(values, { orderTimes: moment(values.times[0]._d).format('X') });
                Object.assign(values, { orderTimee: moment(values.times[1]._d).format('X') });
                delete values.times;
                const companyId = JSON.parse(sessionStorage.userInfo).user.company;
                Object.assign(values, { companyId });
                new Promise(() => {
                    dispatch({
                        type: 'experiment/start',
                        payload: { ...values },
                    });
                }).then(() => {
                    this.props.history.push(setPath(`/sandboxie/recordHistory/${this.props.match.params.id}`));
                });
            }
        });
    }
    checkNum = (rule, value, callback) => {
        if (value && value.length > 0 && !(/^[0-9]*$/.test(value))) {
            callback(rule.message);
        } else {
            callback();
        }
    }
    disabledDate = (current) => {
        console.log(current);

        // Can not select days before today and today
        return current && current > moment().endOf('day');
    }
    query(payload) {
        this.props.dispatch({
            type: 'experiment/getPolicyList',
            payload,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 12 },
        };
        return (
            <Form className={style.inputs} onSubmit={this.onQuery}>
                <Row>
                    <Col span={12}>
                        <FormItem label="下单时间" {...formItemLayout}>
                            {
                                getFieldDecorator('times', {
                                    rules: [
                                        { required: true, message: '请选择下单时间' },
                                    ],
                                })(<RangePicker
                                    disabledDate={this.disabledDate}
                                    showTime={{
                                        hideDisabledOptions: true,
                                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                    }}
                                />)
                            }
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="身份证号前6位" {...formItemLayout}>
                            {
                                getFieldDecorator('idCardTop6', {
                                    rules: [
                                        { max: 6, message: '只能输入六位数字' },
                                        { validator: this.checkNum, message: '只能输入数字' }
                                    ],
                                })(<Input placeholder="请输入身份证号前6位" />)
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label="手机号前7位" {...formItemLayout}>
                            {
                                getFieldDecorator('phoneTop7', {
                                    rules: [
                                        { max: 7, message: '只能输入七位数字' },
                                        { validator: this.checkNum, message: '只能输入数字' }
                                    ],
                                })(<Input placeholder="请输入手机号前7位" />)
                            }
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label="年龄" {...formItemLayout}>

                            <InputGroup compact>
                                {
                                    getFieldDecorator('ages', {
                                        rules: [
                                            { validator: this.checkNum, message: '只能输入数字' }
                                        ]
                                    })(<Input style={{ width: 100, textAlign: 'center' }} placeholder="最小年龄" />)
                                }
                                <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                                {
                                    getFieldDecorator('agee', {
                                        rules: [
                                            { validator: this.checkNum, message: '只能输入数字' }
                                        ]
                                    })(
                                        <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大年龄" />
                                    )
                                }
                            </InputGroup>

                        </FormItem>
                    </Col>
                </Row>
                <FormItem>
                    <Button style={{ marginLeft: '170px' }} type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>选择样本</Button>
                </FormItem>
            </Form>
        );
    }
}

const mapStateToProps = (state) => ({
    list: state.experiment.list,
    sysId: state.experiment.sysId,
    loading: state.loading.effects['experiment/start'],
});
export default connect(mapStateToProps)(Form.create()(CSSModules(StartExper)));
