import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Table } from 'antd';
import styles from './index.scss';

const FormItem = Form.Item;
const mapStateToProps = (state) => {
    return {
        grayDetails: state.grayPolicy.grayDetails,
        details: state.grayPolicy.details,
    };
};
@connect(mapStateToProps)
@Form.create()
export default class GrayDetails extends React.PureComponent {
    state = {
        visible: this.props.visible || false,
    }

    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false,
        });
    };

    handleShow = () => {
        // this.props.form.validateFields();
        this.setState({
            visible: true,
        });
        const {
            dispatch,
            grayStrategyId,
        } = this.props;
        dispatch({
            type: 'grayPolicy/details',
            payload: {
                grayStrategyId,
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const {
            children,
            grayDetails: dataSource,
            details,
        } = this.props;
        const columns = [
            {
                title: '策略名称',
                dataIndex: 'garyStrategyName',
                key: 'garyStrategyName',
                width: 100,
            }, {
                title: '策略占比(%)',
                dataIndex: 'ratio',
                key: 'ratio',
                width: 100,
            }, {
                title: '策略状态',
                dataIndex: 'status',
                key: 'status',
                width: 100,
                render: (text, record) => (
                    <span>
                        {record.status === '0' && '未上架'}
                        {record.status === '1' && '已上架'}
                        {record.status === '2' && '已下架'}
                    </span>
                )
            },
        ];
        return (
            <span>
                <span role="button" tabIndex="0" onClick={this.handleShow}>
                    {children}
                </span>
                <Modal
                    title="详情"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onOk={this.handleSubmit}
                    footer={[
                        <Button
                            key="submit"
                            type="primary"
                            onClick={this.handleCancel}
                        >
                        确认
                        </Button>,
                    ]}
                >
                    <Form className={styles.tableForm}>
                        <FormItem
                            label="灰度策略名称"
                            {...formItemLayout}
                        >
                            <span>{details.grayStrategyName}</span>
                        </FormItem>
                        <FormItem
                            label="备注"
                            {...formItemLayout}
                        >
                            <span>{details.remark}</span>
                        </FormItem>
                        <FormItem
                            label="策略"
                            colon={false}
                        >
                            <Table
                                columns={columns}
                                dataSource={dataSource}
                                pagination={false}
                                scroll={{ y: 300 }}
                            />
                        </FormItem>
                    </Form>
                </Modal>
            </span>
        );
    }
}
