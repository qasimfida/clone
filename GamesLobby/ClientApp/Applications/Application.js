// IMPORT PACKAGES
import './_application.scss';

import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';

import Centrum from './Centrum';


// COMPONENT
export const Application = ({ store, router }) => {

    return <Provider store={store}>
        <Centrum>
            {router}
        </Centrum>
    </Provider>;
};


export const ApplicationVersion = '0.1 beta';

Application.propTypes = {
    history: PropTypes.object,
    store: PropTypes.object,
    router: PropTypes.node
};