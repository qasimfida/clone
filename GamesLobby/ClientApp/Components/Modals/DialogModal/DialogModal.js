import './_dialogModals.scss';

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../Controls/Button/Button';
import { Modal } from '../../../Applications/Centrum';
import { Icon } from '../../Icon/Icon';
import { lang } from '../../../Lib/Common/language';

export const DialogModal = (props) => {
    const classList = ['surface border radius shadow flex vertical nowrap', props.className];
    return <div className={classList.join(' ')}>
        <header className='surface information border-bottom padding'>
            <span>{lang(props.title)}</span>
        </header>
        <div className='body padding'>
            {props.children}
        </div>
        <footer>
            <Button title={lang(props.options.buttons.confirm.title)} className='confirm align-right' onClick={() => {
                Modal.close();
                if (props.onConfirm) props.onConfirm();
                if (props.options?.buttons?.confirm.callback) {
                    props.options.buttons.confirm.callback();
                }
            }}><Icon icon='check' /></Button>
            <Button title={lang('Close')} onClick={() => {
                Modal.close();
                if (props.options?.buttons?.close?.callback) {
                    props.options.buttons.close.callback();
                }
            }} className='align-right'><Icon icon='times' /></Button>
        </footer>
    </div>;
};


DialogModal.defaultProps = {
    options: {
        buttons: {
            confirm: {
                title: lang('Ok')
            },
            close: {
                title: lang('Close')
            }
        }
    }
};

DialogModal.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    options: PropTypes.object,
    children: PropTypes.node,

    onConfirm: PropTypes.func
};
