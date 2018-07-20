import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Form, Input, Transfer, Select, Button, message } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import base64 from 'utils/base64';
import { setPath } from 'utils/path';
import styles from './index.scss';

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
const Option = Select.Option;
const mapStateToProps = (state) => {
    return {
        getPeopleList: state.EditWarningRule.getPeopleList,
        sleuthTargets: state.EditWarningRule.sleuthTargets,
        strategys: state.EditWarningRule.strategys,
        record: state.EditWarningRule.record,
    };
};
@Form.create()
@connect(mapStateToProps)
export default class EditRule extends React.PureComponent {
    static propTypes = {
        getPeopleList: PropTypes.array.isRequired,
        record: PropTypes.object.isRequired,
    }
    state = {
        targetKeys: [],
    }
    componentDidMount() {
        const {
            dispatch,
        } = this.props;
        const id = base64.decode(this.props.match.params.id);
        new Promise((resolve) => {
            dispatch({
                type: 'EditWarningRule/getSingleRule',
                payload: {
                    id,
                    resolve,
                }
            });
            const companyId = JSON.parse(sessionStorage.userInfo).user.company;
            const appId = JSON.parse(sessionStorage.app).id;
            const productId = JSON.parse(sessionStorage.product).id;
            this.props.dispatch({
                type: 'getPeople',
                payload: {
                    pageNum: 1,
                    pageSize: 99,
                    companyId,
                    appId,
                    productId,
                }
            });
        }).then(() => {
            const targetKeys = [];
            if (this.props.record.sleuthTeamNames) {
                const names = this.props.record.sleuthTeamNames.split(',');
                this.props.getPeopleList.forEach((item) => {
                    names.forEach(it => {
                        if (item.title === it) {
                            targetKeys.push(item.key);
                        }
                    });
                });
            }
            this.setState({
                targetKeys,
            });
        });
    }

