export const SOCKET_CONNECTED = 'SOCKET_CONNECTED';
export const SEND_SOCKET_MESSAGE = 'SEND_SOCKET_MESSAGE';
export const PROCES_SOCKET_MESSAGE = 'PROCES_SOCKET_MESSAGE';



var socketHandler = null;

const initialState = {
    connected: false,
    lastMessage: '',
    in: 0,
    out: 0,
    lastMessageTime: null,
    lastPayloadSize: 0,
    updates: {

    },
    data: {
    }
};

// REDUCER
export const SocketReducer = (state = initialState, action) => {

    switch (action.type) {
        case SOCKET_CONNECTED:
            socketHandler = action.payload;
            state.connected = true;
            return { ...state };
        case SEND_SOCKET_MESSAGE:
            var sendingData = JSON.stringify(action.payload);
            socketHandler.sendRaw(sendingData);
            state.out += sendingData.length;
            return { ...state };
        case PROCES_SOCKET_MESSAGE:
            state.lastMessageTime = new Date().toLocaleString(navigator.language);
            state.lastPayloadSize = action.payload.length;
            state.in += state.lastPayloadSize;
            return { ...state };
        default:
            return state;
    }
};