import React from 'react';
// import { connect } from 'dva';
import { Layout, Input, Form, Button, Select } from 'antd';
// import { roles } from 'utils/common';
import style from './index.scss';

const FormItem = Form.Item;
export default class Statistical extends React.PureComponent {
    onPageChange = (pageNum, pageSize, sysId) => {
        const {
            form,
            loading,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            this.query({
                ...values,
                pageNum,
                pageSize,
                sysId,
            });
        });
    };
    onQuery = (e) => {
        e.preventDefault();
        const {
            pageSize,
            loading,
            form,
            sysId,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            this.query({
                ...values,
                pageNum: 1,
                pageSize,
                sysId,
            });
        });
    }
    onReset = () => {
        const { pageSize, form } = this.props;
        form.resetFields();
        this.query({
            pageNum: 1,
            pageSize,
        });
    };
    query(payload) {
        this.props.dispatch({
            type: 'policy/getPolicyList',
            payload,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="下单时间" >
                        {
                            getFieldDecorator('name')(<Input placeholder="请输入策略名称" />)
                        }
                    </FormItem>
                    <FormItem label="数据源" >
                        {
                            getFieldDecorator('id')(<Input placeholder="请输入策略标识" />)
                        }
                    </FormItem>
                    <FormItem label="策略名称" >
                        {
                            getFieldDecorator('isEnable')(
                                <Select style={{ width: '157px' }}>
                                    <Select.Option value="1">已上架</Select.Option>
                                    <Select.Option value="0">未上架</Select.Option>
                                    <Select.Option value="2">已下架</Select.Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="阶段名称" >
                        {
                            getFieldDecorator('isEnable')(
                                <Select style={{ width: '157px' }}>
                                    <Select.Option value="1">已上架</Select.Option>
                                    <Select.Option value="0">未上架</Select.Option>
                                    <Select.Option value="2">已下架</Select.Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="状态名称" >
                        {
                            getFieldDecorator('isEnable')(
                                <Select style={{ width: '157px' }}>
                                    <Select.Option value="1">已上架</Select.Option>
                                    <Select.Option value="0">未上架</Select.Option>
                                    <Select.Option value="2">已下架</Select.Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="数据展示" >
                        {
                            getFieldDecorator('isEnable')(
                                <Select style={{ width: '157px' }}>
                                    <Select.Option value="1">已上架</Select.Option>
                                    <Select.Option value="0">未上架</Select.Option>
                                    <Select.Option value="2">已下架</Select.Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                    </FormItem>
                </Form>
            </Layout>
        );
    }
}
