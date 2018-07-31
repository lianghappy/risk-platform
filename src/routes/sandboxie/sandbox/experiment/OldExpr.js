import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Button, Table, Select, DatePicker, message } from 'antd';
import base64 from 'utils/base64';
import moment from 'moment';
import { setPath } from 'utils/path';
import LookModal from './LookModal';
import LookRisk from './LookRisk';
import style from '../index.scss';
import Pagination from '../../../../components/Pagination/Pagination';

const FormItem = Form.Item;
const Option = Select.Option;
const { RangePicker } = DatePicker;

class OldExpr extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        categories: PropTypes.array.isRequired,
    };
    componentDidMount() {
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        const {
            pageSize,
            pageNum,
            dispatch,
        } = this.props;
        dispatch({
            type: 'experiment/queryList',
            payload: {
                pageSize,
                pageNum,
                companyId,
            },
        });
    }
    onPageChange = (pageNum, pageSize, sysId) => {
        const { loading, form } = this.props;
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
    starts = (values) => {
        const {
            dispatch,
        } = this.props;
        if (Number(values.num) === 0) {
            message.error('你选择的样本数量为0，无法开始试验');
            return;
        }
        const username = JSON.parse(sessionStorage.userInfo).user.realName;
        const strategyId = base64.decode(this.props.match.params.id);
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        new Promise((resolve) => {
            dispatch({
                type: 'experiment/startsExper',
                payload: {
                    data: {
                        strategyId,
                        username,
                        sampleId: values.id,
                        companyId,
                    },
                    resolve,
                },
            });
        }).then(() => {
            this.props.history.push(setPath(`/sandboxie/recordHistory/${this.props.match.params.id}`));
        });
    }
    query(payload) {
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        Object.assign(payload, { companyId });
        this.props.dispatch({
            type: 'experiment/queryList',
            payload,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            pageSize,
            pageNum,
            exprList: dataSource,
            loading,
            categories,
        } = this.props;
        const options = [];
        if (categories) {
            categories.forEach((item) => {
                options.push(<Option key={item.code} value={item.code}>{item.name}</Option>);
            });
        }

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
                title: '数据源',
                dataIndex: 'type',
                key: 'type',
                render: (...rest) => (<span>{Number(rest[1].type) === 1 ? '宽表' : '风控独立系统'}</span>),
                width: 100,
            },
            {
                title: '操作',
                dataIndex: 'valueType',
                key: 'valueType',
                render: (...rest) => (
                    <div>
                        {
                            Number(rest[1].type) === 1 ?
                                <LookModal
                                    analysisSampleId={rest[1].id}
                                    type={rest[1].type}
                                >
                                    <a style={{ marginRight: 5 }}>样本筛选条件</a>
                                </LookModal>
                                :
                                <LookRisk
                                    analysisSampleId={rest[1].id}
                                    type={rest[1].type}
                                >
                                    <a style={{ marginRight: 5 }}>样本筛选条件</a>
                                </LookRisk>
                        }

                        <a
                            role="button"
                            tabIndex="-1"
                            onClick={() => this.starts(rest[1])}
                        >
                        开始实验
                        </a>
                    </div>
                ),
                width: 100,
            },
        ];
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="样本ID" >
                        {
                            getFieldDecorator('analysisSampleId')(<Input placeholder="请输入样本ID" />)
                        }
                    </FormItem>
                    <FormItem label="样本来源" >
                        {
                            getFieldDecorator('type')(<Select style={{ width: 150 }} placeholder="请选择样本来源">{options}</Select>)
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
    sysId: state.experiment.sysId,
    loading: state.loading.models.experiment,
    pageNum: state.experiment.pageNum,
    pageSize: state.experiment.pageSize,
    exprList: state.experiment.exprList,
    categories: state.experiment.categories,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(OldExpr)));
