import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
    Input,
    Select,
} from 'antd';
import { connect } from 'dva';
import style from './company.scss';
import District from '../../../components/District';
import PicInput from '../../../components/PicInput';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const Option = Select.Option;
const { TextArea } = Input;
class AddCompany extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        onOk: PropTypes.func.isRequired,
        record: PropTypes.object.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]).isRequired,
        type: PropTypes.string.isRequired,
        parent: PropTypes.array.isRequired,
    };
    state = {
        visible: this.props.visible || false,
    };
    onQueryCompany = (value) => {
        this.props.form.resetFields('id');
        this.props.dispatch({
            type: 'company/queryCompanyDetail',
            payload: {
                id: value,
            },
        });
    }
    onChange = (value, selectedOptions) => {
        console.log(selectedOptions);
    }
    handleShow = () => {
        if (this.props.type === 'edit') {
            this.onQueryCompany(this.props.record.id);
        }
        this.setState({
            visible: true,
        });
    };
    handleSubmit = (e) => {
        e.preventDefault();
        const {
            form,
            record,
            type,
            onOk,
        } = this.props;

        form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => {
                    if (type === 'edit') {
                        Object.assign(values, { id: record.id });
                    }
                    onOk(values, resolve);
                }).then(() => {
                    this.handleCancel();
                });
            }
        });
    };
    imgChange(value) {
        const modalData = this.state.modalData;
        if (modalData.activityGoodsImg) {
            modalData.activityGoodsImg[0].img = value.imgUrl;
        } else {
            modalData.activityGoodsImg = [{ img: value.imgUrl }];
        }
        this.setState({ modalData });
    }
    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false,
        });
    };
    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const {
            children,
            form,
            record,
        } = this.props;
        const {
            getFieldDecorator,
            getFieldsError,
        } = form;
        const value = [];
        const arr = ['租赁', '电商', '信息安全', '银行', '保险', '证券／期货', '基金', '信托', '其他'];
        for (let i = 0; i < arr.length; i++) {
            value.push(<Option key={i}>{arr[i]}</Option>);
        }
        return (
            <span>
                <span role="button" tabIndex="0" onClick={this.handleShow}>
                    {children}
                </span>
                <Modal
                    title="公司基本信息"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    onOk={this.handleSubmit}
                    width={800}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>取消</Button>,
                        <Button
                            key="submit"
                            type="primary"
                            disabled={hasErrors(getFieldsError())}
                            onClick={this.handleSubmit}
                        >
                            确定
                        </Button>,
                    ]}
                >
                    <Form layout="horizontal">
                        <Form.Item
                            {...formItemLayout}
                            label="公司名称"
                        >
                            {
                                getFieldDecorator('name', {
                                    initialValue: record.name,
                                    rules: [
                                        { required: true, message: '请输入公司名称' },
                                    ],
                                })(<Input type="acount" placeholder="请输入公司名称" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="联系人姓名"
                        >
                            {
                                getFieldDecorator('contactName', {
                                    initialValue: record.contactName,
                                    rules: [
                                        { required: true, message: '请输入联系人姓名' },
                                    ],
                                })(<Input type="acount" placeholder="请输入联系人姓名" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="联系人手机号"
                        >
                            {
                                getFieldDecorator('contactPhone', {
                                    initialValue: record.contactPhone,
                                    rules: [
                                        { required: true, message: '请输入联系人手机号' },
                                    ],
                                })(<Input type="acount" placeholder="请输入联系人手机号" />)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="联系人邮箱"
                        >
                            {
                                getFieldDecorator('contactEmail', {
                                    initialValue: record.contactEmail,
                                    rules: [
                                        { required: true, message: '请输入联系人邮箱' },
                                    ],
                                })(<Input type="acount" placeholder="请输入联系人邮箱" />)
                            }
                        </Form.Item>
                        <Form.Item
                            label="公司所在地"
                            {...formItemLayout}
                        >
                            <District
                                placeholder="请选择公司所在地"
                                defaultValue={[record.provice, record.city, record.regoin]}
                                onChange={this.onChange}
                            />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="公司所属行业"
                        >
                            {
                                getFieldDecorator('industry', {
                                    initialValue: record.industry,
                                })(<Select placeholder="请选择公司所属行业">{value}</Select>)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="类别描述"
                        >
                            {
                                getFieldDecorator('describ', {
                                    initialValue: record.description,
                                    rules: [{ required: true, message: '请输入描述内容' },
                                        { max: 100, message: '描述内容最多100个字' }],
                                })(<TextArea height={100} placeholder="请输入描述内容" />)
                            }
                        </Form.Item>
                        <Form.Item
                            label="公司logo"
                            {...formItemLayout}
                        >
                            <span className={style.photo}>（请上传应用高清图片，支持.jpg .jpeg .png格式，建议320*320像素，小于3M）</span>
                            <PicInput type="manual" value={record && { imgUrl: record.img }} onChange={this.imgChange} />
                        </Form.Item>
                    </Form>
                </Modal>
            </span>
        );
    }
}
export default connect()(Form.create()(AddCompany));
