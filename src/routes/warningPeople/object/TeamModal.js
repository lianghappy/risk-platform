import React from 'react';
import { Modal, Form, Input, Transfer } from 'antd';
// import styles from './index.scss';

const { TextArea } = Input;
@Form.create()
export default class TeamModal extends React.PureComponent {
    state = {
        visible: false,
        mockData: [],
        targetKeys: [],
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {
            form,
            record,
            type,
            onOk,
        } = this.props;
        const that = this;
        form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => {
                    if (type === 'edit') {
                        Object.assign(values, { teamId: record.sleuthTeamId });
                    }
                    values.type = that.props.type;
                    onOk(values, resolve);
                }).then(() => {
                    this.handleCancel();
                });
            }
        });
    };
    showModelHandler = () => {
        this.setState({
            visible: true,
        });
        const mockData = [];
        const targetKeys = [];
        this.props.people.forEach(item => {
            let flag = true;
            const data = {
                key: item.sleuthPersonId,
                title: `${item.sleuthPersonName}[${item.sleuthPersonPhone}]`,
                description: `${item.sleuthPersonName}[${item.sleuthPersonPhone}]`,
            };
            if (this.props.record.sleuthPersonResponses) {
                this.props.record.sleuthPersonResponses.forEach(items => {
                    if (items.sleuthPersonId === item.sleuthPersonId) {
                        targetKeys.push(data.key);
                        flag = false;
                    }
                });
            }
            if (flag) {
                mockData.push(data);
            }
        });
        this.setState({ mockData, targetKeys });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    handleChange = (targetKeys) => {
        this.setState({ targetKeys });
    }
    filterOption = (inputValue, option) => {
        return option.description.indexOf(inputValue) > -1;
    }
    render() {
        const {
            children,
            form,
            record,
        } = this.props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
        };

        return (
            <span>
                <span
                    onClick={this.showModelHandler}
                    role="button"
                    tabIndex="-1"
                >
                    {children}
                </span>
                <Modal
                    width="680px"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    title={this.props.type === 'add' ? '新增收件组' : '编辑收件组'}
                    onOk={this.handleSubmit}
                >
                    <Form>
                        <Form.Item
                            label="组名"
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator('sleuthTeamName',
                                    {
                                        initialValue: record.sleuthTeamName,
                                        rules: [
                                            { required: true, message: '请输入组名' }
                                        ]
                                    },
                                )(
                                    <Input placeholder="请输入组名" />
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            label="备注"
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator('description', {
                                    initialValue: record.description,
                                })(
                                    <TextArea placeholder="请输入" />
                                )
                            }
                        </Form.Item>
                        <Form.Item
                            label="选择联系人"
                            {...formItemLayout}
                        >
                            {
                                getFieldDecorator('personIds',
                                    {
                                        rules: [
                                            { required: true, message: '请选择联系人' }
                                        ]
                                    }
                                )(
                                    <Transfer
                                        dataSource={this.state.mockData}
                                        showSearch
                                        filterOption={this.filterOption}
                                        targetKeys={this.state.targetKeys}
                                        onChange={this.handleChange}
                                        render={item => item.title}
                                        listStyle={{ width: '200px' }}
                                    />
                                )
                            }
                        </Form.Item>
                    </Form>
                </Modal>
            </span>
        );
    }
}
