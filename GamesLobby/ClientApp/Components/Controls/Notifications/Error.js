import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../Icon/Icon';


export const Error = (props) => {
    return <div className='flex vertical surface padding radius shadow'>
        <div className='flex wrap'>
            <Icon icon='exclamation-triangle' size='2x' />
            <span className='critical padding'>{props.title}</span>
        </div>
        {props.children}
    </div>;
};

Error.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node
};
