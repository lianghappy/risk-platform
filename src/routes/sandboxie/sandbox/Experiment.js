import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import { Layout, Input, Form, Button, Col, Row, DatePicker } from 'antd';
import style from './index.scss';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
moment.locale('zh-cn');

class Sandboxie extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
    };
    onQuery = (e) => {
        e.preventDefault();
        const {
            loading,
            form,
            dispatch,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            Object.assign(values, { orderTimes: ((values.times[0]._d).getTime()) / 1000 });
            Object.assign(values, { orderTimee: ((values.times[1]._d).getTime()) / 1000 });
            delete values.times;
            console.log(values);
            new Promise(() => {
                dispatch({
                    type: 'experiment/start',
                    payload: { ...values },
                });
                console.log(this.props.list);
            }).then(() => {
                // this.props.history.push('/sandSamples');
            });
        });
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
            <Layout className={style.container}>
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
                                        showTime={{
                                            hideDisabledOptions: true,
                                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                                        }}
                                    />)
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="身份证号前6位" {...formItemLayout}>
                                {
                                    getFieldDecorator('idCardTop6')(<Input placeholder="请输入身份证号前6位" />)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label="手机号前7位" {...formItemLayout}>
                                {
                                    getFieldDecorator('phoneTop7')(<Input placeholder="请输入手机号前7位" />)
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="年龄" {...formItemLayout}>

                                <InputGroup compact>
                                    {
                                        getFieldDecorator('age')(<Input style={{ width: 100, textAlign: 'center' }} placeholder="最大年龄" />)
                                    }
                                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                                    {
                                        getFieldDecorator('age')(
                                            <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最小年龄" />
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
                <div>
                    <Form className={style.inputs} onSubmit={this.onQuerys}>
                        <Row>
                            <Col span={12}>
                                <FormItem label="样本名称" {...formItemLayout}>
                                    <span>已选训练样本数量：1000条</span>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12}>
                                <FormItem label="样本名称" {...formItemLayout}>
                                    {
                                        getFieldDecorator('times', {
                                            rules: [
                                                { required: true, message: '请选择下单时间' },
                                            ],
                                        })(<Input placeholder="请输入样本名称" />)
                                    }
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem>
                            <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>开始实验</Button>
                        </FormItem>
                    </Form>
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => ({
    list: state.experiment.list,
    sysId: state.experiment.sysId,
    loading: state.loading.models.experiment,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Sandboxie)));
