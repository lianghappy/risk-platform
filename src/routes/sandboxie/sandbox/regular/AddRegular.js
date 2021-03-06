import React from 'react';
import { Layout, Form, Input, Button, message, Tooltip } from 'antd';
import { connect } from 'dva';
import base64 from 'utils/base64';
import { setPath } from 'utils/path';
import RegularModal from './RegularModal';
import styles from './addRegular.scss';
import SingleInput from './SingleInput';

const FormItem = Form.Item;
let uuid = 0;
@Form.create()
@connect()
export default class AddRegular extends React.PureComponent {
    state={
        datas: [],
    }

    componentDidMount() {
        this.props.dispatch({ type: 'commonRegular/queryCategory' });
        this.props.dispatch({
            type: 'commonRegular/queryCompareSymbol',
            payload: {
                type: 'compareSymbol',
            },
        });
        this.props.dispatch({
            type: 'commonRegular/queryChannel',
            payload: {
                type: 'rule',
            },
        });
    }

    onSubmit = () => {
        const {
            form,
            dispatch,
        } = this.props;
        form.validateFields((errors, values) => {
            if (!values.reason) {
                message.error('请添加规则');
                return;
            }
            if (!errors) {
                const { datas } = this.state;
                const ids = [];
                const normList = [];
                Object.keys(values.reason).forEach(key => {
                    ids.push({
                        compareSymbol: values.reason[key].compareSymbol,
                        judgeValue: values.reason[key].judgeValue,
                        id: key.substring(0, key.length - 1),
                    });
                });
                ids.forEach(item => {
                    let flag = true;
                    datas.forEach(it => {
                        if (it.id === item.id && flag) {
                            flag = false;
                            normList.push({
                                ...it,
                                compareSymbol: item.compareSymbol,
                                judgeValue: item.judgeValue,
                            });
                        }
                    });
                });
                values.normList = normList;
                delete values.keys;
                values.stageId = base64.decode(this.props.match.params.id);
                new Promise((resolve) => {
                    dispatch({
                        type: 'addRegularPly/add',
                        payload: {
                            data: {
                                ...values,
                            },
                            resolve,
                        }
                    });
                }).then(() => {
                    const id = this.props.match.params.id;
                    const strategyId = this.props.match.params.stageId;
                    this.props.history.push(setPath(`/regular/${id}/${strategyId}`));
                });
            }
        });
    }

    remove(k) {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
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

    modalOk = (data, callback) => {
        callback();
        const values = this.state.datas;
        const val = [];
        data.categoryAndRuleList.forEach(item => {
            val.push(item.id);
        });
        values.forEach(item => {
            if (!val.includes(item.id)) {
                data.categoryAndRuleList.push(item);
            }
        });
        /*  data.categoryAndRuleList.forEach(item => {
            if (!val.includes(item.id)) {
                values.push(item);
            }
        }); */

        this.setState({
            datas: data.categoryAndRuleList,
        });
    }

    checkChannel(rule, value, callback) {
        if (value && value.compareSymbol && value.judgeValue) {
            callback();
        } else {
            callback('请输入判定符号和判定阈值');
        }
    }

    checkNum = (rule, value, callback) => {
        if (value && !/^[0-9]*$/.test(value)) {
            callback(rule.message);
        } else {
            callback();
        }
    }

    cancel = () => {
        window.history.back(-1);
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 },
        };
        const formItemLayouts = {
            labelCol: { span: 3 },
            wrapperCol: { span: 8 },
        };
        const stageId = base64.decode(this.props.match.params.id);
        const { getFieldDecorator, getFieldValue } = this.props.form;

        getFieldDecorator('keys', { initialValue: this.state.datas });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
                <div key={k.id + (keys.length - index - 1)} style={{ background: 'rgba(250,250,250,1)' }}>
                    <FormItem
                        label="规则字段"
                        {...formItemLayouts}
                    >
                        <span style={{ marginRight: '20px' }}>{k.name}</span>
                        <a role="button" tabIndex="-1" onClick={() => this.remove(k)}>删除</a>
                    </FormItem>
                    <FormItem
                        label="规则配置说明"
                        {...formItemLayouts}
                    >
                        <Tooltip title={k.indexdescribe}>
                            <span style={{ '-webkit-box-orient': 'vertical' }} className="description">
                                {k.indexdescribe}
                            </span>
                        </Tooltip>
                    </FormItem>
                    <FormItem
                        required={false}
                        label="判定符号"
                        {...formItemLayouts}
                    >
                        <div style={{ display: 'flex' }}>
                            {getFieldDecorator(`reason[${k.id + (keys.length - index - 1)}]`, {
                                validateTrigger: ['onChange'],
                                rules: [{ required: true, validator: (rule, value, callback) => this.checkChannel(rule, value, callback) }],
                            })(
                                <SingleInput value={k} />,
                            )}
                        </div>
                    </FormItem>
                </div>
            );
        });
        return (
            <Layout className="layoutMar">
                <Form
                    className={styles.regular}
                >
                    <FormItem
                        label="规则名称"
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入规则名称',
                                    }, {
                                        max: 100,
                                        message: '字段超长'
                                    }
                                ]
                            })(
                                <Input />
                            )
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                    >
                        <span className={styles.title}>属性配置</span>
                    </FormItem>
                    <FormItem
                        label="分值"
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('score', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入分值'
                                    }, {
                                        validator: this.checkNum,
                                        message: '请输入数字'
                                    }, {
                                        max: 10,
                                        message: '字段超长'
                                    }
                                ]
                            })(
                                <Input />
                            )
                        }
                    </FormItem>
                    <FormItem
                        label="权重"
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('weight', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入权重'
                                    }, {
                                        validator: this.checkNum,
                                        message: '请输入数字'
                                    }, {
                                        max: 10,
                                        message: '字段超长'
                                    }
                                ]
                            })(
                                <Input />
                            )
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                    >
                        <div>
                            <span className={styles.title} style={{ marginRight: '18px' }}>条件配置</span>
                            <RegularModal
                                stageId={stageId}
                                ruleName={{}}
                                onOk={this.modalOk}
                            >
                                <a>
                            新增规则
                                </a>
                            </RegularModal>
                        </div>
                    </FormItem>
                    {formItems}
                    <FormItem>
                        <Button type="primary" onClick={() => this.onSubmit()} style={{ marginRight: '24px' }} >新增</Button>
                        <Button type="default" onClick={() => this.cancel()}>取消</Button>
                    </FormItem>
                </Form>
            </Layout>
        );
    }
}
