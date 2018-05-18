import React from 'react';
import {
    Modal,
    Table,
} from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import Pagination from '../../../../components/Pagination/Pagination';

const mapStateToProps = (state) => ({
    details: state.experiment.details,
    pageNum: state.experiment.pageNum,
    pageSize: state.experiment.pageSize,
});
@connect(mapStateToProps)
export default class SampleDetail extends React.PureComponent {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]).isRequired,
        pageNum: PropTypes.number.isRequired,
        details: PropTypes.array.isRequired,
    };
    state = {
        visible: this.props.visible || false,
    };
    onPageChange = (pageNum, pageSize) => {
        const {
            loading,
            values,
        } = this.props;
        if (loading) return;
        this.query({
            ...values,
            pageNum,
            pageSize,
        });
    };
    onCancel = () => {
        this.setState({
            visible: false,
        });
    }
    handleCancel = () => {
        this.setState({
            visible: true,
        });
    }
    handleShow = () => {
        const {
            dispatch,
            values,
            pageNum,
        } = this.props;
        dispatch({
            type: 'experiment/details',
            payload: {
                ...values,
                pageNum,
                pageSize: 5,
            }
        });
        this.setState({
            visible: true,
        });
    };
    query(payload) {
        this.props.dispatch({
            type: 'experiment/details',
            payload,
        });
    }
    render() {
        const {
            loading,
            children,
            details,
            pageNum,
        } = this.props;
        const columns = [{
            title: '样本ID',
            dataIndex: 'sampleId',
            key: 'sampleId',
            width: 100,
        }, {
            title: '订单ID',
            dataIndex: 'orderId',
            key: 'orderId',
            width: 100,
        }, {
            title: '用户姓名',
            dataIndex: 'idcardName',
            key: 'idcardName',
            width: 100,
        }, {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
            width: 100,
        }, {
            title: '线上策略标识',
            dataIndex: 'strategyId',
            key: 'strategyId',
            width: 100,
        }, {
            title: '线上策略名称',
            dataIndex: 'strategyName',
            key: 'strategyName',
            width: 100,
        }, {
            title: 'PLD评分',
            dataIndex: 'pldScore',
            key: 'pldScore',
            width: 100,
        }, {
            title: 'PLD结果',
            dataIndex: 'pldResult',
            key: 'pldResult',
            width: 100,
            render: (...rest) => (<div><span>{rest[1].pldResult}</span></div>),
        }];
        return (
            <span>
                <span role="button" tabIndex="0" onClick={this.handleShow}>
                    {children}
                </span>
                <Modal
                    title="样本明细"
                    visible={this.state.visible}
                    footer={null}
                    onCancel={this.onCancel}
                    width="1000px"
                    height="700px"
                >
                    <Table
                        bordered
                        columns={columns}
                        dataSource={details}
                        loading={loading}
                        onCancel={this.handleCancel}
                        pagination={false}
                    />
                    <Pagination
                        current={pageNum}
                        pageSize={5}
                        dataSize={details.length}
                        onChange={this.onPageChange}
                        showQuickJumper
                    />
                </Modal>
            </span>
        );
    }
}
