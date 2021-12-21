
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import ModalControl from '../Components/Modals/Modal';
import OverlayControl from '../Components/Overlay/Overlay';

export const CentrumContext = React.createContext();

var _modalContext = null;
var _overlayContext = null;

const listenEscapeKey = (e) => {
    if (e.target.type == 'INPUT') return;
    if (e.key === 'Escape') {
        Modal.close();
    }
};

window.addEventListener('keyup', listenEscapeKey);

export const Modal = {
    open: (modal) => {
        if (!_modalContext) return;
        _modalContext.open(modal);
    },
    close: () => {
        if (!_modalContext) return;
        _modalContext.close();
    }
};

export const Overlay = {
    open: (overlay) => {
        if (!_overlayContext) return;
        _overlayContext.open(overlay);
    },
    close: () => {
        if (!_overlayContext) return;
        _overlayContext.close();
    }
};


const Centrum = (props) => {
    const [modal, openModal] = useState(null);
    const [overlay, openOverlay] = useState(null);
    const context = {
        modal: _modalContext,
        overlay: _overlayContext
    };

    _modalContext = {
        open: (control) => {
            document.getElementsByTagName('html')[0].classList.add('modal-open');
            openModal(control);
        },
        close: () => {
            document.getElementsByTagName('html')[0].classList.remove('modal-open');
            openModal(null);
        }
    };

    _overlayContext = {
        open: (control) => {
            openOverlay(control);
        },
        close: () => {
            openOverlay(null);
        }
    };

    const dispatch = useDispatch();

    useEffect(() => {
        const resize = () => {
            const width = window.innerWidth;
            const height = window.innerWidth;
            var mobile = (typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1) || width <= 1024;
            dispatch({ type: 'RESIZE', payload: { width: width, height: height, mobile: mobile } });
        };
        window.addEventListener('resize', resize);

        resize();
    }, []);


    return <div className='application'>
        <CentrumContext.Provider value={context}>
            {props.children}
            <OverlayControl overlay={overlay} />
            <ModalControl modal={modal} />
        </CentrumContext.Provider>
    </div>;
};

Centrum.propTypes = {
    user: PropTypes.object,
    children: PropTypes.node
};

// CONFIGURE REACT REDUX
const mapStateToProps = state => {
    return {
        user: state.user.profile,
        socket: state.socket
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
    }, dispatch)
);

const hoc = connect(mapStateToProps, mapDispatchToProps)(Centrum);

// EXPORT COMPONENT
export default hoc;
