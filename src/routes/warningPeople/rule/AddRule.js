import React from 'react';
import { Layout, Form, Input, Transfer, Select, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.scss';

const Option = Select.Option;
const mapStateToProps = (state) => {
    return {
        getPeopleList: state.addWarningRule.getPeopleList,
        sleuthTargets: state.addWarningRule.sleuthTargets,
        strategys: state.addWarningRule.strategys,
    };
};
@Form.create()
@connect(mapStateToProps)
export default class AddRule extends React.PureComponent {
    render() {
        const {
            strategys,
            sleuthTargets,
        } = this.props;
        console.log(this.props.strategys);
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 19 },
            },
        };
        const times = [
            { name: '1分钟', key: '1', type: 'minutes' },
            { name: '5分钟', key: '5', type: 'minutes' },
            { name: '30分钟', key: '30', type: 'minutes' },
            { name: '1小时', key: '1', type: 'hours' },
            { name: '2小时', key: '2', type: 'hours' },
            { name: '5小时', key: '5', type: 'hours' },
            { name: '10小时', key: '10', type: 'hours' },
            { name: '12小时', key: '12', type: 'hours' },
            { name: '24小时', key: '24', type: 'hours' },
        ];
        const value = [
            { name: '平均值', key: 'avg' },
            { name: '最大值', key: 'max' },
            { name: '最小值', key: 'sum' },
            { name: '累计值', key: 'min' },
        ];
        const judgeKey = [
            { key: '>' },
            { key: '≥' },
            { key: '<' },
            { key: '≤' },
            { key: '=' },
            { key: '<>' },
        ];
        const count = [
            { num: 1 },
            { num: 2 },
            { num: 3 },
            { num: 4 },
            { num: 5 },
            { num: 6 },
        ];
        return (
            <Layout className="layoutMar">
                <Form className={styles.addRule}>
                    <Form.Item>
                        <span className={styles.headers}>1.关联资源</span>
                    </Form.Item>
                    <Form.Item
                        label="产品名称"
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('productId')(
                                <span>PLD</span>
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="策略名称"
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('strategyId', {
                                rules: [
                                    { required: true, message: '请选择策略名称' }
                                ]
                            })(
                                <Select style={{ width: '275px' }}>
                                    {
                                        strategys && strategys.map((item, index) => {
                                            return (<Option value={item.id} key={index}>{item.name}</Option>);
                                        })
                                    }
                                    <Option value="">全部</Option>
                                </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        <span className={styles.headers}>2、设置报警规则</span>
                    </Form.Item>
                    <Form.Item
                        label="规则描述"
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('rules')(
                                <div>
                                    <Select style={{ width: '154px' }}>
                                        {
                                            sleuthTargets && sleuthTargets.map((item, index) => {
                                                return (<Option value={item.id} key={index}>{item.sleuthTargetName}</Option>);
                                            })
                                        }
                                    </Select>
                                    <Select style={{ width: '154px' }}>
                                        {
                                            times.map((item, index) => {
                                                return (<Option value={item.key} key={index}>{item.name}</Option>);
                                            })
                                        }
                                    </Select>
                                    <Select style={{ width: '154px' }}>
                                        {
                                            value.map((item, index) => {
                                                return (<Option value={item.key} key={index}>{item.name}</Option>);
                                            })
                                        }
                                    </Select>
                                    <Select style={{ width: '154px' }}>
                                        {
                                            judgeKey.map((item, index) => {
                                                return (<Option value={item.key} key={index}>{item.key}</Option>);
                                            })
                                        }
                                    </Select>
                                    <Input style={{ width: '154px' }} />
                                </div>
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="通道沉默时间"
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('silenceTime', {
                                rules: [
                                    { required: true, message: '请选择通道沉默时间' }
                                ]
                            })(
                                <Select style={{ width: '154px' }}>
                                    {
                                        times.map((item, index) => {
                                            return (<Option value={item.key} key={index}>{item.name}</Option>);
                                        })
                                    }
                                </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="连续几次超过阈值后报警"
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('alarmCount', {
                                rules: [
                                    { required: true, message: '请选择连续几次超过阈值后报警' }
                                ]
                            })(
                                <Select style={{ width: '154px' }}>
                                    {
                                        count.map((item) => {
                                            return (<Option key={item.num}>{item.num}</Option>);
                                        })
                                    }
                                </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        <span className={styles.headers}>3、通知对象</span>
                    </Form.Item>
                    <Form.Item
                        label="请选择"
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('sleuthTeams', {
                                rules: [
                                    { required: true, message: '请选择通知对象' }
                                ]
                            })(
                                <Transfer />
                            )
                        }
                    </Form.Item>
                    <Form.Item className={styles.addBtn}>
                        <Button type="primary" style={{ marginRight: '20px' }}>新增</Button>
                        <Button type="default">取消</Button>
                    </Form.Item>
                </Form>
            </Layout>
        );
    }
}
