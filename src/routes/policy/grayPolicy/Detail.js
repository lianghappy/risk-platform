import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Table } from 'antd';

const FormItem = Form.Item;
const mapStateToProps = (state) => {
    return {
        grayDetails: state.grayPolicy.grayDetails,
        garyStrategyName: state.grayPolicy.garyStrategyName,
        remark: state.grayPolicy.remark,
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
        const {
            children,
            grayDetails: dataSource,
            garyStrategyName,
            remark,
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
                dataIndex: 'id',
                key: 'id',
                width: 100,
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
                    <Form>
                        <FormItem
                            label="灰度策略名称"
                        >
                            <span>{garyStrategyName}</span>
                        </FormItem>
                        <FormItem
                            label="备注"
                        >
                            <span>{remark}</span>
                        </FormItem>
                        <FormItem
                            label="策略"
                        >
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
