import React from 'react';
import { connect } from 'dva';
import { Layout, Form, Button, Table, Popconfirm, message, Select } from 'antd';
import moment from 'moment';
import { setPath } from 'utils/path';
import base64 from 'utils/base64';
import { roles } from 'utils/common';
import style from './index.scss';
import Pagination from '../../../components/Pagination/Pagination';

const Option = Select.Option;
const FormItem = Form.Item;
// const Option = Select.Option;
const mapStateToProps = (state) => {
    return {
        pageNum: state.warningRule.pageNum,
        warningRule: state.warningRule.warningRule,
        loading: state.loading.models.warningRule,
        sleuthTargets: state.warningRule.sleuthTargets,
        strategys: state.warningRule.strategys,
        pageSize: state.warningRule.pageSize,
        searchFields: state.common.searchFields,
    };
};
@connect(mapStateToProps)
@Form.create()
export default class WarningRule extends React.PureComponent {
    state = {
        searchFields: this.props.searchFields.rule || {},
        type: 'rule'
    }

    componentDidMount() {
        const {
            dispatch,
        } = this.props;
        const { type, } = this.state;
        dispatch({
            type: 'common/setSearchFields',
            payload: {
                type,
                searchFields: {},
            },
        });
    }

    onPageChange = (pageNum, pageSize) => {
        this.props.form.validateFields((errors, values) => {
            this.query({
                ...values,
                pageNum,
                pageSize,
            });
        });
    };
    onDelete = (sleuthConfigId) => {
        const {
            dispatch,
            form,
            pageNum,
            pageSize,
        } = this.props;
        new Promise((resolve) => {
            dispatch({
                type: 'warningRule/del',
                payload: {
                    data: {
                        sleuthConfigId,
                    },
                    resolve,
                }
            });
        }).then(() => {
            message.success('删除成功');
            form.validateFields((errors, values) => {
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                });
            });
        });
    }
    onQuery = (e) => {
        e.preventDefault();
        const {
            pageSize,
            loading,
            form,
        } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            this.query({
                ...values,
                pageNum: 1,
                pageSize,
            });
        });
    }
    onStatus = (sleuthConfigId, state) => {
        const {
            pageNum,
            pageSize,
            form,
        } = this.props;
        const states = Number(state) === 1 ? 0 : 1;
        new Promise((resolve) => {
            this.props.dispatch({
                type: 'warningRule/updateStatus',
                payload: {
                    data: {
                        sleuthConfigId,
                        state: states,
                    },
                    resolve,
                }
            });
        }).then(() => {
            message.success('更新状态成功');
            form.validateFields((errors, values) => {
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                });
            });
        });
    }
    onReset = () => {
        const { pageSize, form, dispatch, type } = this.props;
        form.resetFields();
        this.query({
            pageNum: 1,
            pageSize,
            sysId: 'risk',
        });
        dispatch({
            type: 'common/setSearchFields',
            payload: {
                type,
                searchFields: {},
            },
        });
    };
      onEdit = (id) => {
          const {
              form,
              dispatch,
              pageNum,
          } = this.props;
          const { type } = this.state;
          form.validateFields((err, values) => {
              Object.assign(values, { pageNum });
              dispatch({
                  type: 'common/setSearchFields',
                  payload: {
                      type,
                      searchFields: values,
                  },
              });
          });
          this.props.history.push(setPath(`/editWarningRule/${base64.encode(id)}`));
      }
    changeTime = (time) => {
        const times = [
            { name: '1分钟', key: '1', type: 'minutes' },
            { name: '5分钟', key: '5', type: 'minutes' },
            { name: '30分钟', key: '30', type: 'minutes' },
            { name: '1小时', key: '1', type: 'hours' },
            { name: '2小时', key: '2', type: 'hours' },
            { name: '5小时', key: '5', type: 'hours' },
            { name: '10小时', key: '10', type: 'hours' },
            { name: '12小时', key: '12', type: 'hours' },
            { name: '24小时', key: '24', type: 'hours' },
        ];
        let TM = '0小时';
        times.forEach((item) => {
            if (moment.duration(Number(item.key), item.type).asSeconds() === Number(time)) {
                TM = item.name;
            }
        });
        return TM;
    }
    changeCount = (count) => {
        const value = [
            { name: '平均值', key: 'avg' },
            { name: '最大值', key: 'max' },
            { name: '最小值', key: 'min' },
        ];
        let counts = '';
        value.forEach(item => {
            if (item.key === count) {
                counts = item.name;
            }
        });
        return counts;
    }
    add = () => {
        this.props.history.push(setPath('/addWarningRule'));
    }
    query(payload) {
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        const appId = JSON.parse(sessionStorage.app).id;
        const productId = JSON.parse(sessionStorage.product).id;
        Object.assign(payload, {
            companyId,
            appId,
            productId,
        });
        this.props.dispatch({
            type: 'warningRule/getWarningRuleList',
            payload,
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {
            pageSize,
            pageNum,
            warningRule: dataSource,
            loading,
            strategys,
            sleuthTargets,
        } = this.props;
        const { searchFields, } = this.state;
        const columns = [
            {
                title: '报警ID',
                dataIndex: 'id',
                key: 'id',
                width: 100,
            },
            {
                title: '报警规则名称',
                dataIndex: 'sleuthConfigName',
                key: 'sleuthConfigName',
                width: 100,
            },
            {
                title: '策略名称',
                dataIndex: 'strategyName',
                key: 'strategyName',
                width: 100,
            },
            {
                title: '状态',
                dataIndex: 'state',
                render: (text, record) => (<span>{Number(record.state) === 0 && '禁用'}{Number(record.state) === 1 && '启用'}</span>),
                width: 100,
            },
            {
                title: '监控指标名称',
                dataIndex: 'sleuthTargetName',
                key: 'sleuthTargetName',
                width: 100,
            },
            {
                title: '规则描述',
                dataIndex: 'code',
                key: 'code',
                render: (text, record) => (
                    <span>
                        {this.changeTime(record.silenceTime)}&nbsp;
                        {record.sleuthTargetName}&nbsp;
                        {this.changeCount(record.judgeKey)}&nbsp;
                        {record.judgeSymbol}&nbsp;
                        {record.judgeValue}&nbsp;<br />
                    连续{record.alarmCount}次 则报警
                    </span>
                ),
                width: 100,
            },
            {
                title: '通知对象',
                dataIndex: 'sleuthTeamNames',
                key: 'sleuthTeamNames',
                width: 100,
            },
            {
                title: '添加人',
                dataIndex: 'addName',
                key: 'addName',
                width: 100,
            },
            {
                title: '添加时间',
                dataIndex: 'addTime',
                key: 'addTime',
                width: 100,
            },
            {
                title: '操作',
                key: 'operator',
                render: (text, record) => (
                    <div>
                        {
                            roles('R_police_rl_state') &&
                        <Popconfirm
                            placement="topRight"
                            title={Number(record.state) === 1 ? '确定禁用?' : '确定启用?'}
                            onConfirm={() => this.onStatus(record.id, record.state)}
                        >
                            <a role="button" tabIndex="-1">{Number(record.state) === 1 ? '禁用' : '启用'}</a>
                        </Popconfirm>
                        }
                        {
                            roles('R_police_rl_edit') &&
                        <a role="button" tabIndex="-1" onClick={() => this.onEdit(record.id)} className="jm-del">编辑</a>
                        }
                        {
                            roles('R_police_rl_del') &&
                        <Popconfirm
                            placement="topRight"
                            title="确定删除?"
                            onConfirm={() => this.onDelete(record.id)}
                        >
                            <a role="button" tabIndex="-1" className="jm-del">删除</a>
                        </Popconfirm>
                        }
                    </div>
                ),
                width: 100,
            }
        ];
        return (
            <Layout className={style.container}>
                <Form layout="inline" className={style.inputs} onSubmit={this.onQuery}>
                    <FormItem label="策略名称" >
                        {
                            getFieldDecorator('strategyId', {
                                initialValue: searchFields.strategyId,
                            })(
                                <Select style={{ width: '275px' }}>
                                    {
                                        strategys && strategys.map((item, index) => {
                                            return (<Option value={item.id} key={index}>{item.name}</Option>);
                                        })
                                    }
                                    <Option value="">全部</Option>
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem label="监控指标" >
                        {getFieldDecorator('sleuthTargetId', {
                            initialValue: searchFields.sleuthTargetId,
                        })(
                            <Select style={{ width: '154px' }}>
                                {
                                    sleuthTargets && sleuthTargets.map((item, index) => {
                                        return (<Option value={item.id} key={index}>{item.sleuthTargetName}</Option>);
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <Form.Item label="状态">
                        {
                            getFieldDecorator('state', {
                                initialValue: searchFields.state,
                            })(
                                <Select style={{ width: '157px' }}>
                                    <Select.Option value="0">禁用</Select.Option>
                                    <Select.Option value="1">启用</Select.Option>
                                    <Select.Option value="">所有</Select.Option>
                                </Select>
                            )
                        }
                    </Form.Item>
                    <FormItem>
                        {
                            roles('R_police_rl_qry') &&
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        }
                        {
                            roles('R_police_rl_rst') &&
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                        }
                    </FormItem>
                </Form>
                <div>
                    {
                        roles('R_police_rl_add') &&
                        <Button type="primary" onClick={() => this.add()} style={{ marginLeft: '20px', marginBottom: '20px' }}>新增</Button>
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
