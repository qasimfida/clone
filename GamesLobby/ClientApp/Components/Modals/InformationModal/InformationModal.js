import './_information-modal.scss';

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../Controls/Button/Button';
import { Modal } from '../../../Applications/Centrum';
import { Icon } from '../../Icon/Icon';

export const InformationModal = (props) => {
    return <div className='information-modal'>
        <header className='surface med information border-bottom padding'>
            <span>{props.title}</span>
        </header>
        {props.children}
        <footer className='surface'>
            <Button title='Close' onClick={() => {
                Modal.close();
                if (props.options.buttons.close.callback) {
                    props.options.buttons.close.callback();
                }
            }} className='align-right'><Icon icon='times' /></Button>
        </footer>
    </div>;
};


InformationModal.defaultProps = {
    options: {
        buttons: {
            confirm: {
                title: 'Ok'
            },
            close: {
                title: 'Close'
            }
        }
    }
};

InformationModal.propTypes = {
    title: PropTypes.string,
    options: PropTypes.object,
    children: PropTypes.node
};
