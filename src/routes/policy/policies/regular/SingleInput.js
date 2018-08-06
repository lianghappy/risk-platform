import React from 'react';
import { Input, Select } from 'antd';

const Option = Select.Option;
export default class ReasnPrice extends React.Component {
    constructor(props) {
        super(props);

        const value = this.props.value || {};
        this.state = {
            compareSymbol: value.compareSymbol || '=',
            judgeValue: value.judgeValue || '',
        };
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState(value);
        }
    }

    handleNumberChange(e) {
        const judgeValue = parseInt(e || 0, 10);
        if (!('value' in this.props)) {
            this.setState({ judgeValue });
        }
        this.triggerChange({ judgeValue });
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
            <div style={{ display: 'flex' }}>
                <Select
                    style={{ width: '154px', marginRight: '20px' }}
                    value={this.state.compareSymbol}
                >
                    <Option value="=">=</Option>
                </Select>
                <Input
                    type="text"
                    value={this.state.judgeValue}
                    onChange={e => this.handleNumberChange(e.target.value)}
                    style={{ width: '154px' }}
                    placeholder="请输入判定阈值"
                />
            </div>
        );
    }
}


// WEBPACK FOOTER //
// src/routes/lease/return/ReasnPrice.js
