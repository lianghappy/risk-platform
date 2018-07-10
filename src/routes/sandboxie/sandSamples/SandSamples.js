import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import moment from 'moment';
import { Layout, Input, Form, Select, Button, Table, Popconfirm, message, DatePicker } from 'antd';
import { DURATION } from 'utils/constants';
import { roles } from 'utils/common';
import { setPath } from 'utils/path';
import style from '../index.scss';
import Pagination from '../../../components/Pagination/Pagination';
import SamplesModal from './SampleModal';
import SampleDetail from './SampleDetail';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class SandSamples extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
    };
    state = {
        visible: false,
        show: false,
    }
    onPageChange = (pageNum, pageSize) => {
        const { form, loading } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            Object.assign(values, { type: 1 });
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
    onDelete(analysisSampleId) {
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
                    data: { analysisSampleId, type: 1 },
                    resolve,
                },
            });
        }).then(() => {
            message.success('删除成功', DURATION);
            form.validateFields((errors, values) => {
                Object.assign(values, { sysId: this.props.sysId });
                Object.assign(values, { type: 1 });
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
    onReset = () => {
        const { pageSize, form, pageNum } = this.props;
        form.resetFields();
        this.query({
            pageNum,
            pageSize,
            type: 1,
        });
    };
    handleShow = (analysisSampleId) => {
        new Promise((resolve) => {
            this.props.dispatch({
                type: 'sandSamples/querySelect',
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
    create = () => {
        this.props.history.push(setPath('/sandSamples/create'));
    }
    query(payload) {
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        Object.assign(payload, { companyId });
        Object.assign(payload, { type: 1 });
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
            {
                title: '样本ID',
                dataIndex: 'id',
                key: 'id',
                width: 100,
            },
            {
                title: '样本名称',
                dataIndex: 'name',
                key: 'name',
                width: 100,
            },
            {
                title: '样本总数量',
                dataIndex: 'num',
                key: 'num',
                width: 100,
            },
            {
                title: '样本生成时间',
                dataIndex: 'generateTime',
                key: 'generateTime',
                width: 100,
            },
            {
                title: '样本生成进度',
                dataIndex: 'sampleProgress',
                key: 'sampleProgress',
                width: 100,
            },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                render: (...rest) => (
                    <div style={{ width: '193px' }}>
                        {
                            roles('R_B_SB_sandsamples_select') &&
                        <SamplesModal
                            visible={this.state.visible}
                        >
                            <span role="button" tabIndex="-1" onClick={() => this.handleShow(rest[1].id)} className="jm-operate">样本筛选条件</span>
                        </SamplesModal>
                        }
                        {
                            roles('R_B_SB_sandsamples_detail') &&
                        <SampleDetail
                            visible={this.state.show}
                            analysisSampleId={rest[1].id}
                            type={rest[1].type}
                        >
                            <span className="jm-del">样本明细</span>
                        </SampleDetail>
                        }
                        {
                            roles('R_B_SB_sandsamples_del') &&
                        <Popconfirm
                            placement="topRight"
                            title="是否确定删除？"
                            onConfirm={() => this.onDelete(rest[1].id)}
                        >
                            <span className="jm-del">删除</span>
                        </Popconfirm>
                        }
                    </div>
                ),
                width: 100,
            },
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
                        {getFieldDecorator('name')(<Input placeholder="请输入样本名称" />)}
                    </FormItem>
                    <FormItem label="样本生成时间" >
                        {
                            getFieldDecorator('times')(<RangePicker
                                showTime={{
                                    hideDisabledOptions: true,
                                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                                }}
                            />)
                        }
                    </FormItem>
                    <FormItem>
                        {
                            roles('R_B_SB_sandsamples_view') &&
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        }
                        {
                            roles('R_B_SB_sandsamples_reset') &&
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                        }
                    </FormItem>
                </Form>
                <div>
                    {
                        roles('R_B_SB_sandsamples_gener') &&
                    <Button type="primary" onClick={this.create} style={{ marginLeft: '12px', marginBottom: '20px' }}>创建样本</Button>
                    }
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
