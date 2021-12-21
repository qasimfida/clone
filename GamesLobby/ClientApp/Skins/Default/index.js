import 'regenerator-runtime/runtime';

import './skin.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Application } from '../../Applications/Application';
import AppRouter from '../../Routers/ApplicationRouter';

import { createAppStore } from '../../State/Stores/AppStore';
import { API, Endpoints } from '../../Lib/Api/Api';

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

const initSentry = false;
if (initSentry) {
    Sentry.init({
        dsn: 'https://1e02545bf9d44329a3c2ec559b743c91@o960400.ingest.sentry.io/5994235',
        integrations: [new Integrations.BrowserTracing()],

        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });
}


export const appHistory = createBrowserHistory();

var store = createAppStore();
export const getStore = () => {
    return store;
};


API.get(Endpoints.Session).then((result) => {
    const payload = result.result;

    if (payload.user && !payload.user.semiLogin) {
        getStore().dispatch({ type: 'USER_LOGIN', payload: payload.user });
        window.___c = payload.user.currency;
    }

    getStore().dispatch({ type: 'APPLICATION', payload: payload });
    ReactDOM.render(<Application history={appHistory} store={store} router={<AppRouter />} />, document.getElementById('body'));
}).catch(() => {
    ReactDOM.render(<Application history={appHistory} store={store} router={<AppRouter />} />, document.getElementById('body'));
});