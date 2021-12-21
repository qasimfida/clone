import './_roach-silk.scss';

import React from 'react';
import PropTypes from 'prop-types';
export const RoachSilk = (props) => {
    return <div className='silk roach'>
        <span>{props.skin}</span>
    </div>;
};

RoachSilk.propTypes = {
    skin: PropTypes.number
};