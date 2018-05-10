import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
// import { connect } from 'dva';
import { Layout, Input, Form, Select, Button, Table } from 'antd';
import style from './index.scss';
import Pagination from '../../../components/Pagination/Pagination';

const FormItem = Form.Item;
const Option = Select.Option;

class SandSamples extends React.PureComponent {
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
            { title: '实验记录ID', dataIndex: 'id', key: 'id' },
            { title: '策略标识', dataIndex: 'name', key: 'name' },
            { title: '策略名称', dataIndex: 'judgeKey', key: 'judgeKey' },
            { title: '样本ID', dataIndex: 'code', key: 'code' },
            { title: '实验开始时间', dataIndex: 'channel', key: 'channel' },
            { title: '实验结束时间', dataIndex: 'valueType', key: 'valueType' },
            { title: '实验用户姓名', dataIndex: 'valueType', key: 'valueType' },
            { title: '实验状态', dataIndex: 'valueType', key: 'valueType' },
            { title: '操作', dataIndex: 'valueType', key: 'valueType' },
        ];
        const options = [];
        if (this.props.typeList) {
            this.props.typeList.forEach((item) => {
                options.push(<Option key={item.name} value={item.name}>{item.name}</Option>);
            });
        }
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="样本ID" >
                        {
                            getFieldDecorator('id')(<Input placeholder="请输入规则编号" />)
                        }
                    </FormItem>
                    <FormItem label="样本名称" >
                        {getFieldDecorator('channel')(<Select style={{ width: 150 }} placeholder="请选择规则来源">{options}</Select>)}
                    </FormItem>
                    <FormItem label="样本生成时间" >
                        {
                            getFieldDecorator('code')(<Input placeholder="请输入风险代码" />)
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
//
// const mapStateToProps = (state) => ({
//     list: state.samples.list,
//     sysId: state.samples.sysId,
//     loading: state.loading.models.samples,
//     pageNum: state.samples.pageNum,
//     pageSize: state.samples.pageSize,
// });
// export default connect(mapStateToProps)(Form.create()(CSSModules(Samples)));
export default Form.create()(CSSModules(SandSamples));
