import React from 'react';
import { Layout, Button, Form, Table, message, Popconfirm } from 'antd';
import { connect } from 'dva';
import { DURATION } from 'utils/constants';
import noMessage from 'assets/images/noMessage.svg';
import { roles } from 'utils/common';
import cs from 'classnames';
import TeamModal from './TeamModal';
import styles from './index.scss';

const mapStateToProps = (state) => {
    return {
        warningTeam: state.warningPeople.warningTeam,
        warningList: state.warningPeople.warningList,
        loading: state.loading.models.warningPeople,
    };
};
@connect(mapStateToProps)
@Form.create()
export default class Peoples extends React.PureComponent {
    onPageChange = (pageNum, pageSize) => {
        const { loading, form } = this.props;
        if (loading) return;
        form.validateFields((errors, values) => {
            this.query({
                ...values,
                pageNum,
                pageSize,
            });
        });
    };
    onDelete = (teamId) => {
        const {
            dispatch,
            form,
            pageNum,
            pageSize,
        } = this.props;
        new Promise((resolve) => {
            dispatch({
                type: 'warningPeople/delTeam',
                payload: {
                    data: {
                        teamId,
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
    onDeletes = (personId, teamId) => {
        const {
            dispatch,
            form,
            pageNum,
            pageSize,
        } = this.props;
        new Promise((resolve) => {
            dispatch({
                type: 'warningPeople/delTeamPeople',
                payload: {
                    data: {
                        personId,
                        teamId,
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
    modalOk = (data, callback) => {
        const {
            dispatch,
            pageSize,
            pageNum,
            form,
        } = this.props;
        const content = data.id !== undefined ? '更新成功' : '新增成功';
        let url = '';
        switch (data.type) {
        case 'add':
            url = 'warningPeople/addTeam';
            break;
        case 'edit':
            url = 'warningPeople/updataTeam';
            break;
        default:
            break;
        }
        data.companyId = JSON.parse(sessionStorage.userInfo).user.company;
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
        const companyId = JSON.parse(sessionStorage.userInfo).user.company;
        Object.assign(payload, { companyId });
        this.props.dispatch({
            type: 'warningPeople/getTeam',
            payload,
        });
    }
    render() {
        const {
            warningList: dataSource,
            loading,
            warningTeam,
        } = this.props;
        const columns = [
            {
                title: '收件人姓名',
                dataIndex: 'sleuthPersonName',
                key: 'sleuthPersonName',
                width: 100,
            },
            {
                title: '收件人手机号',
                dataIndex: 'sleuthPersonPhone',
                key: 'sleuthPersonPhone',
                width: 100,
            },
            {
                title: '钉钉机器人',
                dataIndex: 'dingRebot',
                key: 'dingRebot',
                width: 100,
            },
            {
                title: '添加人',
                dataIndex: 'operators',
                key: 'operators',
                width: 100,
            },
            {
                title: '添加时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 100,
            },
            {
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                render: (text, record) => (
                    <div>
                        {
                            roles('R_police_obj_ps_del') &&
                            <Popconfirm
                                placement="topRight"
                                title="您确定删除吗？"
                                onConfirm={() => this.onDeletes(record.sleuthPersonId, record.sleuthTeamId)}
                            >
                                <a>删除</a>
                            </Popconfirm>
                        }
                    </div>
                ),
                width: 100,
            }
        ];
        return (
            <Layout>
                <div className={cs(styles.look, styles.peoples)}>
                    {
                        roles('R_police_obj_ps_add') &&
                    <TeamModal
                        type="add"
                        record={{}}
                        onOk={this.modalOk}
                        people={dataSource}
                    >
                        <Button type="primary" className={styles.adds}>新增收件组</Button>
                    </TeamModal>
                    }
                </div>
                {
                    warningTeam.map((item, index) => {
                        return (
                            <div className={styles.lists} key={index}>
                                <div className={styles.header}>
                                    <span className={styles.name}>{item.sleuthTeamName}</span>
                                    <div>
                                        {
                                            roles('R_police_obj_ps_edit') &&
                                        <TeamModal
                                            type="edit"
                                            record={item}
                                            onOk={this.modalOk}
                                            people={dataSource}
                                        >
                                            <Button type="primary" className={styles.edits}>编辑</Button>
                                        </TeamModal>
                                        }
                                        {
                                            roles('R_police_obj_ps_dels') &&
                                        <Popconfirm
                                            placement="topRight"
                                            title={`确定删除${item.sleuthTeamName}组嘛?`}
                                            onConfirm={() => this.onDelete(item.sleuthTeamId)}
                                        >
                                            <Button type="default">删除</Button>
                                        </Popconfirm>
                                        }
                                    </div>
                                </div>
                                <Table
                                    columns={columns}
                                    pagination={false}
                                    loading={loading}
                                    dataSource={item.sleuthPersonResponses}
                                />
                            </div>
                        );
                    })
                }
                {
                    warningTeam.length === 0 &&
                    <div className={styles.noMessage}>
                        <img src={noMessage} alt="暂无内容" />
                        <p>暂无内容</p>
                    </div>
                }
            </Layout>
        );
    }
}
