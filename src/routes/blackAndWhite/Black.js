import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Select, Button, Table, Popconfirm, message, Tooltip } from 'antd';
import { DURATION } from 'utils/constants';
import { roles } from 'utils/common';
import style from './index.scss';
import Pagination from '../../components/Pagination/Pagination';
import AddModal from './AddModal';

const FormItem = Form.Item;
const Option = Select.Option;

class Black extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        rosterChannel: PropTypes.array.isRequired,
    };
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
                type: 0,
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
                type: 0,
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
                type: 'black/del',
                payload: {
                    data: { id: ids },
                    resolve,
                },
            });
        }).then(() => {
            message.success('删除成功', DURATION);
            form.validateFields((errors, values) => {
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                    type: 0,
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
            type: 0,
        });
    };
    modalOk = (data, callback) => {
        const {
            dispatch,
            pageSize,
            pageNum,
            form,
        } = this.props;
        const content = data.id !== undefined ? '更新成功' : '新增成功';
        const url = data.id !== undefined ? 'black/update' : 'black/add';
        const userInfo = sessionStorage.getItem('userInfo');
        if (JSON.parse(userInfo).user.userName) {
            data.operators = JSON.parse(userInfo).user.realName;
        }
        data.type = 0;
        new Promise((resolve) => {
            dispatch({
                type: url,
                payload: {
                    data,
                    resolve,
                },
            });
        }).then(() => {
            callback();
            message.success(content, DURATION);
            form.validateFields((errors, values) => {
                this.query({
                    ...values,
                    pageNum,
                    pageSize,
                    type: 0,
                });
            });
        });
    };
    query(payload) {
        this.props.dispatch({
            type: 'black/getBlackList',
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
                title: '用户手机号',
                dataIndex: 'phone',
                key: 'phone',
                width: 100,
            },
            {
                title: '用户姓名',
                dataIndex: 'idCardName',
                key: 'idCardName',
                width: 100,
            },
            {
                title: '用户身份证号',
                dataIndex: 'idCard',
                key: 'idCard',
                width: 100,
            },
            {
                title: '用户描述',
                dataIndex: 'description',
                key: 'description',
                width: 100,
                render: (text, record) => (
                    <Tooltip title={record.description} className="description">
                        <span style={{ '-webkit-box-orient': 'vertical' }} className="description">
                            {record.description}
                        </span>
                    </Tooltip>
                ),
            },
            {
                title: '操作人员',
                dataIndex: 'operators',
                key: 'operators',
                width: 100,
            },
            {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 100,
            },
            {
                title: '名单来源',
                dataIndex: 'channelName',
                key: 'channelName',
                width: 100,
            },
            {
                title: '名单分类',
                dataIndex: 'categoryName',
                key: 'categoryName',
                width: 100,
            },
            {
                title: '操作',
                dataIndex: 'valueType',
                key: 'valueType',
                render: (...rest) => (
                    <div className={style.edits}>
                        {
                            roles('R_system_baw_B_edit') &&
                        <AddModal
                            type="edit"
                            record={rest[1]}
                            onOk={this.modalOk}
                            rosterChannel={this.props.rosterChannel}
                            rosterType={this.props.rosterType}
                            system="black"
                        >
                            <span className="jm-operate">编辑</span>
                        </AddModal>
                        }
                        {
                            roles('R_system_baw_B_del') &&
                        <Popconfirm
                            placement="topRight"
                            title="是否确认删除"
                            onConfirm={() => this.onDelete(rest[1].id)}
                        >
                            <span className="jm-del">删除</span>
                        </Popconfirm>
                        }
                    </div>),
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
                    <FormItem label="用户手机号" >
                        {
                            getFieldDecorator('phone')(<Input placeholder="请输入用户手机号" />)
                        }
                    </FormItem>
                    <FormItem label="身份证号" >
                        {
                            getFieldDecorator('idCard')(<Input placeholder="请输入身份证号" />)
                        }
                    </FormItem>
                    <FormItem label="用户姓名" >
                        {
                            getFieldDecorator('idCardName')(<Input placeholder="请输入用户姓名" />)
                        }
                    </FormItem>
                    <FormItem>
                        {
                            roles('R_system_baw_B_qry') &&
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        }
                        {
                            roles('R_system_baw_B_rst') &&
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                        }
                    </FormItem>
                </Form>
                {
                    roles('R_system_baw_B_add') &&
                <AddModal
                    type="add"
                    record={{}}
                    onOk={this.modalOk}
                    rosterChannel={this.props.rosterChannel}
                    rosterType={this.props.rosterType}
                    system="black"
                >
                    <Button type="primary" className={style.add}>新增</Button>
                </AddModal>
                }
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
    list: state.black.list,
    sysId: state.black.sysId,
    loading: state.loading.models.black,
    pageNum: state.black.pageNum,
    pageSize: state.black.pageSize,
    rosterChannel: state.black.rosterChannel,
    rosterType: state.black.rosterType,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Black)));
