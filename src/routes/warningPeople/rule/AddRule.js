import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Form, Input, Transfer, Select, Button, message, Icon } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import { setPath } from 'utils/path';
import ConditionInput from './conditionInput';
import styles from './index.scss';

const Option = Select.Option;
let uuid = 0;
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
    static propTypes = {
        getPeopleList: PropTypes.array.isRequired,
    }
    state = {
        targetKeys: [],
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
            if (errors && (errors.threshold || errors.judgeKey || errors.judgeValue || errors.judgeSymbol)) {
                message.error('请完善规则描述');
                return;
            }
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
                Object.assign(values, {
                    productId: product.id,
                    productName: product.name,
                    appId: app.id,
                    appName: app.name,
                    companyId,
                    sleuthTeams: team,
                    addName,
                });
                new Promise((resolve) => {
                    dispatch({
                        type: 'addWarningRule/add',
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

    remove(k) {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 0) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    }

    add() {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        uuid++;
        form.setFieldsValue({
            keys: nextKeys,
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

    checkChannel(rule, value, callback) {
        if (value && value.judgeKey && value.judgeValue && value.compareSymbol) {
            callback();
        } else {
            callback('请输入赔付原因和金额!');
        }
    }
    render() {
        const {
            strategys,
            sleuthTargets,
        } = this.props;
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
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        };
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k) => {
            return (
                <Form.Item
                    required={false}
                    key={k}
                    {...formItemLayoutWithOutLabel}
                >
                    <div style={{ display: 'flex' }}>
                        {getFieldDecorator(`judgeConditionList[${k}]`, {
                            validateTrigger: ['onChange'],
                            rules: [{ required: true, validator: (rule, value, callback) => this.checkChannel(rule, value, callback) }],
                        })(
                            <ConditionInput />,
                        )}
                        {keys.length > 0 ? (
                            <Icon
                                className={styles.dynamic_delete_button}
                                type="minus-circle-o"
                                disabled={keys.length === 1}
                                onClick={() => this.remove(k)}
                            />
                        ) : null}
                    </div>
                </Form.Item>
            );
        });
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
                    <Form.Item
                        label="判定条件"
                        {...formItemLayout}
                    >
                        <Icon type="plus-circle-o" onClick={() => this.add()} />
                    </Form.Item>
                    {formItems}
                    <Form.Item>
                        <span className={styles.headers}>2、设置报警规则</span>
                    </Form.Item>
                    <Form.Item
                        label="规则名称"
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('sleuthConfigName', {
                                rules: [
                                    { required: true, message: '请输入报警规则名称' },
                                    { validator: this.validateName, message: '不能输入表情' },
                                    { max: 20, message: '报警规则名称最多20位' }
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
                                    rules: [
                                        { required: true, message: '请输入指标名称' },
                                    ]
                                })(
                                    <Select style={{ width: '154px', marginLeft: '16px' }}>
                                        {
                                            times.map((item, index) => {
                                                return (<Option value={moment.duration(Number(item.key), item.type).asSeconds()} key={index}>{item.name}</Option>);
                                            })
                                        }
                                    </Select>
                                )
                            }
                            {
                                getFieldDecorator('judgeKey', {
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
                                rules: [
                                    { required: true, message: '请选择通道沉默时间' }
                                ]
                            })(
                                <Select style={{ width: '154px' }}>
                                    {
                                        times.map((item, index) => {
                                            return (<Option value={moment.duration(Number(item.key), item.type).asSeconds()} key={index}>{item.name}</Option>);
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
                        <Button type="primary" style={{ marginRight: '20px' }} htmlType="submit" disabled={this.props.loading}>新增</Button>
                        <Button type="default" onClick={() => this.cancel()}>取消</Button>
                    </Form.Item>
                </Form>
            </Layout>
        );
    }
}
