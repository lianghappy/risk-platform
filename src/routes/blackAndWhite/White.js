import React from 'react';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Layout, Input, Form, Select, Button, Table, Popconfirm, message } from 'antd';
import { DURATION } from 'utils/constants';
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
    };
    onPageChange = (pageNum, pageSize, sysId) => {
        this.query({
            pageNum,
            pageSize,
            sysId,
            type: 1,
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
                type: 1,
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
                type: 'white/del',
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
                    type: 1,
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
            type: 1,
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
        const url = data.id !== undefined ? 'white/updata' : 'white/add';
        // switch (data.type) {
        // case 'add':
        //     url = 'black/add';
        //     break;
        // case 'edit':
        //     url = 'black/updata';
        //     break;
        // default:
        //     break;
        // }
        const userInfo = sessionStorage.getItem('userInfo');
        if (JSON.parse(userInfo).user.userName) {
            data.operators = JSON.parse(userInfo).user.userName;
        }
        data.type = 1;
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
                    type: 1,
                });
            });
        });
    };
    query(payload) {
        this.props.dispatch({
            type: 'white/getBlackList',
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
            { title: '用户手机号', dataIndex: 'phone', key: 'phone' },
            { title: '用户姓名', dataIndex: 'idCardName', key: 'idCardName' },
            { title: '用户身份证号', dataIndex: 'idCard', key: 'idCard' },
            { title: '用户描述', dataIndex: 'description', key: 'description' },
            { title: '操作人员', dataIndex: 'operators', key: 'operators' },
            { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
            { title: '名单来源', dataIndex: 'channelName', key: 'channelName' },
            { title: '名单分类', dataIndex: 'categoryName', key: 'categoryName' },
            { title: '操作',
                dataIndex: 'valueType',
                key: 'valueType',
                render: (...rest) => (
                    <div className={style.edits}>
                        <AddModal
                            type="edit"
                            record={rest[1]}
                            onOk={this.modalOk}
                            rosterChannel={this.props.rosterChannel}
                            rosterType={this.props.rosterType}
                        >
                            <span className="jm-operate">编辑</span>
                        </AddModal>
                        <Popconfirm
                            placement="topRight"
                            title="是否确认删除"
                            onConfirm={() => this.delete(rest[1].id)}
                        >
                            <span className="jm-del">删除</span>
                        </Popconfirm>
                    </div>) },
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
                            getFieldDecorator('id')(<Input placeholder="请输入用户手机号" />)
                        }
                    </FormItem>
                    <FormItem label="身份证号" >
                        {
                            getFieldDecorator('code')(<Input placeholder="请输入身份证号" />)
                        }
                    </FormItem>
                    {/* <FormItem label="身份证号" >
                        {getFieldDecorator('channel')(<Select style={{ width: 150 }} placeholder="请选择规则来源">{options}</Select>)}
                    </FormItem> */}
                    <FormItem label="用户姓名" >
                        {
                            getFieldDecorator('code')(<Input placeholder="请输入用户姓名" />)
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" disabled={this.props.loading} className={style.save}>查询</Button>
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>重置</Button>
                    </FormItem>
                </Form>
                <AddModal
                    type="add"
                    record={{}}
                    onOk={this.modalOk}
                    rosterChannel={this.props.rosterChannel}
                    rosterType={this.props.rosterType}
                >
                    <Button type="primary" className={style.add}>新增</Button>
                </AddModal>
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
    list: state.white.list,
    sysId: state.white.sysId,
    loading: state.loading.models.white,
    pageNum: state.white.pageNum,
    pageSize: state.white.pageSize,
    rosterChannel: state.black.rosterChannel,
    rosterType: state.black.rosterType,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(Black)));
