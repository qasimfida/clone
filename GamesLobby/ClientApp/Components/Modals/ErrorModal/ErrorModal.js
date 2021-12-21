import './_error-modal.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../Controls/Button/Button';
import { Modal } from '../../../Applications/Centrum';
import { Icon } from '../../Icon/Icon';


export const ErrorModal = (props) => {
    return <div className='error-modal'>
        <header className='surface critical border-bottom padding'>
            <Icon icon='exclamation-circle' /> <span>{props.title}</span>
        </header>
        <div className='surface flex vertical nowrap'>
            <div className='padding'>
                {props.description}
            </div>
            {props.children}
        </div>
        <footer className='surface'>
            <Button title='Close' onClick={() => Modal.close()}><Icon icon='times' /></Button>
        </footer>
    </div>;
};


ErrorModal.defaultProps = {
    description: 'No further error provided, this can be a server error. Please try later.'
};

ErrorModal.propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
    children: PropTypes.node
};
