import React from 'react';
import {
    Modal,
    Form,
    Button,
    Table,
} from 'antd';
import { connect } from 'dva';
import styles from './RegularDetail.scss';

const FormItem = Form.Item;

@connect((state) => ({
    ruleView: state.regularPly.ruleView,
    normList: state.regularPly.normList,
}))
export default class RegularDetail extends React.PureComponent {
    state = {
        visible: false,
    };

    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };

    showModelHandler = () => {
        const { id } = this.props;
        this.props.dispatch({
            type: 'regularPly/ruleView',
            payload: {
                id,
            }
        });
        this.setState({
            visible: true,
        });
    };
    render() {
        const {
            normList: dataSource,
            ruleView: record,
            children,
        } = this.props;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 6 },
        };
        const columns = [
            {
                title: '规则字段',
                dataIndex: 'categoryName',
                key: 'categoryName',
                width: 100,
            }, {
                title: '规则配置说明',
                dataIndex: 'indexdescribe',
                key: 'indexdescribe',
                width: 100,
            }, {
                title: '判断符号',
                dataIndex: 'compareSymbol',
                key: 'compareSymbol',
                width: 100,
            }, {
                title: '判定阈值',
                dataIndex: 'judgeValue',
                key: 'judgeValue',
                width: 100,
            },
        ];
        return (
            <span>
                <span
                    role="button"
                    tabIndex="-1"
                    onClick={this.showModelHandler}
                >
                    {children}
                </span>
                <Modal
                    title="详情"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>返回</Button>
                    ]}
                >
                    <Form className={styles.forms}>
                        <FormItem
                            label="规则名称"
                            {...formItemLayout}
                        >
                            <span>{record.name}</span>
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
                            <span>{record.score}</span>
                        </FormItem>
                        <FormItem
                            label="权重"
                            {...formItemLayout}
                        >
                            <span>{record.weight}</span>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                        >
                            <span className={styles.title}>条件配置</span>
                        </FormItem>
                        <FormItem>
                            <Table
                                columns={columns}
                                dataSource={dataSource}
                                pagination={false}
                            />
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        );
    }
}
