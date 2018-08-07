import React from 'react';
import { Select } from 'antd';
import { connect } from 'dva';

const Option = Select.Option;
const datas = [
    {
        name: '商品类型',
        key: 'goodsType',
    }, {
        name: '业务流程',
        key: 'businessFlow',
    }, {
        name: '下单终端',
        key: 'sceneType',
    }, {
        name: '授权认证类型',
        key: 'liveType',
    },
];
const mapStateToProps = (state) => {
    return {
        getAllType: state.warnCommon.getAllType
    };
};
@connect(mapStateToProps)
export default class ConditionInput extends React.Component {
    constructor(props) {
        super(props);

        const value = this.props.value || {};
        this.state = {
            judgeKey: value.judgeKey || '',
            judgeValue: value.judgeValue || '',
            compareSymbol: value.compareSymbol || '',
            getAllType: [],
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

    onChange = (judgeKey) => {
        this.setState({
            judgeKey,
        });
        this.triggerChange({ judgeKey });
        let type = judgeKey;
        if (judgeKey === 'businessFlow') {
            type = 'businessProcess';
        }
        this.props.dispatch({
            type: 'warnCommon/getAllType',
            payload: {
                type,
            }
        }).then(() => {
            const { getAllType } = this.props;
            this.setState({
                getAllType,
                judgeValue: '',
            });
        });
    }

    onChanges = (judgeValue) => {
        this.setState({
            judgeValue,
        });
        this.triggerChange({ judgeValue });
    }

    onChangess = (compareSymbol) => {
        this.setState({
            compareSymbol,
        });
        this.triggerChange({ compareSymbol });
    }

    triggerChange(changedValue) {
        const onChange = this.props.onChange;
        if (onChange) {
            onChange(Object.assign({}, this.state, changedValue));
        }
    }

    render() {
        const { getAllType } = this.state;
        return (
            <div style={{ display: 'flex' }}>
                <Select
                    style={{ width: '154px', marginRight: '20px' }}
                    value={this.state.judgeKey}
                    onChange={this.onChange}
                >
                    {
                        datas.map((item, index) => {
                            return (<Option key={index} value={item.key}>{item.name}</Option>);
                        })
                    }
                </Select>
                <Select
                    style={{ width: '154px', marginRight: '20px' }}
                    value={this.state.compareSymbol}
                    onChange={this.onChangess}
                >
                    <Option value="=">=</Option>
                </Select>
                <Select
                    style={{ width: '154px', marginRight: '20px' }}
                    value={this.state.judgeValue}
                    onChange={this.onChanges}
                >
                    {
                        getAllType.map(item => {
                            return (<Option key={item.id} value={item.code}>{item.name}</Option>);
                        })
                    }
                </Select>
            </div>
        );
    }
}


// WEBPACK FOOTER //
// src/routes/lease/return/ReasnPrice.js
