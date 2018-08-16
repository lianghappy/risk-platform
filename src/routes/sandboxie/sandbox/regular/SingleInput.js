import React from 'react';
import { Input, Select } from 'antd';
import { connect } from 'dva';

const Option = Select.Option;
const mapStateToProps = (state) => {
    return {
        compareSymbol: state.commonRegular.compareSymbol
    };
};
@connect(mapStateToProps)
export default class SingleInput extends React.Component {
    constructor(props) {
        super(props);

        const value = this.props.value || {};

        this.state = {
            compareSymbol: value.compareSymbol || '',
            judgeValue: value.judgeValue || '',
        };
    }

    componentDidMount() {
        const value = this.props.value;
        this.triggerChange(value);
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            const value = nextProps.value;
            this.setState(value);
        }
    }

    onChange = (compareSymbol) => {
        this.setState({
            compareSymbol,
        });
        this.triggerChange({ compareSymbol });
    }

    handleNumberChange(e) {
        const judgeValue = e;
        if (e.length > 100) {
            return;
        }
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
        const { compareSymbol } = this.props;

        return (
            <div style={{ display: 'flex' }}>
                <Select
                    style={{ width: '154px', marginRight: '20px' }}
                    value={this.state.compareSymbol}
                    onChange={this.onChange}
                >
                    {
                        compareSymbol.map((item, index) => {
                            return (<Option value={item.code} key={index}>{item.name}</Option>);
                        })
                    }
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
