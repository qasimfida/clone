import './_overlay.scss';

import React from 'react';
import PropTypes from 'prop-types';


const Overlay = (props) => {
    if (!props.overlay) return <React.Fragment />;
    return <div className='overlay-container'>
        <div className='overlay'>
            {props.overlay}
        </div>
    </div>;
};

Overlay.propTypes = {
    overlay: PropTypes.node
};
export default Overlay;
