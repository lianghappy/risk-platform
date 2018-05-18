/**
 * 地理信息
 *
 * @param   {string} type 默认值类型value/label【default:value】
 * @param   {any} props 其他参数参考antd-Cascader组件
 *
 * @author  WeiJun_Xiang <xiangweijun@jimistore.com>
 * @date    2018/04/15
 */

import React from 'react';
import PropTypes from 'prop-types';
import { message, Cascader } from 'antd';
import treeConvert, { treePick } from 'utils/treeConvert';
import { get } from 'utils/request';

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

        get('https://product.jimistore.com/area/manageContAddrProd.json', null, {
            standard: false,
        }).then((result) => {
            const districts = treeConvert({
                rootId: '100000',
                pId: 'p',
                name: 'v',
                tId: 'value',
                tName: 'label',
            }, [
                ...result,
                {
                    p: '710000',
                    id: '710001',
                    v: '台湾',
                },
            ]);

            if (type === 'value') {
                // 默认值为城市编码
                this.setState({
                    districts,
                    value: defaultValue,
                });
            } else if (type === 'label') {
            // 默认值为城市名称
                this.setState({
                    districts,
                    value: treePick(districts, defaultValue, { from: 'label', to: 'value' }),
                });
            }
        }).catch((error) => {
            message.error(error.message);
        });
    }

    onChange = (value) => {
        const {
            type,
            onChange,
        } = this.props;

        this.setState({ value });

        if (onChange) {
            if (type === 'label') {
                value = treePick(this.state.districts, value, { from: 'value', to: 'label' });
            }
            onChange(value);
        }
    };

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
