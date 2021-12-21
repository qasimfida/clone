import './_modal.scss';

import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from '../../Applications/Centrum';

const ModalContainer = (props) => {
    if (!props.modal) return <React.Fragment />;
    return <div className='modal-container' onClick={(e) => {
        if (e.target.className === 'modal-container') {
            Modal.close();
        }
    }}>
        <div className='modal'>
            {props.modal}
        </div>
    </div>;
};

ModalContainer.propTypes = {
    modal: PropTypes.node
};
export default ModalContainer;
