import React from 'react';
import PropTypes from 'prop-types';

// 空过滤
function isNull(value) {
    if (
        typeof value === 'undefined'
        || value === 'undefined'
        || value === 'null'
        || value === ''
    ) {
        return true;
    }
    return false;
}

// 分->元
function fen2yuan(value) {
    value = Number(value);
    if (Number.isNaN(value)) return '0.00';
    return (parseInt(value, 10) / 100).toFixed(2);
}

const Filter = (props) => {
    const { value, type } = props;
    let data = '';
    /* eslint no-case-declarations: "off" */
    switch (type) {
    case 'null':
        const { formate = '--' } = props;
        data = isNull(value) ? formate : value;
        break;
    case 'price':
        const { prefix } = props;
        data = fen2yuan(value);
        if (prefix) data = prefix + data;
        break;
    default:
        data = '';
    }

    return (
        <span>{data}</span>
    );
};

Filter.propTypes = {
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

export default Filter;
