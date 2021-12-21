import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Icon } from '../../../Icon/Icon';
import { lang } from '../../../../Lib/Common/language';

export const NavButton = (props) => {

    return <NavLink to={props.path} className={`button${props.className ? ` ${props.className}` : ''}`} activeClassName='active'>
        {props.children}
        {props.icon && <Icon icon={props.icon} />}
        {props.title && <span>{lang(props.title)}</span>}
    </NavLink>;
};

NavButton.propTypes = {
    className: PropTypes.string,
    path: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func
};