import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
    Input,
    Select,
    Icon,
} from 'antd';
import { connect } from 'dva';
import styles from './index.scss';

let uuid = 0;
// const FormItem = Form.Item;

// function hasErrors(fieldsError) {
//     return Object.keys(fieldsError).some(field => fieldsError[field]);
// }
const Option = Select.Option;
const { TextArea } = Input;
let timeout;
const mapStateToProps = (state) => ({
    grayDetails: state.grayPolicy.grayDetails,
    details: state.grayPolicy.details,
    getPolicyList: state.grayPolicy.getPolicyList,
    loading: state.loading.effects['grayPolicy/add'] || false,
});
@connect(mapStateToProps)
@Form.create()
export default class PolicyModal extends React.PureComponent {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]).isRequired,
        onOk: PropTypes.func.isRequired,
        type: PropTypes.string.isRequired,
        record: PropTypes.object.isRequired,
        visible: PropTypes.bool.isRequired,
    };

    state = {
        visible: this.props.visible || false,
        // data: [],
        value: '',
        details: {},
        grayDetails: [],
    };
    onSearch = (value) => {
        const {
            dispatch,
        } = this.props;
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        dispatch({
            type: 'grayPolicy/getPolicySelect',
            payload: {
                companyId,
                pageNum: 1,
                pageSize: 100,
                name: value,
            },
        });
    }
    remove = (k) => {
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
    add = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        uuid++;
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {
            form,
            record,
            type,
            onOk,
        } = this.props;
        // const userId = JSON.parse(sessionStorage.userInfo).user.id;
        form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => {
                    if (type === 'edit') {
                        Object.assign(values, { grayStrategyId: record });
                    }
                    const details = [];
                    values.keys.forEach((item, index) => {
                        details.push({
                            strategyId: values.strategyName[index].key,
                            strategyName: values.strategyName[index].label,
                            ratio: values.ratio[index],
                        });
                    });
                    delete values.keys;
                    Object.assign(values, { details });
                    onOk(values, resolve);
                }).then(() => {
                    this.handleCancel();
                });
            }
        });
    };

    handleShow = () => {
        // this.props.form.validateFields();
        if (this.props.record) {
            const {
                dispatch,
                record,
            } = this.props;
            dispatch({
                type: 'grayPolicy/details',
                payload: {
                    grayStrategyId: record,
                }
            }).then(() => {
                const { details, grayDetails } = this.props;
                this.setState({
                    details,
                    grayDetails,
                });
            });
        }
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false,
        });
    };
    dataChange = (val) => {
        this.setState({
            value: val.label,
        });
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        const {
            dispatch,
        } = this.props;
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        dispatch({
            type: 'grayPolicy/getPolicySelect',
            payload: {
                companyId,
                pageNum: 1,
                pageSize: 100,
                name: val.label,
            },
        });
    }
    query(payload) {
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        Object.assign(payload, { companyId, pageNum: 1, pageSize: 100 });
        this.props.dispatch({
            type: 'grayPolicy/getPolicySelect',
            payload,
        });
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const forms = this.props.form;
        const {
            children,
            loading,
        } = this.props;
        const {
            getFieldDecorator,
            getFieldValue,
        } = forms;
        const { details, grayDetails } = this.state;
        const options = this.props.getPolicyList.map(d => <Option key={d.id}>{d.name}</Option>);
        getFieldDecorator('keys', { initialValue: grayDetails || [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
                <div
                    className={styles.forms}
                    key={index}
                >
                    <Form.Item
                        {...formItemLayout}
                        label="策略名称"
                        key={k}
                    >
                        {
                            getFieldDecorator(`strategyName[${index}]`, {
                                rules: [
                                    { required: true, message: '请输入策略名称' },
                                ],
                            })(
                                <Select
                                    labelInValue
                                    showSearch
                                    value={this.state.value ? this.state.value : k.strategyName}
                                    style={{ width: 144 }}
                                    filterOption={false}
                                    onChange={value => this.dataChange(value)}
                                    onSearch={value => this.onSearch(value)}
                                >
                                    {options}
                                </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        {...formItemLayout}
                        label="策略占比"
                        key={k}
                    >
                        {
                            getFieldDecorator(`ratio[${index}]`, {
                                initialValue: k.ratio,
                                rules: [
                                    { required: true, message: '请输入策略占比' },
                                ],
                            })(
                                <Input />
                            )
                        }
                    </Form.Item>
                    {keys.length > 1 ? (
                        <Icon
                            className={styles.delBtn}
                            type="minus-circle-o"
                            disabled={keys.length === 1}
                            onClick={() => this.remove(k)}
                        />
                    ) : null}
                </div>
            );
        });
        return (
            <span>
                <span role="button" tabIndex="0" onClick={this.handleShow}>
                    {children}
                </span>
                <Modal
                    title="新增"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onOk={this.handleSubmit}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>取消</Button>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={this.handleSubmit}
                            loading={loading}
                        >
                            确定
                        </Button>,
                    ]}
                >
                    <Form layout="horizontal">
                        <Form.Item
                            {...formItemLayout}
                            label="灰度策略名称"
                        >
                            {
                                getFieldDecorator('grayStrategyName', {
                                    initialValue: details.grayStrategyName,
                                    rules: [
                                        { required: true, message: '请输入灰度策略名称' },
                                    ],
                                })(<Input placeholder="请输入灰度策略名称" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="备注"
                        >
                            {
                                getFieldDecorator('remark', {
                                    initialValue: details.remark,
                                })(<TextArea placeholder="请输入灰度策略名称" />)
                            }
                        </Form.Item>
                        <Form.Item>
                            <span
                                onClick={this.add}
                                role="button"
                                tabIndex="-1"
                            >
                            添加策略<Icon type="plus-circle-o" style={{ marginLeft: '10px' }} />
                            </span>
                        </Form.Item>
                        {formItems}
                    </Form>
                </Modal>
            </span>
        );
    }
}

