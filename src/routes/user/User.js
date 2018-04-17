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
import styles from './index.scss';

const columns = [
    {
        title: '账号',
        dataIndex: 'userName',
        key: 'cuserName1',
        width: 100,
    },
    {
        title: '账号类型',
        dataIndex: 'type',
        key: 'type',
        width: 100,
    },
    {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
        width: 100,
        render: (text) => <Filter type="null" value={text} />,
    },
    {
        title: '启用状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        render: (text) => <Switch checked={text === 'true'} />,
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

class User extends React.PureComponent {
    onPageChange = (page) => {
        this.props.dispatch({
            type: 'user/getUserList',
            payload: {
                pageNum: page,
                pageSize: PAGE_SIZE,
            },
        });
    };

    render() {
        const { list: dataSource, pageNum, loading } = this.props;

        return (
            <section className={styles.container}>
                <Table
                    bordered
                    scroll={{ y: getHeight(document.getElementById('ui-content')) - 120 }}
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    loading={loading}
                    pagination={false}
                />
                <Pagination
                    total={total}
                    itemRender={itemRender}
                    current={pageNum}
                    pageSize={PAGE_SIZE}
                    onChange={this.onPageChange}
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

export default connect(mapStateToProps)(User);
