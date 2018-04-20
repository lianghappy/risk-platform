/**
 * @author  WeiJun_Xiang <xiangweijun@jimistore.com>
 * @date    2018/04/17
 *
 * 缺省总条数的分页
 *
 * @param  {number}   current          当前页
 * @param  {number}   dataSize         当前返回数据条数【用于判断是否为最后一页】
 * @param  {function} onChange         页码改变的回调【Function(page, pageSize)】
 * @param  {number}   pageSize         每页条数【default:10】
 * @param  {string[]} pageSizeOptions  指定每页可以显示多少条【default:['10', '20', '30', '40']】
 * @param  {boolean}  showQuickJumper  是否可以快速跳转至某页【default:false】
 * @param  {boolean}  showSizeChanger  是否可以改变pageSize【defailt:false】
 */

import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import './index.scss';

const defaultPageSize = 10; // 默认页面条数
const defaultPageSizeOptions = ['10', '20', '30', '40']; // 默认指定每页可以显示条数

class Pagination extends React.PureComponent {
    static propTypes = {
        current: PropTypes.number.isRequired,
        dataSize: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
        pageSize: PropTypes.number.isRequired,
        pageSizeOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
        showQuickJumper: PropTypes.bool.isRequired,
        showSizeChanger: PropTypes.bool.isRequired,
    };

    state = {
        pageSize: this.props.pageSize || defaultPageSize, // 每页条数
        current: 1, // 当前页数
        propsWithCurrent: typeof this.props.current !== 'undefined', // 是否传入当前页属性current
        jumpPage: '', // 跳转至指定某页
    };

    // 跳转至某页
    onJumper = (e) => {
        if (e.keyCode === 13) {
        // Enter键
            const { onChange } = this.props;
            const {
                jumpPage,
                pageSize,
                propsWithCurrent,
            } = this.state;

            this.setState({
                jumpPage: '',
            });

            if (/^\d+$/.test(jumpPage)) {
            // 页数正整数时跳转
                if (!propsWithCurrent) {
                    this.setState({
                        current: Number(jumpPage),
                    });
                }
                if (onChange) onChange(Number(jumpPage), pageSize);
            }
        }
    };

    onPageSizeChange = (e) => {
        const { onChange } = this.props;
        const pageSize = Number(e.target.value);

        if (this.state.propsWithCurrent) {
            this.setState({
                pageSize,
            });
        } else {
            this.setState({
                current: 1,
                pageSize,
            });
        }

        if (onChange) onChange(1, pageSize);
    };

    onJumperChange = (e) => {
        this.setState({
            jumpPage: e.target.value,
        });
    };

    onPageChange(type) {
        const { propsWithCurrent } = this.state;
        const {
            pageSize = defaultPageSize,
            current,
            dataSize,
            onChange,
        } = this.props;
        let page = propsWithCurrent ? current : this.state.current;

        if (type === 'prev') {
        // 前一页
            if (page === 1) return; // 第一页
            if (page > 1) page -= 1;
        } else {
        // 后一页
            if (dataSize < pageSize) return; // 最后一页
            page += 1;
        }

        if (!propsWithCurrent) {
            this.setState({
                current: page,
            });
        }

        if (onChange) onChange(page, this.state.pageSize);
    }

    render() {
        const {
            pageSizeOptions = defaultPageSizeOptions,
            current,
            dataSize,
            showQuickJumper,
            showSizeChanger,
        } = this.props;
        const { pageSize } = this.state;
        const page = this.state.propsWithCurrent ? current : this.state.current;
        const isFirst = page === 1; // 是否第一页
        const isLast = dataSize < pageSize; // 是否最后一页

        return (
            <ul className="jimi-pagination" unselectable="unselectable">
                {
                    (showQuickJumper || showSizeChanger) &&
                    <li className="jimi-pagination-options">
                        {
                            showQuickJumper &&
                            <div className="jimi-pagination-options-jumper">
                                跳至
                                <input
                                    type="text"
                                    value={this.state.jumpPage}
                                    onChange={this.onJumperChange}
                                    onKeyDown={this.onJumper}
                                />
                                页
                            </div>

                        }
                        {
                            showSizeChanger &&
                            <div className="jimi-pagination-options-pages">
                                <select
                                    value={pageSize}
                                    onChange={this.onPageSizeChange}
                                >
                                    {
                                        pageSizeOptions.map((el) => (
                                            <option value={el} key={el}>{el}条/页</option>
                                        ))
                                    }
                                </select>
                            </div>
                        }

                    </li>
                }
                <li className="jimi-pagination-pages">
                    页码: {page}
                </li>
                <li
                    className={cs('jimi-pagination-prev', isFirst ? 'jimi-pagination-disabled' : '')}
                    onClick={() => this.onPageChange('prev')}
                    role="button"
                >
                    上一页
                </li>
                <li
                    className={cs('jimi-pagination-next', isLast ? 'jimi-pagination-disabled' : '')}
                    onClick={() => this.onPageChange('next')}
                    role="button"
                >
                    下一页
                </li>
            </ul>
        );
    }
}

export default Pagination;
