import React from 'react';
import { Layout, Form, Input, Button, Table, Popconfirm, message } from 'antd';
import CSSModules from 'react-css-modules';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { DURATION } from 'utils/constants';
import { roles } from 'utils/common';
import style from './company.scss';
import Pagination from '../../../components/Pagination/Pagination';
import AddCompany from './addCompany';

const FormItem = Form.Item;
class CompanyIndex extends React.PureComponent {
    static propTypes ={
        dispatch: PropTypes.func.isRequired,
        list: PropTypes.array.isRequired,
        sysId: PropTypes.string.isRequired,
        pageNum: PropTypes.number.isRequired,
        pageSize: PropTypes.number.isRequired,
        loading: PropTypes.bool.isRequired,
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
                type: 'company/del',
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
    modalOk = (data, callback) => {
        const {
            dispatch,
            pageSize,
            pageNum,
            form,
        } = this.props;
        const content = data.id !== undefined ? '更新成功' : '新增成功';
        const url = data.id !== undefined ? 'company/update' : 'company/add';

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
            type: 'company/getCompanyList',
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
        dataSource.address = this.props.dataSource ? this.props.dataSource.forEach((item) => {
            return (item.provice + item.city + item.regoin);
        }) : null;
        const { getFieldDecorator } = this.props.form;
        const columns = [
            { title: '公司名称', dataIndex: 'name', key: 'name' },
            { title: '联系人姓名', dataIndex: 'contactName', key: 'contactName' },
            { title: '联系人手机', dataIndex: 'contactPhone', key: 'contactPhone' },
            { title: '联系人邮箱', dataIndex: 'contactEmail', key: 'contactEmail' },
            { title: '公司所在地',
                dataIndex: 'address',
                key: 'address',
                render: (...rest) => (
                    <span>{rest[1].provice + rest[1].city}{ rest[1].regoin !== undefined ? rest[1].regoin : '' }</span>
                ) },
            { title: '公司所属行业', dataIndex: 'industry', key: 'industry' },
            { title: '操作',
                dataIndex: 'operator',
                render: (...rest) => (
                    <div>
                        {
                            roles('B_application_company_edit') &&
                        <AddCompany
                            type="edit"
                            record={rest[1]}
                            onOk={this.modalOk}
                            modalData={{ imgUrl: rest[1].img }}
                        >
                            <Button icon="edit" style={{ marginRight: 5 }} />
                        </AddCompany>
                        }
                        {
                            roles('B_application_company_del') &&
                        <Popconfirm
                            placement="topRight"
                            title="是否确定删除？"
                            onConfirm={() => this.onDelete(rest[1].id)}
                        >
                            <Button icon="delete" />
                        </Popconfirm>
                        }
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
                    <FormItem label="公司名称:">
                        {
                            getFieldDecorator('name')(<Input placeholder="请输入公司名称" />)
                        }
                    </FormItem>
                    {
                        roles('B_application_company_view') &&
                    <FormItem>
                        <Button type="primary" htmlType="submit">
                  查询
                        </Button>
                    </FormItem>
                    }
                    {
                        roles('B_application_company_reset') &&
                    <FormItem>
                        <Button type="default" onClick={this.onReset} disabled={this.props.loading}>
                  重置
                        </Button>
                    </FormItem>
                    }
                </Form>
                {
                    roles('B_application_company_add') &&
                <AddCompany
                    type="add"
                    record={{}}
                    onOk={this.modalOk}
                    modalData={{}}
                >
                    <Button
                        type="primary"
                        className={style.btns}
                        onClick={this.showModal}
                    >新增
                    </Button>
                </AddCompany>
                }
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
                    pageSizeOptions={['10']}
                    showQuickJumper
                    showSizeChanger={false}
                />
            </Layout>);
    }
}
const mapStateToProps = (state) => ({
    list: state.company.list,
    sysId: state.company.sysId,
    loading: state.loading.models.company,
    pageNum: state.company.pageNum,
    pageSize: state.company.pageSize,
});
export default connect(mapStateToProps)(Form.create()(CSSModules(CompanyIndex)));
