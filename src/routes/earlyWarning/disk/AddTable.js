import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import {
    Form,
    Modal,
    Button,
    Select,
    Row,
    Col,
} from 'antd';
import cs from 'classnames';
import style from './index.scss';

const Option = Select.Option;
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const mapStateToProps = (state) => {
    return {
        strategy: state.disk.strategy,
        sleuthTarget: state.disk.sleuthTarget,
        product: state.disk.product,
        app: state.disk.app,
    };
};
@connect(mapStateToProps)
@Form.create()
export default class AddTable extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        onOk: PropTypes.func.isRequired,
    };
    state = {
        visible: false,
    }
    handleShow = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const {
            form,
            record,
            onOk,
            type,
        } = this.props;
        const that = this;
        form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => {
                    if (type === 'edit') {
                        Object.assign(values, { id: record.id });
                    }
                    values.title = that.props.title;
                    onOk(values, resolve);
                }).then(() => {
                    this.handleCancel();
                });
            }
        });
    };

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const {
            form,
            children,
            app,
            product,
            sleuthTarget,
            strategy,
        } = this.props;

        const {
            getFieldDecorator,
            getFieldsError,
        } = form;
        return (
            <span>
                <span role="button" tabIndex="0" onClick={this.handleShow}>
                    {children}
                </span>
                <Modal
                    title="添加图表"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onOk={this.handleSubmit}
                    width="800px"
                    style={{ width: '800px' }}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>取消</Button>,
                        <Button
                            key="submit"
                            type="primary"
                            disabled={hasErrors(getFieldsError())}
                            onClick={this.handleSubmit}
                        >
                            添加
                        </Button>,
                    ]}
                >
                    <div>
                        <div>
                            <p>1、选择图标类型</p>
                            <span className={cs(
                                'jm-icon',
                                'anticon',
                                style.bar
                            )}
                            >
                            </span>
                            <p className={style.barName}>折线图</p>
                        </div>
                        <div>
                            <p>2、选择监控项</p>
                            <Form>
                                <Row>
                                    <Col span="12">
                                        <Form.Item
                                            {...formItemLayout}
                                            label="应用名称"
                                        >
                                            {
                                                getFieldDecorator('appId', {
                                                    rules: [
                                                        { required: true, message: '请输入新建监控大盘名称' },
                                                        { validator: this.phoneCheck, message: '请输入新建监控大盘名称' }
                                                    ],
                                                })(
                                                    <Select>
                                                        {
                                                            app && app.map((item, index) => {
                                                                return (<Option value={item.id} key={index}>{item.name}</Option>);
                                                            })
                                                        }
                                                        <Option value="all">所有</Option>
                                                    </Select>
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                    <Col span="12">
                                        <Form.Item
                                            {...formItemLayout}
                                            label="产品名称"
                                        >
                                            {
                                                getFieldDecorator('productId', {
                                                    rules: [
                                                        { required: true, message: '请输入新建监控大盘名称' },
                                                        { validator: this.phoneCheck, message: '请输入新建监控大盘名称' }
                                                    ],
                                                })(
                                                    <Select>
                                                        {
                                                            product && product.map((item, index) => {
                                                                return (<Option value={item.id} key={index}>{item.name}</Option>);
                                                            })
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12">
                                        <Form.Item
                                            {...formItemLayout}
                                            label="监控指标"
                                        >
                                            {
                                                getFieldDecorator('sleuthTargetId', {
                                                    rules: [
                                                        { required: true, message: '请输入新建监控大盘名称' },
                                                        { validator: this.phoneCheck, message: '请输入新建监控大盘名称' }
                                                    ],
                                                })(
                                                    <Select>
                                                        {
                                                            sleuthTarget && sleuthTarget.map((item, index) => {
                                                                return (<Option value={item.id} key={index}>{item.sleuthTargetName}</Option>);
                                                            })
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                    <Col span="12">
                                        <Form.Item
                                            {...formItemLayout}
                                            label="策略名称"
                                        >
                                            {
                                                getFieldDecorator('strategyId', {
                                                    rules: [
                                                        { required: true, message: '请输入新建监控大盘名称' },
                                                        { validator: this.phoneCheck, message: '请输入新建监控大盘名称' }
                                                    ],
                                                })(
                                                    <Select>
                                                        {
                                                            strategy && strategy.map((item, index) => {
                                                                return (<Option value={item.id} key={index}>{item.name}</Option>);
                                                            })
                                                        }
                                                        <Option value="all">所有</Option>
                                                    </Select>
                                                )
                                            }
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                            {/* <a>+ 添加监控项</a> */}
                        </div>
                    </div>
                </Modal>
            </span>
        );
    }
}
