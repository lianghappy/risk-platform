import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Select, Button, Row, Col, DatePicker, message } from 'antd';
import moment from 'moment';
// import { DURATION } from 'utils/constants';
import { setPath } from 'utils/path';
import style from '../index.scss';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
moment.locale('zh-cn');
const InputGroup = Input.Group;

const mapStateToProps = (state) => ({
    list: state.creates.list,
    sysId: state.creates.sysId,
    loading: state.loading.models.creates,
});

@connect(mapStateToProps)
class CreateSamples extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
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
            if (values && values.pldScoreUpper && !(/^[0-9]*$/).test(values.pldScoreUpper)) {
                message.error('风控评分请输入数字');
            }

            if (values && values.zhiMaScoreUpper && !(/^[0-9]*$/).test(values.zhiMaScoreUpper)) {
                message.error('芝麻分请输入数字');
            }
            if (values && values.historyMaxOverdueDaysEnd && !(/^[0-9]*$/).test(values.historyMaxOverdueDaysEnd)) {
                message.error('历史最大逾期天数请输入数字');
            }
            if (values && values.overduePeriodsEnd && !(/^[0-9]*$/).test(values.overduePeriodsEnd)) {
                message.error('逾期期数请输入数字');
            }
            if (values && values.nowMaxOverdueDaysEnd && !(/^[0-9]*$/).test(values.nowMaxOverdueDaysEnd)) {
                message.error('当前最大逾期期数请输入数字');
            }
            if (values && values.paidPeriodsEnd && !(/^[0-9]*$/).test(values.paidPeriodsEnd)) {
                message.error('已付期数请输入数字');
            }
            if (!errors) {
                if (values && values.pldScoreUpper && Number(values.pldScoreUpper) < Number(values.pldScorelower)) {
                    message.error('风控评分最高分比最低分高');
                    return;
                }
                if (values && values.zhiMaScoreUpper && Number(values.historyMaxOverdueDaysEnd) < Number(values.historyMaxOverdueDaysStart)) {
                    message.error('历史最大逾期天数结束不能比起始低');
                    return;
                }
                if (values && values.zhiMaScoreUpper && Number(values.zhiMaScoreUpper) < Number(values.zhiMaScorelower)) {
                    message.error('风控评分最高分比最低分高');
                    return;
                }
                if (values && values.zhiMaScoreUpper && Number(values.overduePeriodsEnd) < Number(values.overduePeriodsStart)) {
                    message.error('预期期数结束不能比起始低');
                    return;
                }
                if (values && values.zhiMaScoreUpper && Number(values.paidPeriodsEnd) < Number(values.paidPeriodsStart)) {
                    message.error('已付期数结束不能比起始低');
                    return;
                }
                if (values && values.zhiMaScoreUpper && Number(values.zhiMaScoreUpper) < Number(values.zhiMaScorelower)) {
                    message.error('风控评分最高分比最低分高');
                    return;
                }
                Object.assign(values, { orderTimeStart: moment(values.times[0]._d).format('X') });
                Object.assign(values, { orderTimeEnd: moment(values.times[1]._d).format('X') });
                new Promise((resolve) => {
                    dispatch({
                        type: 'creates/add',
                        payload: {
                            data: { ...values },
                            resolve,
                        },
                    });
                }).then(() => {
                    this.props.history.push(setPath('/sandSamples'));
                });
            }
        });
    }
    checkNum = (rule, value, callback) => {
        if (value && value.length > 0 && !(/^[0-9]*$/).test(value)) {
            callback(rule.message);
        } else {
            callback();
        }
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };
        const { getFieldDecorator } = this.props.form;
        const {
            list,
        } = this.props;
        const lists = {
            channelType: [],
            productType: [],
            businessProcess: [],
            pldResult: [],
            machineResult: [],
            synthesizeResult: [],
            orderType: [],
        };
        list.forEach((item) => {
            switch (item.type) {
            case 'channelType':
                lists.channelType.push(item);
                break;
            case 'orderType':
                lists.orderType.push(item);
                break;
            case 'productType':
                lists.productType.push(item);
                break;
            case 'businessProcess':
                lists.businessProcess.push(item);
                break;
            case 'pldResult':
                lists.pldResult.push(item);
                break;
            case 'machineResult':
                lists.machineResult.push(item);
                break;
            case 'synthesizeResult':
                lists.synthesizeResult.push(item);
                break;
            default:
                break;
            }
        });
        return (
            <Layout className={style.container}>
                <Form className={style.inputs} onSubmit={this.onQuery}>
                    <p>一般分类条件</p>
                    <Row>
                        <Col span={12}>
                            <FormItem label="渠道类型" {...formItemLayout}>
                                {
                                    getFieldDecorator('channelType')(
                                        <Select placeholder="请选择渠道类型" width="200">
                                            {
                                                lists.channelType.map((item) => {
                                                    return (<Option key={item.name} value={item.name}>{item.name}</Option>);
                                                })
                                            }
                                            <Option value="">全部</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="商品类型" {...formItemLayout}>
                                {
                                    getFieldDecorator('productType')(
                                        <Select placeholder="请选择商品类型">
                                            {
                                                lists.productType.map((item) => {
                                                    return (<Option key={item.name} value={item.name}>{item.name}</Option>);
                                                })
                                            }
                                            <Option value="">全部</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label="订单状态" {...formItemLayout}>
                                {
                                    getFieldDecorator('orderStatus')(
                                        <Select placeholder="请选择订单状态">
                                            {
                                                lists.orderType.map((item) => {
                                                    return (<Option key={item.name} value={item.name}>{item.name}</Option>);
                                                })
                                            }
                                            <Option value="">全部</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="业务流程" {...formItemLayout}>
                                {
                                    getFieldDecorator('businessProcess')(
                                        <Select placeholder="请选择业务流程">
                                            {
                                                lists.businessProcess.map((item) => {
                                                    return (<Option key={item.name} value={item.name}>{item.name}</Option>);
                                                })
                                            }
                                            <Option value="">全部</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <p>按时间分类</p>
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
                                            defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                        }}
                                    />)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label="历史最大逾期天数(天)" {...formItemLayout}>
                                <InputGroup compact>
                                    {
                                        getFieldDecorator('historyMaxOverdueDaysStart', {
                                            rules: [
                                                { validator: this.checkNum, message: '请输入数字' }
                                            ]
                                        })(<Input style={{ width: 100, textAlign: 'center' }} />)
                                    }
                                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                                    {
                                        getFieldDecorator('historyMaxOverdueDaysEnd', {
                                            rules: [
                                                { validator: this.checkNum, message: '请输入数字' }
                                            ]
                                        })(
                                            <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} />
                                        )
                                    }
                                </InputGroup>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="逾期期数(期)" {...formItemLayout}>
                                <InputGroup compact>
                                    {
                                        getFieldDecorator('overduePeriodsStart', {
                                            rules: [
                                                { validator: this.checkNum, message: '请输入数字' }
                                            ]
                                        })(<Input style={{ width: 100, textAlign: 'center' }} />)
                                    }
                                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                                    {
                                        getFieldDecorator('overduePeriodsEnd', {
                                            rules: [
                                                { validator: this.checkNum, message: '请输入数字' }
                                            ]
                                        })(
                                            <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} />
                                        )
                                    }
                                </InputGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label="当前最大逾期天数(天)" {...formItemLayout}>
                                <InputGroup compact>
                                    {
                                        getFieldDecorator('nowMaxOverdueDaysStart', {
                                            rules: [
                                                { validator: this.checkNum, message: '请输入数字' }
                                            ]
                                        })(<Input style={{ width: 100, textAlign: 'center' }} />)
                                    }
                                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                                    {
                                        getFieldDecorator('nowMaxOverdueDaysEnd', {
                                            rules: [
                                                { validator: this.checkNum, message: '请输入数字' }
                                            ]
                                        })(
                                            <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} />
                                        )
                                    }
                                </InputGroup>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="已付期数(期)" {...formItemLayout}>
                                <InputGroup compact>
                                    {
                                        getFieldDecorator('paidPeriodsStart', {
                                            rules: [
                                                { validator: this.checkNum, message: '请输入数字' }
                                            ]
                                        })(<Input style={{ width: 100, textAlign: 'center' }} />)
                                    }
                                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                                    {
                                        getFieldDecorator('paidPeriodsEnd', {
                                            rules: [
                                                { validator: this.checkNum, message: '请输入数字' }
                                            ]
                                        })(
                                            <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} />
                                        )
                                    }
                                </InputGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <p>常用分类条件</p>
                    <Row>
                        <Col span={12}>
                            <FormItem label="PLD结果" {...formItemLayout}>
                                {
                                    getFieldDecorator('pldResult')(
                                        <Select placeholder="请选择PLD结果" width="200">
                                            {
                                                lists.pldResult.map((item) => {
                                                    return (<Option key={item.name} value={item.name}>{item.name}</Option>);
                                                })
                                            }
                                            <Option value="">全部</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="机审结果" {...formItemLayout}>
                                {
                                    getFieldDecorator('machineResult')(
                                        <Select placeholder="请选择机审结果">
                                            {
                                                lists.machineResult.map((item) => {
                                                    return (<Option key={item.name} value={item.name}>{item.name}</Option>);
                                                })
                                            }
                                            <Option value="">全部</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label="综合结果" {...formItemLayout}>
                                {
                                    getFieldDecorator('synthesizeResult')(
                                        <Select placeholder="请选择综合结果">
                                            {
                                                lists.synthesizeResult.map((item) => {
                                                    return (<Option key={item.name} value={item.name}>{item.name}</Option>);
                                                })
                                            }
                                            <Option value="">全部</Option>
                                        </Select>
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="风控评分" {...formItemLayout}>
                                {
                                    getFieldDecorator('pldScorelower', {
                                        rules: [
                                            { validator: this.checkNum, message: '请输入数字' }
                                        ]
                                    })(<Input style={{ width: 100, textAlign: 'center' }} placeholder="最低分" />)
                                }
                                <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                                {
                                    getFieldDecorator('pldScoreUpper', {
                                        rules: [
                                            { validator: this.checkNum, message: '请输入数字' }
                                        ]
                                    })(
                                        <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最高分" />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem label="样本名称" {...formItemLayout}>
                                {
                                    getFieldDecorator('analysisSampleName', {
                                        rules: [
                                            { required: true, message: '请输入样本名称' },
                                        ],
                                    })(<Input placeholder="请输入样本名称" />)
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem label="芝麻分" {...formItemLayout}>
                                <InputGroup compact>
                                    {
                                        getFieldDecorator('zhiMaScorelower', {
                                            rules: [
                                                { validator: this.checkNum, message: '请输入数字' }
                                            ]
                                        })(<Input style={{ width: 100, textAlign: 'center' }} placeholder="最低分" />)
                                    }
                                    <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                                    {
                                        getFieldDecorator('zhiMaScoreUpper', {
                                            rules: [
                                                { validator: this.checkNum, message: '请输入数字' }
                                            ]
                                        })(
                                            <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最高分" />
                                        )
                                    }
                                </InputGroup>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>创建样本</Button>
                    </FormItem>
                </Form>
            </Layout>
        );
    }
}

export default (Form.create()(CSSModules(CreateSamples)));
