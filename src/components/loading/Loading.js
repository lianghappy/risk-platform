import React from 'react';
import { Spin } from 'antd';
import PropTypes from 'prop-types';
import { layout } from './index.scss';

const Loading = ({ visible }) => {
    if (!visible) return '';
    return (
        <div className={layout}>
            <Spin />
        </div>
    );
};
Loading.propTypes = {
    visible: PropTypes.bool.isRequired,
};
export default Loading;
