var __settings = null;
export const getApplicationSettings = () => {
    return __settings;
};

const initialState = {
    application: null,
    screen: {
        width: window.innerWidth,
        height: window.innerWidth,
        mobile: window.innerWidth <= 1024
    }
};

// REDUCER
export const SettingsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'RESIZE':
            var className = 's-hd';
            var width = action.payload.width;

            if (width < 1280) {
                className = 'mobile';
            }

            if (width >= 1280 && width < 1440) {
                className = 's-1280';
            }

            if (width >= 1440 && width < 1600) {
                className = 's-1440';
            }

            if (width >= 1600 && width < 1920) {
                className = 's-1600';
            }

            if (width >= 1920) {
                className = 's-hd';
            }

            document.getElementsByTagName('html')[0].classList.add(className);

            return { ...state, ...{ screen: action.payload } };
        case 'APPLICATION':
            __settings = { ...state, ...{ application: action.payload } };

            return __settings;
        default:
            return state;
    }
};

