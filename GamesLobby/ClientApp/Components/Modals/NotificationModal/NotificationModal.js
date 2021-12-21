import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../Controls/Button/Button';
import { Modal } from '../../../Applications/Centrum';
import { Icon } from '../../Icon/Icon';

export const NotificationModal = (props) => {
    return <div className='surface high border radius shadow flex vertical nowrap'>
        <div className='flex vertical wrap padding margin-top'>
            <Icon icon='thumbs-up' size='3x' className='center'/>
            <div className='center'>
                {props.title}
            </div>
        </div>
        <footer>
            <Button title='Close' onClick={() => {
                Modal.close();
                if (props.options.buttons.close.callback) {
                    props.options.buttons.close.callback();
                }
            }} className='center'><Icon icon='times' /></Button>
        </footer>
    </div>;
};


NotificationModal.defaultProps = {
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

NotificationModal.propTypes = {
    title: PropTypes.string,
    options: PropTypes.object,
    children: PropTypes.node
};
