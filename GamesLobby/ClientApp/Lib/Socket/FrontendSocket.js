import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PROCES_SOCKET_MESSAGE } from '../../State/Reducers/Socket/SocketReducer';

var __socketContext = null;

export const getSocket = () => {
    return __socketContext;
};

export const getWSUri = (relUri) => {
    var uri = new URL(relUri, window.location.href);
    return (uri.protocol === 'https:' ? 'wss' : 'ws') + '://' + uri.host + uri.pathname + uri.search;
};


export const subscribe = (type, payload, timeout = null) => {
    const action = () => getSocket().message('subscribeLive', { subscribe: true, type: type, ...payload });
    if (timeout) {
        setTimeout(action, timeout);
    } else {
        action();
    }
};

export const unsubscribe = (type, payload) => {
    getSocket().message('subscribeLive', { subscribe: false, type: type, ...payload });
};

const FrontendSocket = (props) => {
    const [socket, createSocket] = useState(null);
    const [pendingMessages, setPendingMessages] = useState([]);
    const [authenticated, setAuthenticated] = useState(false);
    const dispatch = useDispatch();
    var interval = null;

    __socketContext = {
        send: send,
        message: (a, b) => message(a, b)
    };


    useEffect(() => {
        createSocket(new WebSocket(getWSUri('/_frontendSocket')));
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.onopen = () => {
            if (interval) clearInterval(interval);
            setInterval(() => {
                send('p');
            }, 10000);
            authenticate();
        };
        socket.onmessage = (message) => onMessageReceived(message);
    }, [socket]);

    useEffect(() => {
        if (authenticated) {
            pendingMessages.map(x => {
                send(x);
            });
        }
    }, [authenticated]);

    const authenticate = () => {
        if (!props.user) {
            setAuthenticated(true);
            return;
        }
        message('authenticate', props.user.lastToken);
    };

    const message = (type, data) => {
        const msg = JSON.stringify({ type: type, data: data });
        if (type != 'authenticate' && !authenticated) {
            setPendingMessages(Object.assign([msg], pendingMessages));
            return;
        }
        send(msg);
    };

    const send = (msg) => {
        if (!socket) return;
        if (socket.readyState != 1) return;
        try {
            socket.send(msg);
        } catch (err) {
            //
            console.log(err);
        }
    };

    const onMessageReceived = (raw) => {
        if (raw.data == 'p') return;
        const message = JSON.parse(raw.data);
        switch (message.type) {
            default:
                dispatch({ type: PROCES_SOCKET_MESSAGE, payload: raw.data });
                //console.log(message);
                break;
        }
    };

    return <React.Fragment />;
};


FrontendSocket.propTypes = {
    user: PropTypes.object,
    settings: PropTypes.object
};

const mapStateToProps = state => {
    return {
        user: state.user.profile,
        settings: state.settings.application
    };
};

const mapDispatchToProps = dispatch => (
    bindActionCreators({
    }, dispatch)
);

const hoc = connect(mapStateToProps, mapDispatchToProps)(FrontendSocket);

// EXPORT COMPONENT
export { hoc as FrontendSocket };

