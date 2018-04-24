/**
 *
 * @author          WeiMing Huang <huangweiming@jimistore.com>
 * @date            2018-01-29 15:42:38
 * @description     上传图片
 *
 */
import React from 'react';
import { Button } from 'antd';
import PicModal from './PicModal';
import upload from '../utils/upload';
import error from '../assets/images/error.png';

export default class PicInput extends React.Component {
    constructor(props) {
        super(props);

        const value = this.props.value || {};
        this.state = {
            imgUrl: value.imgUrl || '',
        };
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState(value);
        }
    }

    triggerChange(changedValue) {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }

    handleImgChange(imgUrl) {
        if (!('value' in this.props)) {
            this.setState({ imgUrl });
        }
        this.triggerChange({ imgUrl });
    }

    changeImage(key, e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        const p = {
            file,
            type: 'manual',
            key,
            success: (t, imgUrl) => this.handleImgChange(imgUrl),
        };
        upload(p);
    }

    render() {
        return (
            <div>
                <PicModal pic={this.state.imgUrl}>
                    <img alt="未上传" src={this.state.imgUrl || error} style={{ width: 80, height: 80 }} />
                </PicModal>
                <Button style={{ position: 'relative', marginLeft: 10 }} icon="upload" >上传
                    <input type="file" accept="image/*" onChange={e => this.changeImage('imgUrl', e)} style={{ position: 'absolute', top: 0, left: 0, width: '100%', right: 0, bottom: 0, opacity: 0.01 }} />
                </Button>
            </div>
        );
    }
}
