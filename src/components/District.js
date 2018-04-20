/**
 *
 *
 * 地理信息
 *
 * @param  {string}   defaultType    默认值类型value/label【default:value】
 * @param  {any}      props          其他参数参考antd-Cascader组件
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
        defaultValue: PropTypes.array.isRequired,
        defaultType: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        placeholder: PropTypes.string.isRequired,
    };

    state = {
        districts: [], // 城市数据集
        value: [], // 选中城市
    };

    componentDidMount() {
        const {
            defaultValue = [],
            defaultType = 'value',
        } = this.props;

        this.getDistrict().then(result => {
            if (defaultType === 'value') {
            // 默认值为城市Code
                this.setState({
                    districts: result,
                    value: defaultValue,
                });
            } else if (defaultType === 'label') {
            // 默认值为城市名称
                this.setState({
                    districts: result,
                    value: this.label2value(defaultValue),
                });
            }
        });
    }

    onChange = (value) => {
        this.setState({
            value,
        });
        if (this.props.onChange) this.props.onChange(value);
    };

    // 城市数据集获取
    getDistrict = () => {
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

    // 根据名称查询城市编码
    getCodeByName = (name, source = []) => {
        const city = {
            code: null,
            next: [],
        };
        source.some(item => {
            if (item.label === name) {
                city.code = item.value;
                city.next = item.children;
                return true;
            }
            return false;
        });
        return city;
    }

    // 将默认城市名称转化为城市编码
    label2value(names = []) {
        const defaultValue = [];
        let city = null;

        // 省
        if (names.length >= 1) {
            city = this.getCodeByName(names[0], districts);
            if (city.code !== null) {
                defaultValue[0] = city.code;
            }
        }
        // 市
        if (defaultValue.length === 1 && names.length >= 2) {
            city = this.getCodeByName(names[1], city.next);
            if (city.code !== null) {
                defaultValue[1] = city.code;
            }
        }
        // 地区
        if (defaultValue.length === 2 && names.length === 3) {
            city = this.getCodeByName(names[2], city.next);
            if (city.code !== null) {
                defaultValue[2] = city.code;
            }
        }

        return defaultValue;
    }

    render() {
        const {
            placeholder = '',
            ...restProps
        } = this.props;

        return (<Cascader
            {...restProps}
            options={this.state.districts}
            value={this.state.value}
            placeholder={placeholder}
            onChange={this.onChange}
            style={{ width: '270px' }}
        />);
    }
}

export default District;
