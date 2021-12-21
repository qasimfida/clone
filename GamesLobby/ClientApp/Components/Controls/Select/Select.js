import './_select.scss';

import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';

const Select = (props) => {
    return <ReactSelect classNamePrefix='react-select' {...props}></ReactSelect>;
};

Select.propTypes = {
    children: PropTypes.node
};

export default Select;