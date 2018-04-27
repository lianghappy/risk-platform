import React from 'react';
import { Layout, Form, Input, Button, Table, Popconfirm, message } from 'antd';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { DURATION } from 'utils/constants';
import createHistory from 'history/createBrowserHistory';
import style from './company.scss';
import Pagination from '../../../components/Pagination/Pagination';
import AddApp from './AddApp';

const FormItem = Form.Item;
class AppIndex extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        appItem: PropTypes.array.isRequired,
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
    onDelete(id) {
        const {
            pageSize,
            pageNum,
            form,
            dispatch,
        } = this.props;
        new Promise((resolve) => {
            dispatch({
                type: 'app/del',
                payload: {
                    data: { id },
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
    look = (id) => {
        createHistory().push(`/${id}`);
    }
    modalOk = (data, callback) => {
        const {
            dispatch,
            pageSize,
            pageNum,
            form,
        } = this.props;
        const content = '新增成功';
        const url = 'app/add';

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
                });
            });
        });
    };
    query(payload) {
        this.props.dispatch({
            type: 'app/getAppList',
            payload,
        });
    }
    render() {
        const {
            pageSize,
            pageNum,
            list: dataSource,
            loading,
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            { title: '应用名称', dataIndex: 'name', key: 'name' },
            { title: 'AppID', dataIndex: 'contactName', key: 'contactName' },
            { title: 'secret', dataIndex: 'secret', key: 'secret' },
            { title: '公司名称', dataIndex: 'partnerName', key: 'partnerName' },
            { title: '操作',
                dataIndex: 'operator',
                render: (...rest) => (
                    <div>
                        <span role="button" tabIndex="-1" style={{ marginRight: 5 }} onClick={() => this.look(rest[1].id)}>查看</span>
                        <Popconfirm
                            placement="topRight"
                            title="您确定要删除该公司吗？"
                            onConfirm={() => this.onDelete(rest[1].id)}
                        >
                            <Button icon="delete" />
                        </Popconfirm>
                    </div>),
            },
        ];
        return (
            <Layout className={style.container}>
                <Form
                    layout="inline"
                    className={style.inputs}
                    onSubmit={this.onQuery}
                >
                    <FormItem label="应用名称:">
                        {
                            getFieldDecorator('appName')(<Input placeholder="请输入应用名称" />)
                        }
                    </FormItem>
                    <FormItem label="公司名称:">
                        {
                            getFieldDecorator('partnerName')(<Input placeholder="请输入公司名称" />)
                        }
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit">
                  查询
                        </Button>
                    </FormItem>
                    <FormItem>
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>
                  重置
                        </Button>
                    </FormItem>
                </Form>
                <AddApp
                    type="add"
                    record={{}}
                    onOk={this.modalOk}
                    appItem={this.props.appItem}
                    modalData={{}}
                >
                    <Button
                        type="primary"
                        className={style.btns}
                        onClick={this.showModal}
                    >新增
                    </Button>
                </AddApp>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    loading={loading}
                />
                <Pagination
                    current={pageNum}
                    pageSize={pageSize}
                    dataSize={dataSource.length}
                    onChange={this.onPageChange}
                    showQuickJumper
                />
            </Layout>);
    }
}
const mapStateToProps = (state) => ({
    list: state.app.list,
    sysId: state.app.sysId,
    loading: state.loading.models.app,
    pageNum: state.app.pageNum,
    pageSize: state.app.pageSize,
    appItem: state.app.appItem,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(AppIndex)));
