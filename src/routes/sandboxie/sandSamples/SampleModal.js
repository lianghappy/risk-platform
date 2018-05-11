import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Modal,
    Button,
} from 'antd';
import { connect } from 'dva';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class SamplesModal extends React.PureComponent {
    static propTypes = {
        form: PropTypes.object.isRequired,
        // record: PropTypes.object.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.element,
        ]).isRequired,
    };
    state = {
        visible: this.props.visible || false,
    };
    handleShow = () => {
        // this.props.form.validateFields();
        this.setState({
            visible: true,
        });
    };

    handleCancel = () => {
        this.props.form.resetFields();
        this.setState({
            visible: false,
        });
    };
    render() {
        const {
            form,
            children,
            // record,
        } = this.props;
        const {
            getFieldsError,
        } = form;
        return (
            <span>
                <span role="button" tabIndex="0" onClick={this.handleShow}>
                    {children}
                </span>
                <Modal
                    title={this.state.title}
                    visible={this.state.visible}
                    onOk={this.handleCancel}
                    footer={[
                        <Button
                            key="submit"
                            type="primary"
                            disabled={hasErrors(getFieldsError())}
                            onClick={this.handleCancel}
                        >
                            确定
                        </Button>,
                    ]}
                >
                    <span></span>
                </Modal>
            </span>
        );
    }
}
export default connect()(Form.create()(SamplesModal));
