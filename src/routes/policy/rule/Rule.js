import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Select, Button, Table } from 'antd';
import Index from '../index';
import style from './index.scss';
import Pagination from '../../../components/Pagination/Pagination';

const FormItem = Form.Item;
const Option = Select.Option;

class Rules extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
    };
    onPageChange = (pageNum, pageSize, sysId) => {
        this.query({
            pageNum,
            pageSize,
            sysId,
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
            type: 'rule/getRuleList',
            payload,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            pageSize,
            pageNum,
            list: dataSource,
            loading,
        } = this.props;
        const columns = [
            { title: '规则编号', dataIndex: 'id', key: 'id' },
            { title: '规则名称', dataIndex: 'name', key: 'name' },
            { title: '判定指定Key', dataIndex: 'judgeKey', key: 'judgeKey' },
            { title: '风险代码', dataIndex: 'code', key: 'code' },
            { title: '规则来源', dataIndex: 'channel', key: 'channel' },
            { title: '规则值类型', dataIndex: 'valueType', key: 'valueType' },
        ];
        return (
            <Layout className={style.container}>
                <Index />
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="规则编号" >
                        {
                            getFieldDecorator('id')(<Input placeholder="请输入规则编号" />)
                        }
                    </FormItem>
                    <FormItem label="规则来源" >
                        {getFieldDecorator('channel')(<Select style={{ width: 150 }} placeholder="请选择规则来源"><Option value="1">一级类别</Option><Option value="2">二级类别</Option><Option value="3">三级类别</Option></Select>)}
                    </FormItem>
                    <FormItem label="风险代码" >
                        {
                            getFieldDecorator('code')(<Input placeholder="请输入风险代码" />)
                        }
                    </FormItem>
                    <FormItem label="规则名称" >
                        {
                            getFieldDecorator('name')(<Input placeholder="请输入规则名称" />)
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                    </FormItem>
                </Form>
                <Table
                    columns={columns}
                    loading={loading}
                    dataSource={dataSource}
                    pagination={false}
                />
                <Pagination
                    current={pageNum}
                    pageSize={pageSize}
                    dataSize={dataSource.length}
                    onChange={this.onPageChange}
                    showQuickJumper
                />
            </Layout>
        );
    }
}

const mapStateToProps = (state) => ({
    list: state.rule.list,
    sysId: state.rule.sysId,
    loading: state.loading.models.rule,
    pageNum: state.rule.pageNum,
    pageSize: state.rule.pageSize,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Rules)));