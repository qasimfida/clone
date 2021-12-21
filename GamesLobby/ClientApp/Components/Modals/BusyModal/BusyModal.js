import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../Icon/Icon';

export const BusyModal = (props) => {
    return <div className='surface low border radius shadow padding modal-small'>
        <Icon icon='spinner' className='fa-spin margin-right'/> {props.title} {props.children}
    </div>;
};

BusyModal.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node
};
