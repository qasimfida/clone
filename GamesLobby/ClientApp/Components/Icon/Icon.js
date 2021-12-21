import './_icon.scss';
import React from 'react';
import PropTypes from 'prop-types';

export const Icon = (props) => {
    var classNames = ['icon'];
    classNames.push(props.type);
    classNames.push('fa-' + props.icon);
    classNames.push('fa-' + props.size);
    classNames.push(props.className);
    return <i className={classNames.join(' ')} onClick={props.onClick.bind(this)} />;
};

Icon.defaultProps = {
    size: '1x',
    type: 'fas',
    onClick: () => { }
};

Icon.propTypes = {
    size: PropTypes.string,
    icon: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func
};
