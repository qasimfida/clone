import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from '../../Icon/Icon';
import { lang } from '../../../Lib/Common/language';

export const CollapsingHeader = (props) => {
    if (!props.show) return <></>;
    return <header>{props.icon && <Icon icon={props.icon} size='1x' />}{props.title && <span>{lang(props.title)}</span>}{props.children}<Icon icon='angle-up' size='1x' className='clickable toggle-collapse' onClick={(e) => e.target.parentNode.parentNode.classList.toggle('collapsed')} /></header>;
};

CollapsingHeader.defaultProps = {
    show:true
};

CollapsingHeader.propTypes = {
    show: PropTypes.bool,
    icon: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.node
};