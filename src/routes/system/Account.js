import React from 'react';
import { Layout, Form, Input, Select, Button, Modal } from 'antd';
import CSSModules from 'react-css-modules';
import TableAccount from '../../components/account/AccountManage';
import style from './account.scss';

const FormItem = Form.Item;
const Option = Select.Option;
class DecisionIndex extends React.PureComponent {
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
                    <FormItem label="用户账号">
                        <Input />
                    </FormItem>
                    <FormItem label="用户姓名">
                        <Input />
                    </FormItem>
                    <FormItem label="角色名称">
                        <Select style={{ width: 100 }}>
                            <Option value="全部">全部</Option>
                            <Option value="123" >123</Option>
                        </Select>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit">
                  查询
                        </Button>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit">
                  重置
                        </Button>
                    </FormItem>
                </Form>
                <Button
                    type="primary"
                    className={style.btns}
                    onClick={this.showModal}
                >新增账号
                </Button>
                <TableAccount />
                <Modal
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    okText="保存"
                    destroyOnClose
                >
                    <Form
                        layout="horizontal"
                    >
                        <FormItem label="用户账号：">
                            <Input placeholder="请输入用户账号" />
                        </FormItem>
                        <FormItem label="用户姓名：">
                            <Input placeholder="请输入用户姓名" />
                        </FormItem>
                        <FormItem label="用户手机号：">
                            <Input placeholder="请输入用户手机号" />
                        </FormItem>
                        <FormItem label="密码：">
                            <Input placeholder="请输入密码" />
                        </FormItem>
                        <FormItem label="确认密码：">
                            <Input placeholder="请再次输入密码" />
                        </FormItem>
                        <FormItem label="角色名称：">
                            <Input placeholder="请输入角色名称" />
                        </FormItem>
                    </Form>
                </Modal>
            </Layout>);
    }
}

export default CSSModules(DecisionIndex);
