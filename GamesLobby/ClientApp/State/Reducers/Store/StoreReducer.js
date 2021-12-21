const initialState = {
};

// REDUCER
export const StoreReducer = (state = initialState, action) => {
    if (action.type.indexOf('_') == 0) {
        var newState = Object.assign({}, state);
        var property = '';

        if (action.type.indexOf('_PENDING') >= 0) {
            property = action.type.replace('_PENDING', '');
            newState[property + '_loading'] = true;

            return newState;
        }

        if (action.type.indexOf('_FULFILLED') >= 0) {
            property = action.type.replace('_FULFILLED', '');
            property = property.substring(1, property.length);
            newState[property] = action.payload;
            newState[property + '_loading'] = false;
            return newState;
        }

        if (action.type.indexOf('_FAILED') >= 0) {
            property = action.type.replace('_FAILED', '');
            property = property.substring(1, property.length);
            newState[property + '_loading'] = false;
            return newState;
        }
    }
    return state;
};