import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
    Input,
    Select,
    Icon,
    message,
} from 'antd';
import { connect } from 'dva';
import { DURATION } from 'utils/constants';
import styles from './index.scss';

let uuid = 1;
// const FormItem = Form.Item;

// function hasErrors(fieldsError) {
//     return Object.keys(fieldsError).some(field => fieldsError[field]);
// }
const Option = Select.Option;
const { TextArea } = Input;
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
        details: {},
        grayDetails: [0],
        total: 0,
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
                isEnable: 1,
            },
        });
    }

    onChange = (e) => {
        let { value } = e.target;
        if (!/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value)) {
            return;
        }
        const { form } = this.props;
        const keys = form.getFieldValue('ratio');
        if (!value) {
            value = 0;
        }
        if (keys.length === 1) {
            this.setState({
                total: value,
            });
        } else {
            let total = 0;
            keys.forEach((item, index) => {
                if (keys.length > (index + 1) && item) {
                    total += (Number(item) * 1000) / 10;
                }
            });
            total += (Number(value) * 1000) / 10;
            this.setState({
                total: total / 100,
            });
        }
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
        const key = form.getFieldValue('ratio');
        let total = 0;
        if (key.length > 0) {
            key.forEach((item, index) => {
                if (keys.length > (index + 1) && item) {
                    total += (Number(item) * 1000) / 10;
                }
            });
            this.setState({
                total: total / 100,
            });
        }
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

    checkNum = (rule, value, callback) => {
        if (value && (!/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(value))) {
            callback(rule.message);
        } else {
            callback();
        }
    }

    checkName = (rule, value, callback) => {
        if (value && value.key === undefined) {
            callback(rule.message);
        } else {
            callback();
        }
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
                if (values && values.keys.length < 2) {
                    message.error('最少添加两个策略', DURATION);
                    return;
                }
                if (values && values.strategyName.length < 2 && values.strategyName.includes(undefined)) {
                    message.error('请输入策略名称', DURATION);
                    return;
                }
                if (values && values.ratio) {
                    const { total } = this.state;
                    if (total !== 100) {
                        message.error('策略占比之和等于100', DURATION);
                        return;
                    }
                }
                new Promise(resolve => {
                    if (type === 'edit') {
                        Object.assign(values, { grayStrategyId: record });
                    }
                    const details = [];
                    values.keys.forEach((item, index) => {
                        details.push({
                            strategyId: values.strategyName[index].key,
                            strategyName: values.strategyName[index].label,
                            ratio: (values.ratio[index] * 1000) / 10,
                        });
                    });
                    delete values.keys;
                    delete values.ratio;
                    delete values.strategyName;
                    const operator = JSON.parse(sessionStorage.userInfo).user.realName;
                    Object.assign(values, { details, operator });
                    onOk(values, resolve);
                }).then(() => {
                    this.handleCancel();
                });
            }
        });
    };

    handleShow = () => {
        // this.props.form.validateFields();
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        this.props.dispatch({
            type: 'grayPolicy/getPolicySelect',
            payload: {
                companyId,
                pageNum: 1,
                pageSize: 100,
                isEnable: 1,
            },
        });
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
                let total = 0;
                grayDetails.forEach(item => {
                    total += Number(item.ratio);
                });
                this.setState({
                    total: total / 100,
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

    query(payload) {
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        Object.assign(payload, { companyId, pageNum: 1, pageSize: 100, isEnable: 1, });
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
            getPolicyList,
        } = this.props;
        const {
            getFieldDecorator,
            getFieldValue,
        } = forms;
        const { details, grayDetails } = this.state;

        const options = getPolicyList.map(d => <Option value={d.id} key={d.id}>{d.name}</Option>);
        getFieldDecorator('keys', { initialValue: grayDetails || [0] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
                <div
                    className={styles.forms}
                    key={index}
                >
                    <Form.Item
                        label="策略名称"
                    >
                        {
                            getFieldDecorator(`strategyName[${index}]`, {
                                initialValue: {
                                    key: k.strategyId
                                },
                                rules: [
                                    { required: true, message: '请选择策略名称' },
                                    { validator: this.checkName, message: '请输入策略名称' }
                                ],
                            })(
                                <Select
                                    labelInValue
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder="请选择策略"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {options}
                                </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="策略占比%"
                    >
                        {
                            getFieldDecorator(`ratio[${index}]`, {
                                initialValue: k.ratio ? k.ratio / 100 : '',
                                rules: [
                                    { required: true, message: '请输入策略占比' },
                                    { validator: this.checkNum, message: '请输入有效数值，支持两位小数' },
                                ],
                            })(
                                <Input
                                    onChange={this.onChange}
                                    onBlur={this.onBlur}
                                />
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
                    title={this.props.type === 'edit' ? '编辑' : '新增'}
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
                    width="650px"
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
                                        { max: 20, message: '最多20位' }
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
                                    rules: [
                                        { max: 100, message: '最多100位' }
                                    ]
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
                            <span className="toastText" style={{ marginLeft: '10px' }}>说明：策略占比总和应为100%，当前配置总计：{this.state.total}%</span>
                        </Form.Item>
                        {formItems}
                    </Form>
                </Modal>
            </span>
        );
    }
}