    onQuery = (e) => {
        e.preventDefault();
        const {
            dispatch,
            form,
            strategys,
            sleuthTargets,
            getPeopleList,
        } = this.props;
        form.validateFields((errors, values) => {
            if (!errors) {
                if (!/^[0-9]*$/.test(values.judgeValue)) {
                    message.error('阈值只能输入数字');
                    return;
                }
                strategys.forEach(item => {
                    if (item.id === values.strategyId) {
                        Object.assign(values, { strategyName: item.name });
                    }
                    if (values.strategyId === 'all') {
                        Object.assign(values, { strategyName: 'all' });
                    }
                });
                sleuthTargets.forEach(item => {
                    if (item.id === values.sleuthTargeId) {
                        Object.assign(values, { sleuthTargetName: item.sleuthTargetName });
                    }
                });
                const team = [];
                values.sleuthTeams.forEach(item => {
                    getPeopleList.forEach(it => {
                        if (item === it.key) {
                            team.push({
                                id: it.key,
                                sleuthTeamName: it.title,
                            });
                        }
                    });
                });
                const product = JSON.parse(sessionStorage.product);
                const app = JSON.parse(sessionStorage.app);
                const companyId = JSON.parse(sessionStorage.userInfo).user.company;
                const addName = JSON.parse(sessionStorage.userInfo).user.realName;
                const sleuthConfigId = base64.decode(this.props.match.params.id);
                Object.assign(values, {
                    productId: product.id,
                    productName: product.name,
                    appId: app.id,
                    appName: app.name,
                    companyId,
                    sleuthTeams: team,
                    addName,
                    sleuthConfigId,
                });
                new Promise((resolve) => {
                    dispatch({
                        type: 'EditWarningRule/update',
                        payload: {
                            data: {
                                ...values,
                            },
                            resolve,
                        },
                    });
                }).then(() => {
                    message.success('成功');
                    this.props.history.push(setPath('/warningRule'));
                });
            }
        });
    }
    cancel = () => {
        window.history.back(-1);
    }
    handleChange = (targetKeys) => {
        this.setState({ targetKeys });
    }
    filterOption = (inputValue, option) => {
        return option.description.indexOf(inputValue) > -1;
    }
    validateName = (rule, value, callback) => {
        if (value && (/[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g.test(value))) {
            callback(rule.message);
        } else {
            callback();
        }
    }
    changeTime = (time) => {
        let TM = '0小时';
        times.forEach((item) => {
            if (moment.duration(Number(item.key), item.type).asSeconds() === Number(time)) {
                TM = item.name;
            }
        });
        return TM;
    }
    render() {
        const {
            strategys,
            sleuthTargets,
            record,
        } = this.props;
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
        const value = [
            { name: '平均值', key: 'avg' },
            { name: '最大值', key: 'max' },
            { name: '最小值', key: 'min' },
        ];
        const judgeKey = [
            { key: '>' },
            { key: '>=' },
            { key: '<' },
            { key: '<=' },
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
                <Form
                    className={styles.addRule}
                    onSubmit={this.onQuery}
                >
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
                                initialValue: record && record.strategyId,
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
                                    <Option value="all">全部</Option>
                                </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        <span className={styles.headers}>2、设置报警规则</span>
                    </Form.Item>
                    <Form.Item
                        label="规则名称"
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('sleuthConfigName', {
                                initialValue: record && record.sleuthConfigName,
                                rules: [
                                    { required: true, message: '请输入报警规则名称' },
                                    { validator: this.validateName, message: '不能输入表情' },
                                    { max: 20, message: '字符最多输入20位' }
                                ]
                            })(
                                <Input placeholder="请输入报警规则名称" style={{ width: '157px' }} />
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="规则描述"
                        {...formItemLayout}
                    >

                        <div>
                            {
                                getFieldDecorator('sleuthTargeId', {
                                    initialValue: record && record.sleuthTargeId,
                                    rules: [
                                        { required: true, message: '请完善规则描述' },
                                    ]
                                })(
                                    <Select style={{ width: '154px' }}>
                                        {
                                            sleuthTargets && sleuthTargets.map((item, index) => {
                                                return (<Option value={item.id} key={index}>{item.sleuthTargetName}</Option>);
                                            })
                                        }
                                    </Select>
                                )
                            }
                            {
                                getFieldDecorator('threshold', {
                                    initialValue: record && Number(record.threshold),
                                    rules: [
                                        { required: true, message: '请输入指标名称' },
                                    ]
                                })(
                                    <Select style={{ width: '154px', marginLeft: '16px' }}>
                                        {
                                            times.map((item) => {
                                                return (
                                                    <Option
                                                        value={moment.duration(Number(item.key), item.type).asSeconds()}
                                                        key={moment.duration(Number(item.key), item.type).asSeconds()}
                                                    >
                                                        {item.name}
                                                    </Option>
                                                );
                                            })
                                        }
                                    </Select>
                                )
                            }
                            {
                                getFieldDecorator('judgeKey', {
                                    initialValue: record && record.judgeKey,
                                    rules: [
                                        { required: true, message: '请输入指标名称' },
                                    ]
                                })(
                                    <Select style={{ width: '154px', marginLeft: '16px' }}>
                                        {
                                            value.map((item, index) => {
                                                return (<Option value={item.key} key={index}>{item.name}</Option>);
                                            })
                                        }
                                    </Select>
                                )
                            }
                            {
                                getFieldDecorator('judgeSymbol', {
                                    initialValue: record && record.judgeSymbol,
                                    rules: [
                                        { required: true, message: '请输入指标名称' },
                                    ]
                                })(
                                    <Select style={{ width: '154px', marginLeft: '16px' }}>
                                        {
                                            judgeKey.map((item, index) => {
                                                return (<Option value={item.key} key={index}>{item.key}</Option>);
                                            })
                                        }
                                    </Select>
                                )
                            }
                            {
                                getFieldDecorator('judgeValue', {
                                    initialValue: record && record.judgeValue,
                                    rules: [
                                        { required: true, message: '请输入指标名称' },
                                    ]
                                })(
                                    <Input style={{ width: '154px', marginLeft: '16px' }} />
                                )
                            }
                        </div>
                    </Form.Item>
                    <Form.Item
                        label="通道沉默时间"
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('silenceTime', {
                                initialValue: record && Number(record.silenceTime),
                                rules: [
                                    { required: true, message: '请选择通道沉默时间' }
                                ]
                            })(
                                <Select style={{ width: '154px' }}>
                                    {
                                        times.map((item) => {
                                            return (
                                                <Option
                                                    value={moment.duration(Number(item.key), item.type).asSeconds()}
                                                    key={moment.duration(Number(item.key), item.type).asSeconds()}
                                                >
                                                    {item.name}
                                                </Option>
                                            );
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
                                initialValue: record && record.alarmCount,
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
                                initialValue: this.state.targetKeys,
                                rules: [
                                    { required: true, message: '请选择通知对象' }
                                ]
                            })(
                                <Transfer
                                    dataSource={this.props.getPeopleList}
                                    showSearch
                                    filterOption={this.filterOption}
                                    targetKeys={this.state.targetKeys}
                                    onChange={this.handleChange}
                                    render={item => item.title}
                                />
                            )
                        }
                    </Form.Item>
                    <Form.Item className={styles.addBtn}>
                        <Button type="primary" style={{ marginRight: '20px' }} htmlType="submit" disabled={this.props.loading}>保存</Button>
                        <Button type="default" onClick={() => this.cancel()}>取消</Button>
                    </Form.Item>
                </Form>
            </Layout>
        );
    }
}
