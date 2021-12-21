
import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '../../Icon/Icon';
import { lang } from '../../../Lib/Common/language';

export const Button = (props) => {
    var classNames = ['button'];
    classNames.push(props.className);
    return <button type={props.type} className={classNames.join(' ')} onClick={props.onClick.bind(this)}>
        {props.children}
        {props.icon && <Icon icon={props.icon} />}
        {props.title && <span>{lang(props.title)}</span>}
    </button>;
};

Button.defaultProps = {
    onClick: () => { },
    type: ''
};

Button.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func
};
