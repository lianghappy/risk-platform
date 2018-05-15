/**
 * 地理信息
 *
 * @param  {string}   type    默认值类型value/label【default:value】
 * @param  {any}      props   其他参数参考antd-Cascader组件
 */

import React from 'react';
import PropTypes from 'prop-types';
import { message, Cascader } from 'antd';
import { DURATION } from 'utils/constants';
import treeConvert from 'utils/treeConvert';
import { get } from 'utils/request';
import API from 'utils/api';

let districts = null;

class District extends React.PureComponent {
    static propTypes = {
        defaultValue: PropTypes.array,
        type: PropTypes.string,
        onChange: PropTypes.func,
        placeholder: PropTypes.string,
    };

    state = {
        districts: [], // 城市数据集
        value: [], // 选中城市
    };

    componentDidMount() {
        const {
            defaultValue = [],
            type = 'value',
        } = this.props;

        this.getDistrict().then(result => {
            if (type === 'value') {
            // 默认值为城市Code
                this.setState({
                    districts: result,
                    value: defaultValue,
                });
            } else if (type === 'label') {
            // 默认值为城市名称
                this.setState({
                    districts: result,
                    value: this.valuesConvert(defaultValue, { from: 'label', to: 'value' }),
                });
            }
        });
    }

    onChange = (value) => {
        const {
            type,
            onChange,
        } = this.props;

        this.setState({
            value,
        });

        if (onChange) {
            if (type === 'label') {
                value = this.valuesConvert(value, { from: 'value', to: 'label' });
            }
            onChange(value);
        }
    };

    // 城市数据集获取
    getDistrict() {
        return new Promise((resolve, reject) => {
            if (districts) {
                resolve(districts);
            } else {
                get(API.address, null, {
                    standard: false,
                }).then((result) => {
                    districts = [
                        ...result,
                        {
                            id: '710001',
                            v: '台湾',
                            p: '710000',
                        },
                    ];
                    districts = treeConvert({
                        id: 'id',
                        name: 'v',
                        pId: 'p',
                        rootId: '100000',
                        tId: 'value',
                        tName: 'label',
                    }, districts);
                    resolve(districts);
                }).catch((error) => {
                    message.error(error.message, DURATION);
                    reject();
                });
            }
        });
    }

    // 城市编码和名称互转
    valuesConvert(vlues = [], { from, to }) {
        const defaultValue = [];
        let city = null;

        // 省
        if (vlues.length >= 1) {
            city = this.valueConvert(vlues[0], districts, { from, to });
            if (city.value !== null) {
                defaultValue[0] = city.value;
            }
        }
        // 市
        if (defaultValue.length === 1 && vlues.length >= 2) {
            city = this.valueConvert(vlues[1], city.next, { from, to });
            if (city.value !== null) {
                defaultValue[1] = city.value;
            }
        }
        // 地区
        if (defaultValue.length === 2 && vlues.length === 3) {
            city = this.valueConvert(vlues[2], city.next, { from, to });
            if (city.value !== null) {
                defaultValue[2] = city.value;
            }
        }

        return defaultValue;
    }

    // 根据名称查询城市编码【城市编码查询名称】
    valueConvert(value, source = [], { from, to }) {
        const result = {
            value: null,
            next: [],
        };
        source.some(item => {
            if (item[from] === value) {
                result.value = item[to];
                result.next = item.children;
                return true;
            }
            return false;
        });
        return result;
    }

    render() {
        const {
            placeholder = '',
            type,
            ...restProps
        } = this.props;

        return (
            <Cascader
                {...restProps}
                options={this.state.districts}
                value={this.state.value}
                placeholder={placeholder}
                onChange={this.onChange}
                style={{ width: '270px' }}
            />
        );
    }
}

export default District;
