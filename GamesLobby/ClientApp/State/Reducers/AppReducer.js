import { combineReducers } from 'redux';
import { SocketReducer } from './Socket/SocketReducer';
import { UserReducer } from './User/UserReducer';
import { SettingsReducer } from './Settings/SettingsReducer';
import { ApiReducer } from './API/ApiReducer';
import { StoreReducer } from './Store/StoreReducer';


import { RoachesReducer } from './Competitions/Roaches/RoachesReducer';

// EXPORT APP REDUCER

export const AppReducer = combineReducers({
    user: UserReducer,
    roaches: RoachesReducer,
    store: StoreReducer,
    api: ApiReducer,
    socket: SocketReducer,
    settings: SettingsReducer
});


export const Reducers = {
    Roaches: 'roaches'
};