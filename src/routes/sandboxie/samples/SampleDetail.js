import React from 'react';
import {
    Modal,
    Table,
} from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import Pagination from '../../../components/Pagination/Pagination';

const mapStateToProps = (state) => ({
    details: state.samples.details,
    pageNum: state.samples.pageNum,
    pageSize: state.samples.pageSize,
});
@connect(mapStateToProps)
export default class SampleDetail extends React.PureComponent {
    static propTypes = {
        // form: PropTypes.object.isRequired,
        // record: PropTypes.object.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]).isRequired,
        pageNum: PropTypes.number.isRequired,
        details: PropTypes.array.isRequired,
        visible: PropTypes.bool.isRequired,
    };
    state = {
        visible: this.props.visible || false,
    };
    onPageChange = (pageNum) => {
        this.query({
            pageNum,
            pageSize: 5,
            analysisSampleId: '402894d1636d6ba501636d9238150000',
            type: 0,
        });
    }
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
        new Promise((resolve) => {
            this.props.dispatch({
                type: 'samples/queryDetail',
                payload: {
                    data: { analysisSampleId: '402894d1636d6ba501636d9238150000', type: 0, pageSize: 5, pageNum: 1 },
                    resolve,
                },
            });
        }).then(() => {
            this.setState({
                visible: true,
            });
        });
    };
    query = (data) => {
        new Promise((resolve) => {
            this.props.dispatch({
                type: 'samples/queryDetail',
                payload: {
                    data,
                },
                resolve,
            });
        }).then(() => {
            console.log('chenggong');
        });
    }
    render() {
        const {
            loading,
            children,
            details: dataSource,
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
                    width="900px"
                >
                    <Table
                        bordered
                        columns={columns}
                        dataSource={dataSource}
                        loading={loading}
                        onCancel={this.handleCancel}
                        pagination={false}
                    />
                    <Pagination
                        current={pageNum}
                        pageSize={5}
                        dataSize={dataSource.length}
                        onChange={this.onPageChange}
                        showQuickJumper
                    />
                </Modal>
            </span>
        );
    }
}
