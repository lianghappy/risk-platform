import React from 'react';
import { Layout, Form, Input, Button } from 'antd';
import base64 from 'utils/base64';
import { setPath } from 'utils/path';
import RegularModal from './RegularModal';
import styles from './addRegular.scss';
import SingleInput from './SingleInput';

const FormItem = Form.Item;
let uuid = 1;
@Form.create()
export default class AddRegular extends React.PureComponent {
    state={
        datas: [],
    }

    onSubmit = () => {
        const {
            form,
            dispatch,
        } = this.props;
        form.validateFields((errors, values) => {
            if (!errors) {
                const { datas } = this.state;
                datas.forEach(item => {
                    if ((Object.keys(values.reason)).includes(item.id)) {
                        item.compareSymbol = values.reason[item.id].compareSymbol;
                        item.judgeValue = values.reason[item.id].judgeValue;
                    }
                });
                new Promise((resolve) => {
                    dispatch({
                        type: 'addRegularPly/add',
                        payload: {
                            ...values,
                            resolve,
                        }
                    });
                }).then(() => {
                    const id = this.props.match.params.id;
                    const strategyId = this.props.match.params.stageId;
                    this.props.history.push({
                        pathname: setPath(`/regular/${id}/${strategyId}`),
                    });
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
        console.log(data);
        /* const { datas } = this.state;
        data.categoryAndRuleList.forEach(item => {
            datas.push(item);
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
        console.log(this.state.datas);

        getFieldDecorator('keys', { initialValue: this.state.datas });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k) => {
            return (
                <div key={k.id} style={{ background: 'rgba(250,250,250,1)' }}>
                    <FormItem
                        label="规则字段"
                        {...formItemLayouts}
                    >
                        <span style={{ marginRight: '20px' }}>{k.ruleName}</span>
                        <a role="button" tabIndex="-1" onClick={() => this.remove(k)}>删除</a>
                    </FormItem>
                    <FormItem
                        required={false}
                        label="判定符号"
                        {...formItemLayouts}
                    >
                        <div style={{ display: 'flex' }}>
                            {getFieldDecorator(`reason[${k.id}]`, {
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
                    onSubmit={this.onSubmit}
                >
                    <FormItem
                        label="规则名称"
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('name', {
                                rule: [
                                    {
                                        required: true,
                                        message: '请输入规则名称'
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
                                rule: [
                                    {
                                        required: true,
                                        message: '请输入分值'
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
                                rule: [
                                    {
                                        required: true,
                                        message: '请输入权重'
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
                            <span className={styles.title} style={{ marginRight: '20px' }}>条件配置</span>
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
                        <Button type="primary" htmlType="submit" style={{ marginRight: '24px' }} >新增</Button>
                        <Button type="default">取消</Button>
                    </FormItem>
                </Form>
            </Layout>
        );
    }
}
