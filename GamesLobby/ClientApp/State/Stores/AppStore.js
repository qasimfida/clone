// IMPORT PACKAGE REFERENCES

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

// IMPORT MIDDLEWARE

import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';


// IMPORT REDUCERS

import { AppReducer } from '../Reducers/AppReducer';

var _store = null;

export const getStore = () => {
    return _store;
};

export const createAppStore = () => {
    var store = createStore(AppReducer, composeWithDevTools(applyMiddleware(thunk, promiseMiddleware())));
    _store = store;
    return store;
};