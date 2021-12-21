
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../Icon/Icon';

export const Card = (props) => {
    const [collapsed, setCollapsed] = useState(false);

    var classNames = ['card'];
    classNames.push(props.className);
    return <div className={classNames.join(' ')}>
        {
            (props.title || props.icon) && <header>
                {props.icon && <Icon icon={props.icon} />}
                {props.title && <span className='title'>{props.title}</span>}
                {props.header}
                {props.buttons && <div className='align-right'>{props.buttons()}</div>}
                {props.options.collapsible && <a className='align-right option'><Icon icon={collapsed ? 'angle-up' : 'angle-down'} onClick={() => {
                    setCollapsed(!collapsed);
                }} /></a>}
            </header>
        }
        <div className={'body' + (collapsed ? ' collapsed' : '')} style={props.style}>
            {props.children}
        </div>
        {props.footer && <footer>{props.footer}</footer>}
    </div>;
};

Card.defaultProps = {
    options: {
        collapsible: false
    },
    onClick: () => { }
};

Card.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    options: PropTypes.object,
    icon: PropTypes.string,
    buttons: PropTypes.func,
    header: PropTypes.node,
    children: PropTypes.node,
    footer: PropTypes.node,
    onClick: PropTypes.func
};
