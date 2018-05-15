import React from 'react';
import {
    Modal,
    Table,
} from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import Pagination from '../../../components/Pagination/Pagination';

const mapStateToProps = (state) => ({
    details: state.sandSamples.details,
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
        pageSize: PropTypes.number.isRequired,
        details: PropTypes.array.isRequired,
    };
    state = {
        visible: this.props.visible || false,
        pageSize: this.props.pageSize,
        pageNum: this.props.pageNum,
    };
    componentWillReceiveProps(nextProps) {
        this.setState({
            pageNum: nextProps.pageNum,
            pageSize: nextProps.pageSize,
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
        // this.props.form.validateFields();
        this.setState({
            visible: true,
        });
    };
    render() {
        const {
            loading,
            children,
            details,
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
            title: '线上策略真实得分',
            dataIndex: 'pldScore',
            key: 'pldScore',
            width: 100,
        }, {
            title: '策略真实结果',
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
                        dataSource={details}
                        loading={loading}
                        onCancel={this.handleCancel}
                        pagination={false}
                    />
                    <Pagination
                        current={this.state.pageNum}
                        pageSize={this.state.pageSize}
                        dataSize={details.length}
                        onChange={this.onPageChange}
                        showQuickJumper
                    />
                </Modal>
            </span>
        );
    }
}
