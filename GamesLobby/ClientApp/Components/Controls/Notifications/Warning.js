import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../Icon/Icon';


export const Warning = (props) => {
    return <div className='flex vertical surface padding radius shadow'>
        <div className='flex wrap'>
            <Icon icon='exclamation-triangle' size='2x' />
            <span className='warning padding'>{props.title}</span>
        </div>
        {props.children}
    </div>;
};

Warning.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node
};
