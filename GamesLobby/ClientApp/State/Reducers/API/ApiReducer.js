
const initialState = {
    request: ''
};

export const ApiReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'REQUEST':
            state.request = action.payload;
            return { ...state };
        default:
            return state;
    }
};