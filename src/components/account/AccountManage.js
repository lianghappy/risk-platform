import React from 'react';
import { connect } from 'dva';
import {
    Table,
    Switch,
    Pagination,
} from 'antd';
import Filter from 'components/Filter';
import { PAGE_SIZE } from 'utils/constants';
import { getHeight } from 'utils/common';
import styles from './accountManage.scss';

const columns = [
    {
        title: '用户账号',
        dataIndex: 'userName',
        key: 'cuserName1',
        width: 100,
    },
    {
        title: '用户姓名',
        dataIndex: 'type',
        key: 'type',
        width: 100,
    },
    {
        title: '用户手机号',
        dataIndex: 'roleName',
        key: 'roleName',
        width: 100,
        render: (text) => <Filter type="null" value={text} />,
    },
    {
        title: '公司名称',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        render: (text) => <Switch checked={text === 'true'} />,
    },
    {
        title: '角色类型',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        render: (text) => <Switch checked={text === 'true'} />,
    },
    {
        title: '角色名称',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        render: (text) => <Switch checked={text === 'true'} />,
    },
    {
        title: '操作',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        render: () => (
            <span>
                <a >修改</a>
                <a className={styles.pwd}>重置密码</a>
                <a className="ant-dropdown-link">删除</a>
            </span>
        ),
    },
];

const total = PAGE_SIZE * 3;

function itemRender(current, type, originalElement) {
    if (type === 'prev') {
        return <a>上一页</a>;
    } else if (type === 'next') {
        return <a>下一页</a>;
    }
    return originalElement;
}

class TableAccount extends React.PureComponent {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
    };
    onPageChange = (page) => {
        this.props.dispatch({
            type: 'user/getUserList',
            payload: {
                pageNum: page,
                pageSize: PAGE_SIZE,
            },
        });
    };
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }
    render() {
        const { list: dataSource, pageNum, loading } = this.props;
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        return (
            <section className={styles.container}>
                <Table
                    scroll={{ y: getHeight(document.getElementById('ui-content')) - 120 }}
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                    rowSelection={rowSelection}
                />
                <Pagination
                    total={total}
                    itemRender={itemRender}
                    current={pageNum}
                    pageSize={PAGE_SIZE}
                    onChange={this.onPageChange}
                    className={styles.pagination}
                />
            </section>
        );
    }
}

const mapStateToProps = (state) => ({
    list: state.user.list,
    pageNum: state.user.pageNum,
    loading: state.loading.models.user,
});

export default connect(mapStateToProps)(TableAccount);
