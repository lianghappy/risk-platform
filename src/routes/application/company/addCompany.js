import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
    Input,
    Select,
    message,
} from 'antd';
import { connect } from 'dva';
import { DURATION } from 'utils/constants';
import { get } from 'utils/request';
import API from 'utils/api';
import treeConvert from 'utils/treeConvert';
import style from './company.scss';
import District from '../../../components/District';
import PicInput from '../../../components/PicInput';

let districts = null;
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
        modalData: PropTypes.object.isRequired,
    };
    state = {
        visible: this.props.visible || false,
        modalData: this.props.modalData || {},
        citys: {
            provice: null,
            city: null,
            regoin: null,
        },
    };
    componentDidMount() {
        this.getDistrict();
    }
    onQueryCompany = (value) => {
        this.props.form.resetFields('id');
        this.props.dispatch({
            type: 'company/queryCompanyDetail',
            payload: {
                id: value,
            },
        });
    }
    onChange = (value) => {
        const citys = this.state.citys;
        const cities = this.getCodeByName(value, districts);
        citys.provice = cities.provice;
        citys.city = cities.city;
        citys.regoin = cities.regoin;
        this.setState({ citys });
    }
    // 城市数据集获取
    getDistrict = () => {
        return new Promise((resolve, reject) => {
            if (districts) {
                resolve(districts);
            } else {
                get(API.address, null, {
                    standard: false,
                }).then((result) => {
                    districts = [
                        ...result,
                        {
                            id: '710001',
                            v: '台湾',
                            p: '710000',
                        },
                    ];
                    districts = treeConvert({
                        id: 'id',
                        name: 'v',
                        pId: 'p',
                        rootId: '100000',
                        tId: 'value',
                        tName: 'label',
                    }, districts);
                    resolve(districts);
                }).catch((error) => {
                    message.error(error.message, DURATION);
                    reject();
                });
            }
        });
    }

    // 根据名称查询城市编码
    getCodeByName = (name, source = []) => {
        const city = {
            provice: null,
            city: null,
            regoin: null,
        };
        source.some(item => {
            if (item.value === name[0]) {
                city.provice = item.label;
                item.children.forEach((it) => {
                    if (it.value === name[1]) {
                        city.city = it.label;
                        if (it.children) {
                            it.children.forEach((items) => {
                                if (items.value === name[2]) {
                                    city.regoin = items.label;
                                    return true;
                                }
                                return false;
                            });
                        }
                    }
                    return false;
                });
            }
            return false;
        });
        return city;
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
        const that = this;
        form.validateFields((err, values) => {
            if (!err) {
                if (that.state.modalData) {
                    new Promise(resolve => {
                        if (type === 'edit') {
                            Object.assign(values, { id: record.id });
                        }
                        values.img = that.state.modalData;
                        values.provice = that.state.citys.provice;
                        values.city = that.state.citys.city;
                        values.regoin = that.state.citys.regoin;
                        Object.assign(values, { img: this.state.modalData.imgUrl });
                        onOk(values, resolve);
                    }).then(() => {
                        this.handleCancel();
                    });
                } else {
                    message.error('请上传公司logo');
                }
            }
        });
    };
    imgChange = (values) => {
        this.setState({
            modalData: values,
        });
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
        const values = [];
        const arr = ['租赁', '电商', '信息安全', '银行', '保险', '证券／期货', '基金', '信托', '其他'];
        for (let i = 0; i < arr.length; i++) {
            values.push(<Option key={arr[i]} value={arr[i]}>{arr[i]}</Option>);
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
                                })(<Input placeholder="请输入公司名称" />)
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
                                })(<Input placeholder="请输入联系人姓名" />)
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
                                })(<Input placeholder="请输入联系人手机号" />)
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
                                })(<Input placeholder="请输入联系人邮箱" />)
                            }
                        </Form.Item>
                        <Form.Item
                            label="公司所在地"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('address', {
                                initialValue: record.contactEmail,
                                rules: [
                                    { required: true, message: '请选择公司所在地' },
                                ] })(<District
                                placeholder="请选择公司所在地"
                                defaultValue={[record.provice, record.city, record.regoin]}
                                onChange={this.onChange}
                                defaultType="label"
                                />)}
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="公司所属行业"
                        >
                            {
                                getFieldDecorator('industry', {
                                    initialValue: record.industry,
                                    rules: [
                                        { required: true, message: '请选择公司所属行业' },
                                    ] })(<Select placeholder="请选择公司所属行业">{values}</Select>)
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
                            {
                                getFieldDecorator('img', {
                                    initialValue: record.img,
                                    rules: [
                                        { required: true, message: '请上传应用图片' },
                                    ],
                                })(<div><span className={style.photo}>（请上传应用高清图片，支持.jpg .jpeg .png格式，建议320*320像素，小于3M）</span><PicInput type="manual" value={this.state.modalData} onChange={(value) => this.imgChange(value)} /></div>) }
                        </Form.Item>
                    </Form>
                </Modal>
            </span>
        );
    }
}
export default connect()(Form.create()(AddCompany));
