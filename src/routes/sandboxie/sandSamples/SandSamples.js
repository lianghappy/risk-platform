import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Select, Button, Table, Popconfirm, message } from 'antd';
import { DURATION } from 'utils/constants';
import style from '../index.scss';
import Pagination from '../../../components/Pagination/Pagination';
import SamplesModal from './SampleModal';

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
    onDelete(ids) {
        const {
            pageSize,
            pageNum,
            form,
            dispatch,
        } = this.props;
        new Promise((resolve) => {
            dispatch({
                type: 'sandSamples/del',
                payload: {
                    data: { id: ids },
                    resolve,
                },
            });
        }).then(() => {
            message.success('删除成功', DURATION);
            form.validateFields((errors, values) => {
                Object.assign(values, { sysId: this.props.sysId });
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                });
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
            type: 'sandSamples/getSandSamplesList',
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
            { title: '样本ID', dataIndex: 'id', key: 'id' },
            { title: '样本名称', dataIndex: 'name', key: 'name' },
            { title: '样本总数量', dataIndex: 'num', key: 'num' },
            { title: '样本生成时间', dataIndex: 'generateTime', key: 'generateTime' },
            { title: '样本生成进度', dataIndex: 'sampleProgress', key: 'sampleProgress' },
            { title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                render: (...rest) => (
                    <div>
                        <SamplesModal>
                            <span className="jm-operate">样本筛选条件</span>
                        </SamplesModal>
                        <span className="jm-del">样本明细</span>
                        <Popconfirm
                            placement="topRight"
                            title="是否确定删除？"
                            onConfirm={() => this.onDelete(rest[1].id)}
                        >
                            <span className="jm-del">删除</span>
                        </Popconfirm>
                    </div>
                ) },
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
                            getFieldDecorator('analysisSampleId')(<Input placeholder="请输入样本ID" />)
                        }
                    </FormItem>
                    <FormItem label="样本名称" >
                        {getFieldDecorator('name')(<Select style={{ width: 150 }} placeholder="请选择样本名称">{options}</Select>)}
                    </FormItem>
                    <FormItem label="样本生成时间" >
                        {
                            getFieldDecorator('code')(<Input placeholder="请输入样本生成时间" />)
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                    </FormItem>
                </Form>
                <div>
                    <Button type="primary" style={{ marginLeft: '12px' }}>创建样本</Button>
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
//
const mapStateToProps = (state) => ({
    list: state.sandSamples.list,
    sysId: state.sandSamples.sysId,
    loading: state.loading.models.sandSamples,
    pageNum: state.sandSamples.pageNum,
    pageSize: state.sandSamples.pageSize,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(SandSamples)));
