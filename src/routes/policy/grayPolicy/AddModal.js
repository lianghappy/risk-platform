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
                if (values && values.keys.length < 1) {
                    message.error('最少添加两个策略', DURATION);
                    return;
                }
                if (values && values.ratio) {
                    let sum = 0;
                    Object.keys(values.ratio).forEach(item => {
                        sum += item;
                    });
                    if (sum > 100) {
                        message.error('所有的策略占比少于100', DURATION);
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
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        this.props.dispatch({
            type: 'grayPolicy/getPolicySelect',
            payload: {
                companyId,
                pageNum: 1,
                pageSize: 100,
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
                                initialValue: k.strategyId,
                                rules: [
                                    { required: true, message: '请输入策略名称' },
                                ],
                            })(
                                <Select
                                    labelInValue
                                    showSearch
                                    optionFilterProp={k.strategyId}
                                    style={{ width: 200 }}
                                    placeholder="请选择策略"
                                    /* optionFilterProp="children" */
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {options}
                                </Select>
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        label="策略占比"
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
                    width="600px"
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

