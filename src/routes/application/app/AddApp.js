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
import PicInput from '../../../components/PicInput';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
const Option = Select.Option;
class AddApp extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        onOk: PropTypes.func.isRequired,
        record: PropTypes.object.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]).isRequired,
        type: PropTypes.string.isRequired,
        appItem: PropTypes.array.isRequired,
        modalData: PropTypes.object.isRequired,
    };
    state = {
        visible: this.props.visible || false,
        appItem: this.props.appItem || [],
        modalData: this.props.modalData || {},
    };
    handleShow = () => {
        this.setState({
            visible: true,
        });
    };
    handleSubmit = (e) => {
        e.preventDefault();
        const {
            form,
            record,
            onOk,
        } = this.props;

        form.validateFields((err, values) => {
            if (!err) {
                new Promise(resolve => {
                    if (values.partnerName && this.props.type === 'add') {
                        this.props.appItem.some((item) => {
                            if (item.name === values.partnerName) {
                                Object.assign(values, { partnerId: item.id });
                                return true;
                            }
                            return false;
                        });
                    } else {
                        Object.assign(values, { partnerId: record.partnerId });
                    }
                    if (!this.state.modalData.imgUrl) {
                        Object.assign(values, { img: record.img });
                    } else {
                        Object.assign(values, { img: this.state.modalData.imgUrl });
                    }


                    onOk(values, resolve);
                }).then(() => {
                    this.handleCancel();
                });
            }
        });
    };
    imgChange(value) {
        this.setState({
            modalData: value,
        });
    }
    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false,
            modalData: {},
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
        const options = [];
        if (this.state.appItem.length > 0) {
            this.state.appItem.forEach((item) => {
                options.push(<Option value={item.name} key={item.name}>{item.name}</Option>);
            });
        }

        return (
            <span>
                <span role="button" tabIndex="0" onClick={this.handleShow}>
                    {children}
                </span>
                <Modal
                    title="应用基本信息"
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
                                getFieldDecorator('partnerName', {
                                    rules: [
                                        { required: true, message: '请输入公司名称' },
                                    ],
                                    initialValue: record.partnerName,
                                })(<Select placeholder="请选择公司名称" onSelect={this.onSelect}>{options}</Select>)
                            }
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            label="应用名称"
                        >
                            {
                                getFieldDecorator('name', {
                                    initialValue: record.name,
                                    rules: [
                                        { required: true, message: '请输入应用名称' },
                                        { max: '30', message: '* 应用名称不超过30个字' },
                                    ],
                                })(<Input type="acount" placeholder="请输入应用名称" />)
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
                                })(
                                    <div>
                                        <span className={style.photo}>（请上传应用高清图片，支持.jpg .jpeg .png格式，建议320*320像素，小于3M）</span>
                                        <PicInput type="manual" value={!this.state.modalData.imgUrl ? { imgUrl: record.img } : this.state.modalData} onChange={(value) => this.imgChange(value)} />
                                    </div>
                                ) }
                        </Form.Item>
                    </Form>
                </Modal>
            </span>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        appItem: state.app.appItem,
        modalData: state.app.modalData,
    };
};
export default connect(mapStateToProps)(Form.create()(AddApp));
