import React from 'react';
import { Input } from 'antd';

export default class ReasnPrice extends React.Component {
    constructor(props) {
        super(props);

        const value = this.props.value || {};
        this.state = {
            price: value.price || '',
            reason: value.reason || '',
        };
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState(value);
        }
    }

    handleNumberChange(e) {
        const price = parseInt(e || 0, 10);
        if (!('value' in this.props)) {
            this.setState({ price });
        }
        this.triggerChange({ price });
    }

    handleReasonChange(reason) {
        if (!('value' in this.props)) {
            this.setState({ reason });
        }
        this.triggerChange({ reason });
    }

    triggerChange(changedValue) {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }

    render() {
        return (
            <div style={{ display: 'flex', width: '100%' }}>
                <Input
                    type="text"
                    value={this.state.reason}
                    onChange={e => this.handleReasonChange(e.target.value)}
                    style={{ flex: 1, marginRight: 8 }}
                />
                <Input
                    type="text"
                    value={this.state.price}
                    onChange={e => this.handleNumberChange(e.target.value)}
                    style={{ flex: 1, marginRight: 8 }}
                />
            </div>
        );
    }
}


// WEBPACK FOOTER //
// src/routes/lease/return/ReasnPrice.js
