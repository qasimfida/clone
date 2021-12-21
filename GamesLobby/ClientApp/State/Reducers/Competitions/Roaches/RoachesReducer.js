import { BetBuilder, restoreSlip } from '../BetBuilder/BetBuilder';

export const RoachActions = {
    RACING_UPDATE: 'RACING_UPDATE',
    SUBSCRIBE_ROACHES: 'SUBSCRIBE_ROACHES',
    UNSUBSCRIBE_ROACHES: 'UNSUBSCRIBE_ROACHES',

    ROACHES_TREE: 'ROACHES_TREE',

    SUBSCRIBE_ROACH_EVENT: 'SUBSCRIBE_ROACH_EVENT',


    // BETSLIP
    TOGGLE_ROACH_SELECTION: 'TOGGLE_ROACH_SELECTION',
    TOGGLE_ROACH_EW: 'TOGGLE_ROACH_EW',
    TOGGLE_ROACH_SYTEM_EW: 'TOGGLE_ROACH_SYTEM_EW',
    UPDATE_ROACH_BET_AMOUNT: 'UPDATE_ROACH_BET_AMOUNT',
    CLEAR_ROACH_BETS: 'CLEAR_ROACH_BETS',
    RESTORE_ROACH_SLIP: 'RESTORE_ROACH_SLIP'

};

const initialState = {
    tree: null,
    slip: restoreSlip(),
    stream: {
        source: 'http://3.65.36.44:8080/hls/bug.m3u8'
    }
};


// REDUCER
export const RoachesReducer = (state = initialState, action) => {
    switch (action.type) {
        // BET SLIP
        case RoachActions.CLEAR_ROACH_BETS:
            return BetBuilder(state).clear(action.payload, true);
        case RoachActions.RESTORE_ROACH_SLIP:
            return BetBuilder(state).restore(action.payload, true);
        case RoachActions.UPDATE_ROACH_BET_AMOUNT:
            return BetBuilder(state, null).bet(action.payload, true);
        case RoachActions.TOGGLE_ROACH_SELECTION:
            return BetBuilder(state, null).toggleRacingSelection(action.payload);
        case RoachActions.TOGGLE_ROACH_SYTEM_EW:
            return BetBuilder(state, null).toggleSystemEachway(action.payload);
        case RoachActions.TOGGLE_ROACH_EW:
            return BetBuilder(state, null).toggleEachway(action.payload);

        // STREAM
        case RoachActions.SIS_STREAM:
            state.stream = action.payload;
            return Object.assign({}, state);
        default:
            return state;
    }
};