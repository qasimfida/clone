import './_countryIcons.scss';

import React from 'react';
import PropTypes from 'prop-types';
import { replaceSpace } from '../../../../Lib/Common/textHelpers';


export const Country = (props) => {
    if (!props.name) return <span />;
    var classList = ['country-icon'];
    classList.push(props.className);
    classList.push(props.size);
    return <span className={classList.join(' ') + ' country-' + replaceSpace(props.name.toLowerCase()).replace('&', 'and').replace(',', '')}></span>;
};

Country.defaultProps = {
    size: '',
    className: ''
};

Country.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.string
};
