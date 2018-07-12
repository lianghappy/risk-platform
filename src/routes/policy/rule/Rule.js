import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { roles } from 'utils/common';
import { Layout, Input, Form, Select, Button, Table, Tooltip } from 'antd';
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
        typeList: PropTypes.array.isRequired,
    };
    onPageChange = (pageNum, pageSize, sysId) => {
        const { loading, form } = this.props;
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
    checkCode = (code) => {
        let name = '';
        this.props.typeList.forEach(item => {
            if (item.code === code) {
                name = item.name;
            }
        });
        return name;
    }
    query(payload) {
        this.props.dispatch({
            type: 'rulePly/getRuleList',
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
            {
                title: '规则编号',
                dataIndex: 'id',
                key: 'id',
                width: 100,
            },
            {
                title: '规则名称',
                dataIndex: 'name',
                key: 'name',
                width: 100,
            },
            {
                title: '判定指定Key',
                dataIndex: 'judgeKey',
                key: 'judgeKey',
                width: 100,
            },
            {
                title: '风险代码',
                dataIndex: 'code',
                key: 'code',
                width: 100,
            },
            {
                title: '规则来源',
                dataIndex: 'channel',
                key: 'channel',
                render: (text, record) => (<span>{this.checkCode(record.channel)}</span>),
                width: 100,
            },
            {
                title: '规则值类型',
                dataIndex: 'valueType',
                key: 'valueType',
                width: 100,
            },
            {
                title: '规则配置描述',
                key: 'indexdescribe',
                dataIndex: 'indexdescribe',
                width: 100,
                render: (text, record) => (
                    <Tooltip title={record.indexdescribe} className={style.indexdescribe}>
                        <span style={{ '-webkit-box-orient': 'vertical' }} className={style.indexdescribe}>
                            {record.indexdescribe}
                        </span>
                    </Tooltip>
                )
            }
        ];
        const options = [];
        if (this.props.typeList) {
            this.props.typeList.forEach((item) => {
                options.push(<Option key={item.code} value={item.code}>{item.name}</Option>);
            });
        }
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="规则编号" >
                        {
                            getFieldDecorator('id')(<Input placeholder="请输入规则编号" />)
                        }
                    </FormItem>
                    <FormItem label="规则来源" >
                        {getFieldDecorator('channel')(<Select style={{ width: 150 }} placeholder="请选择规则来源">{options}</Select>)}
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
                        {
                            roles('R_policy_rules_qry') &&
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        }
                        {
                            roles('R_policy_rules_rst') &&
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                        }
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
    list: state.rulePly.list,
    sysId: state.rulePly.sysId,
    loading: state.loading.models.rulePly,
    pageNum: state.rulePly.pageNum,
    pageSize: state.rulePly.pageSize,
    typeList: state.rulePly.typeList,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Rules)));
