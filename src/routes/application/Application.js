import React from 'react';
import { Layout, Form, Input, Button, Modal } from 'antd';
import CSSModules from 'react-css-modules';
import style from './company.scss';

const FormItem = Form.Item;
class ApplicationIndex extends React.PureComponent {
    state = {
        visible: false,
    };
    showModal = () => {
        this.setState({ visible: true });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    render() {
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
                >
                    <Form
                        layout="horizontal"
                    >
                        <FormItem label="公司名称：">
                            <Input placeholder="请输入公司名称" />
                        </FormItem>
                        <FormItem label="联系人姓名：">
                            <Input placeholder="请输入联系人姓名" />
                        </FormItem>
                        <FormItem label="联系人手机号：">
                            <Input placeholder="请输入联系人手机号码" />
                        </FormItem>
                        <FormItem label="公司所在地：">
                            <Input placeholder="请输入密码" />
                        </FormItem>
                        <FormItem label="公司所属行业：">
                            <Input placeholder="请选择应用所属行业" />
                        </FormItem>
                        <FormItem label="公司logo：">
                            <Input placeholder="请输入角色名称" />
                        </FormItem>
                    </Form>
                </Modal>
            </Layout>);
    }
}

export default CSSModules(ApplicationIndex);
