import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Select, Button, Table, Popconfirm, DatePicker, message } from 'antd';
import { DURATION } from 'utils/constants';
import { roles } from 'utils/common';
import moment from 'moment';
import style from '../index.scss';
import Pagination from '../../../components/Pagination/Pagination';
import SamplesModal from './SampleModal';
import RiskModal from './RiskModal';
import SampleDetail from './SampleDetail';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;
moment.locale('zh-cn');

class Samples extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        category: PropTypes.array.isRequired,
    };
    state = {
        visible: false,
        show: false,
    }
    onPageChange = (pageNum, pageSize) => {
        const { form, loading } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            if (values && values.times && values.times.length > 0) {
                Object.assign(values, { generateTimes: moment(values.times[0]._d).format('X') });
                Object.assign(values, { generateTimee: moment(values.times[1]._d).format('X') });
                delete values.times;
            }
            this.query({
                ...values,
                pageNum,
                pageSize,
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
            if (values && values.times && values.times.length > 0) {
                Object.assign(values, { generateTimes: moment(values.times[0]._d).format('X') });
                Object.assign(values, { generateTimee: moment(values.times[1]._d).format('X') });
                delete values.times;
            }
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
    onDelete(ids, type) {
        const {
            pageSize,
            pageNum,
            form,
            dispatch,
        } = this.props;
        new Promise((resolve) => {
            dispatch({
                type: 'samples/del',
                payload: {
                    data: { analysisSampleId: ids, type },
                    resolve,
                },
            });
        }).then(() => {
            message.success('删除成功', DURATION);
            form.validateFields((errors, values) => {
                if (values && values.times && values.times.length > 0) {
                    Object.assign(values, { generateTimes: moment(values.times[0]._d).format('X') });
                    Object.assign(values, { generateTimee: moment(values.times[1]._d).format('X') });
                    delete values.times;
                }
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                });
            });
        });
    }
    handleShow = (analysisSampleId) => {
        new Promise((resolve) => {
            this.props.dispatch({
                type: 'samples/querySelect',
                payload: {
                    data: { analysisSampleId },
                    resolve,
                },
            });
        }).then(() => {
            this.setState({
                visible: true,
            });
        });
    }
    handlePage = () => {
        this.setState({ show: true });
    }
    query(payload) {
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        Object.assign(payload, { companyId });
        this.props.dispatch({
            type: 'samples/getSamplesList',
            payload,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            pageSize,
            pageNum,
            list: dataSource,
            category,
            loading,
        } = this.props;
        const columns = [
            { title: '样本ID', dataIndex: 'id', key: 'id', width: 100, },
            { title: '样本名称', dataIndex: 'name', key: 'name', width: 100, },
            { title: '样本总数量', dataIndex: 'num', key: 'num', width: 100, },
            { title: '样本生成时间', dataIndex: 'createTime', key: 'createTime', width: 100, },
            { title: '数据源',
                dataIndex: 'valueType',
                key: 'valueType',
                render: (...rest) => (<span>{Number(rest[1].type) === 1 ? '宽表' : '风控独立系统'}</span>),
                width: 100, },
            { title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                render: (...rest) => (
                    <div style={{ width: '192px' }}>
                        {
                            roles('R_exp_samp_slct') &&
                        Number(rest[1].type) !== 1 ?
                                <RiskModal
                                    visible={this.state.visible}
                                >
                                    <span role="button" tabIndex="-1" onClick={() => this.handleShow(rest[1].id)} className="jm-operate">样本筛选条件</span>
                                </RiskModal>
                                :
                                <SamplesModal
                                    visible={this.state.visible}
                                >
                                    <span role="button" tabIndex="-1" onClick={() => this.handleShow(rest[1].id)} className="jm-operate">样本筛选条件</span>
                                </SamplesModal>
                        }
                        {
                            roles('R_exp_samp_det') &&
                        <SampleDetail
                            pageSize={pageSize}
                            pageNum={pageNum}
                            type={rest[1].type}
                            analysisSampleId={rest[1].id}
                            visible={this.state.show}
                        >
                            <span role="button" tabIndex="-1" onClick={() => this.handlePage()} className="jm-del">样本明细</span>
                        </SampleDetail>
                        }
                        {
                            roles('R_exp_samp_del') &&
                        <Popconfirm
                            placement="topRight"
                            title="是否确定删除？"
                            onConfirm={() => this.onDelete(rest[1].id, rest[1].type)}
                        >
                            <span className="jm-del">删除</span>
                        </Popconfirm>
                        }
                    </div>
                ),
                width: 100, },
        ];
        const options = [];
        if (category) {
            category.forEach((item) => {
                options.push(<Option key={item.code} value={item.code}>{item.name}</Option>);
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
                    <FormItem label="样本生成时间" >
                        {getFieldDecorator('times')(<RangePicker
                            showTime={{
                                hideDisabledOptions: true,
                                format: 'YYYY-MM-DD HH:mm:ss',
                                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                            }}
                        />)}
                    </FormItem>
                    <FormItem label="样本来源" >
                        {
                            getFieldDecorator('type')(<Select style={{ width: 150 }} placeholder="请选择样本来源">{options}</Select>)
                        }
                    </FormItem>
                    <FormItem>
                        {
                            roles('R_exp_samp_qry') &&
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        }
                        {
                            roles('R_exp_samp_rst') &&
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
    list: state.samples.list,
    sysId: state.samples.sysId,
    loading: state.loading.models.samples,
    pageNum: state.samples.pageNum,
    pageSize: state.samples.pageSize,
    category: state.samples.category,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Samples)));
