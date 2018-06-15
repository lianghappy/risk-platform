import React from 'react';
import { connect } from 'dva';
import { Layout, Input, Form, Button, Table } from 'antd';
import { setPath } from 'utils/path';
import style from './index.scss';
import Pagination from '../../../components/Pagination/Pagination';

const FormItem = Form.Item;
// const Option = Select.Option;
const mapStateToProps = (state) => {
    return {
        pageNum: state.warningRule.pageNum,
        warningRule: state.warningRule.warningRule,
        loading: state.loading.models.warningRule,
    };
};
@connect(mapStateToProps)
@Form.create()
export default class WarningRule extends React.PureComponent {
    add = () => {
        this.props.history.push(setPath('/addWarningRule'));
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            pageSize,
            pageNum,
            warningRule: dataSource,
            loading,
        } = this.props;
        const columns = [
            { title: '报警ID', dataIndex: 'id', key: 'id' },
            { title: '策略名称', dataIndex: 'strategyName', key: 'strategyName' },
            { title: '报警规则名称', dataIndex: 'judgeKey', key: 'judgeKey' },
            { title: '通知对象', dataIndex: 'code', key: 'code' },
            { title: '添加人', dataIndex: 'channel', key: 'channel' },
            { title: '添加时间', dataIndex: 'valueType', key: 'valueType' },
            { title: '操作',
                key: 'operator',
                render: () => (<span></span>) }
        ];
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="策略名称" >
                        {
                            getFieldDecorator('id')(<Input placeholder="请输入规则编号" />)
                        }
                    </FormItem>
                    <FormItem label="监控指标" >
                        {getFieldDecorator('channel')(<Input />)}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                    </FormItem>
                </Form>
                <div>
                    <Button type="primary" onClick={() => this.add()}>新增</Button>
                </div>
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
