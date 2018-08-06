import React from 'react';
import { Layout, Form, Input, Icon } from 'antd';
import base64 from 'utils/base64';
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

    modalOk = (data) => {
        console.log(data);
        this.setState({
            datas: data.categoryAndRuleList,
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 },
        };
        const stageId = base64.decode(this.props.match.params.id);
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: this.state.datas });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k) => {
            return (
                <FormItem
                    required={false}
                    key={k.id}
                >
                    <div style={{ display: 'flex' }}>
                        {getFieldDecorator(`reason[${k.id}]`, {
                            validateTrigger: ['onChange'],
                            rules: [{ required: true, validator: (rule, value, callback) => this.checkChannel(rule, value, callback) }],
                        })(
                            <SingleInput data={k} />,
                        )}
                        {keys.length > 1 ? (
                            <Icon
                                className={styles.dynamic_delete_button}
                                type="minus-circle-o"
                                disabled={keys.length === 1}
                                onClick={() => this.remove(k)}
                            />
                        ) : null}
                    </div>
                </FormItem>
            );
        });
        return (
            <Layout className="layoutMar">
                <Form className={styles.regular}>
                    <FormItem
                        label="规则名称"
                        {...formItemLayout}
                    >
                        <Input />
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
                        <Input />
                    </FormItem>
                    <FormItem
                        label="权重"
                        {...formItemLayout}
                    >
                        <Input />
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
                </Form>
            </Layout>
        );
    }
}
