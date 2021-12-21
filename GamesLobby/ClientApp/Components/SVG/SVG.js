import PropTypes from 'prop-types';
import React from 'react';


export const SVGIcon = (props) => {
    return <React.Fragment>{props.icon(props.className)}</React.Fragment>;
};

SVGIcon.defaultProps = {
    className: ''
};

SVGIcon.propTypes = {
    icon: PropTypes.func,
    className: PropTypes.string
};