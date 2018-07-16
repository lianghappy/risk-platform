import React from 'react';
import { Layout, Form, Input } from 'antd';
import base64 from 'utils/base64';
import RegularModal from './RegularModal';
import styles from './addRegular.scss';

const FormItem = Form.Item;
@Form.create()
export default class AddRegular extends React.PureComponent {
    render() {
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 6 },
        };
        const stageId = base64.decode(this.props.match.params.id);
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
                </Form>
            </Layout>
        );
    }
}
