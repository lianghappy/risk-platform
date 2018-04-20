/**
 *
 * @author          WeiMing Huang <huangweiming@jimistore.com>
 * @date            2018-02-01 15:49:06
 * @description     查看大图
 *
 */

import React, { Component } from 'react';
import { Modal } from 'antd';


class PicModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
        };
    }

    showModal(e) {
        if (e) e.stopPropagation();
        this.setState({ visible: true });
    }

    render() {
        return (
            <span>
                <span onClick={e => this.showModal(e)}>
                    {this.props.children}
                </span>
                <Modal
                    width={500}
                    bodyStyle={{ padding: 0 }}
                    closable={false}
                    visible={this.state.visible && !!this.props.pic}
                    footer={null}
                    onCancel={() => this.setState({ visible: false })}
                >
                    <img src={this.props.pic} alt="" style={{ width: '100%' }} />
                </Modal>
            </span>
        );
    }
}

export default PicModal;
