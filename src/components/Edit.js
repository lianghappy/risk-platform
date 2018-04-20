/**
 *
 * @author          WeiMing Huang <huangweiming@jimistore.com>
 * @date            2018-01-24 13:32:19
 * @description     编辑按钮的组件
 *
 *
 */

import React, { Component } from 'react';
import PropType from 'prop-types';
import { Button, Popconfirm, Input } from 'antd';


export default class Edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editable: false,
        };
        this.sourceData = this.props.data;
    }

    render() {
        const { editable } = this.state;
        const { data, dataChange, editCall } = this.props;
        return (
            <span>
                {editable ? <Input style={{ margin: '-5px 0', width: 144 }} value={data} onChange={e => dataChange(e.target.value)} /> : data}
                {editable ?
                    <span style={{ marginLeft: 10 }}>
                        <Popconfirm okText="确定" cancelText="取消" title="确定修改?" onConfirm={() => this.setState({ editable: false }, () => editCall())} >
                            <Button icon="check" style={{ marginRight: 5 }} />
                        </Popconfirm>
                        <Button icon="close" onClick={() => this.setState({ editable: false }, () => dataChange(this.sourceData))} />
                    </span> :
                    <Button style={{ marginLeft: 10 }} onClick={() => this.setState({ editable: true })} icon="edit" />}
            </span>
        );
    }
}

Edit.propTypes = {
    data: PropType.string.isRequired,
    dataChange: PropType.func.isRequired,
    editCall: PropType.func.isRequired,
};
