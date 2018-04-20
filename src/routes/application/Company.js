import React from 'react';
import { Layout, Form, Input, Button, Modal, Select, Table } from 'antd';
import CSSModules from 'react-css-modules';
import style from './company.scss';
import { post } from '../../utils/request';
import API from '../../utils/api';
import District from '../../components/District';
import PicInput from '../../components/PicInput';

const FormItem = Form.Item;
const Option = Select.Option;
class CompanyIndex extends React.PureComponent {
    state = {
        visible: false,
        data: [],
    };
    componentWillMount() {
        const that = this;
        post(API.getCompanyList, { name: '', pageSize: '10', pageNum: '1' }, null).then((res) => {
            if (res.length > 0) {
                const datas = [];
                res.forEach((item, index) => {
                    datas.push({
                        key: index,
                        name: item.name,
                        contactName: item.contactName,
                        address: item.provice + item.city + item.regoin,
                        tel: item.contactPhone,
                        industry: item.industry,
                    });
                });
                that.setState({
                    data: datas,
                });
            }
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    showModal = () => {
        this.setState({ visible: true });
    }
    changeDistrict = (value) => {
        console.log(value);
    }
    render() {
        console.log(this.state.data);
        const formLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        const columns = [
            { title: '公司名称', dataIndex: 'name' },
            { title: '联系人姓名', dataIndex: 'contactName' },
            { title: '联系人手机', dataIndex: 'tel' },
            { title: '联系人邮箱', dataIndex: 'email' },
            { title: '公司所在地', dataIndex: 'address' },
            { title: '公司所属行业', dataIndex: 'industry' },
            { title: '操作',
                dataIndex: 'operator',
                render: () => (
                    <span>
                        <a>编辑</a>
                        <a>删除</a>
                    </span>),
            },
        ];
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
        };
        const column = [
            { id: '1', name: '公司名称', place: '请输入公司名称' },
            { id: '2', name: '联系人姓名', place: '请输入联系人姓名' },
            { id: '3', name: '联系人手机号', place: '请输入联系人手机号' },
            { id: '4', name: '公司所在地', place: '' },
            { id: '5', name: '公司所属行业', place: '请选择公司所属行业' },
            { id: '6', name: '公司logo', place: '请输入角色名称' },
        ];
        const value = [];
        const arr = ['租赁', '电商', '信息安全', '银行', '保险', '证券／期货', '基金', '信托', '其他'];
        for (let i = 0; i < arr.length; i++) {
            value.push(<Option key={i}>{arr[i]}</Option>);
        }
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs}>
                    <FormItem label="应用名称:">
                        <Input />
                    </FormItem>
                    <FormItem label="公司名称:">
                        <Input />
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit">
                  查询
                        </Button>
                    </FormItem>
                    <FormItem>
                        <Button type="dashed" htmlType="submit">
                  重置
                        </Button>
                    </FormItem>
                </Form>
                <Button
                    type="primary"
                    className={style.btns}
                    onClick={this.showModal}
                >新增
                </Button>
                <Modal
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    okText="保存"
                    destroyOnClose
                    width={800}
                >
                    <Form
                        layout="horizontal"
                        onSubmit={this.handleSubmit}
                    >
                        {
                            column.map((el) => {
                                if (el.id === '4') {
                                    return (
                                        <FormItem
                                            key={el.id}
                                            label={el.name}
                                            {...formLayout}
                                        >
                                            <District
                                                placeholder="请选择公司所在地"
                                                onChange={() => this.changeDistrict()}
                                            />
                                        </FormItem>
                                    );
                                } else if (el.id === '5') {
                                    return (
                                        <FormItem
                                            key={el.id}
                                            label={el.name}
                                            {...formLayout}
                                        >
                                            <Select
                                                defaultValue="请选择所属行业"
                                            >
                                                {value}
                                            </Select>
                                        </FormItem>
                                    );
                                } else if (el.id === '6') {
                                    return (
                                        <FormItem
                                            key={el.id}
                                            label={el.name}
                                            {...formLayout}
                                        >
                                            <span className={style.photo}>（请上传应用高清图片，支持.jpg .jpeg .png格式，建议320*320像素，小于3M）</span>
                                            <PicInput />
                                        </FormItem>
                                    );
                                }
                                return (
                                    <FormItem
                                        key={el.id}
                                        label={el.name}
                                        {...formLayout}
                                    >
                                        <Input placeholder={el.place} />
                                    </FormItem>
                                );
                            })
                        }
                    </Form>
                </Modal>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={this.state.data}
                />
            </Layout>);
    }
}

export default CSSModules(CompanyIndex);
