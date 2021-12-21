import './_sliding-menu.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../Icon/Icon';

export const SlidingMenu = (props) => {
    return <div className={`sliding-menu${props.open ? ' open' : ''}${props.className ? ` ${props.className}` : ''}`}>
        {
            props.header && <header>
                {props.title}
                <Icon icon='times' className='clickable' onClick={() => props.onToggleMenu()} />
            </header>
        }
        <div className='body scrollable'>
            {props.children}
        </div>
    </div>;
};

SlidingMenu.defaultProps = {
    header: true
};

SlidingMenu.propTypes = {
    className: PropTypes.string,
    header: PropTypes.bool,
    open: PropTypes.bool,
    title: PropTypes.any,
    children: PropTypes.node,
    onToggleMenu: PropTypes.func
};