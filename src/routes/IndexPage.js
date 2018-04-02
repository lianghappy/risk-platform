import React, {
    Component,
} from 'react';
import {
    connect,
} from 'dva';
import {
    Button,
    DatePicker,
    Modal,
    TimePicker,
} from 'antd';
import moment from 'moment';
import CSSModules from 'react-css-modules';
import {
    ENV,
} from 'utils/constants';
import * as request from 'utils/request';
import API from 'utils/api';
import Main from 'components/layout/Main';
import styles from './IndexPage.css';

console.log(ENV);
request.signature();

class IndexPage extends Component {
    static propTypes = {};

    state = {
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
    };

    componentDidMount() {
        request.get(API.address, null, {
            standard: false,
        })
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(error.message);
            });

        request.post(API.login, {
            passWord: 'E10ADC3949BA59ABBE56E057F20F883E',
            userName: 'admin',
        })
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    handleClick = () => {
        console.log(this.state.ModalText);
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = () => {
        this.setState({
            ModalText: 'The modal will be closed after two seconds',
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                visible: false,
                confirmLoading: false,
            });
        }, 2000);
    };
    handleCancel = () => {
        console.log('Clicked cancel button');
        this.setState({
            visible: false,
        });
    };

    render() {
        const {
            visible,
            confirmLoading,
            ModalText,
        } = this.state;
        return (
            <Main>
                <section>
                    <div styleName="normal test" style={{ fontStyle: 'oblique' }}>
                        <h1 styleName="title">Yay! Welcome to dva!</h1>
                        <a
                            target="_blank"
                            href="http://zcainfo.miitbeian.gov.cn/state/outPortal/loginPortal.action"
                            rel="noopener noreferrer"
                        >
        许可证
                        </a>
                        <i className="jimi-icon" styleName="iconRegister" />
                        <div styleName="welcome" />
                        <ul styleName="list">
                            <li>To get started, edit <code>src/index.js</code> and save to reload.</li>
                            <li><a href="https://github.com/dvajs/dva-docs/blob/master/v1/en-us/getting-started.md">Getting Started</a></li>
                        </ul>
                        <Button type="primary" onClick={this.handleClick}>Primary</Button>
                        <p>{this.state.ModalText}</p>
                        <DatePicker placeholder="请选择时间" />
                        <TimePicker defaultOpenValue={moment('00:00:00', 'HH:mm:ss')} format="HH:mm" minuteStep={5} />
                    </div>

                    <div>
                        <Button type="primary" onClick={this.showModal}>Open</Button>
                        <Modal
                            title="Title"
                            visible={visible}
                            onOk={this.handleOk}
                            confirmLoading={confirmLoading}
                            onCancel={this.handleCancel}
                        >
                            <p>{ModalText}</p>
                        </Modal>
                    </div>
                </section>
            </Main>
        );
    }
}

// function mapStateToProps() {

// }

export default connect()(CSSModules(IndexPage, styles, {
    allowMultiple: true,
}));
