export const slipVersion = 2.0;

import { getLocalStorage } from '../../../../Lib/Common/storage';
import { calculate, calculateRacing, emptyMultibetOptions } from './BetBuilderHelpers';

export const emptyBetSlip = () => {
    return {
        selections: {

        },
        events: {

        },
        multipleBetOptions: emptyMultibetOptions(),
        stake: 0,
        bets: 0,
        possibleWin: 0,
        totalSelections: 0
    };
};


export const restoreSlip = () => {
    const slip = getLocalStorage('sports-slip');
    if (!slip || slip.version !== slipVersion) return emptyBetSlip();
    return slip;
};

export const BetBuilder = (state, onComplete) => {
    var copy = Object.assign({}, state);

    const toggleRacingSelection = (payload) => {
        if (state.slip.selections.hasOwnProperty(payload.id)) {
            delete state.slip.selections[payload.id];
            state.slip.events[payload.event.id]--;
            if (state.slip.events[payload.event.id] == 0) delete state.slip.events[payload.event.id];
        } else {
            if (!state.slip.events[payload.event.id]) state.slip.events[payload.event.id] = 0;
            state.slip.events[payload.event.id]++;
            state.slip.selections[payload.id] = payload;
        }

        copy.slip.odds = 1;
        calculateRacing(copy.slip);
        return copy;
    };

    const toggleEachway = (payload) => {
        state.slip.selections[payload.id].ew = !state.slip.selections[payload.id].ew;
        copy.slip.odds = 1;
        calculateRacing(copy.slip);
        return copy;
    };

    const toggleSystemEachway = (payload) => {
        copy.slip.multipleBetOptions[payload].ew = !copy.slip.multipleBetOptions[payload].ew;
        copy.slip.odds = 1;
        calculateRacing(copy.slip);
        return copy;
    };


    const toggleSelection = (payload) => {

        const selection = payload.selection;
        const event = payload.event;
        var selections = copy.slip.selections;
        copy.slip.multipleBetOptions = emptyMultibetOptions();
        if (selections.hasOwnProperty(selection.id)) {
            delete selections[selection.id];
        } else {
            if (copy.slip.events.hasOwnProperty(event.id)) {
                delete copy.slip.selections[copy.slip.events[event.id].selectionId];
            }

            selections[selection.id] = selection;
            selections[selection.id].selected = true;
            selections[selection.id].event = event;
            selections[selection.id].market = {
                id: payload.market.id,
                languages: payload.market.languages,
                name: payload.market.name,
                specifiers: payload.market.specifiers
            };

            copy.slip.events[event.id] = event;
            copy.slip.events[event.id].selectionId = selection.id;
        }

        copy.slip.selections = selections;
        copy.slip.odds = 1;
        Object.values(selections).map(x => copy.slip.odds *= x.price);

        calculate(copy.slip);

        if (onComplete) onComplete(copy);
        return copy;
    };

    const bet = (payload, racing) => {
        const type = payload.type;
        const amount = payload.amount;

        // always clear amounts if multibetoptions is not enabled
        //if (copy.slip.totalSelections < 2) copy.slip.multipleBetOptions = emptyMultibetOptions();

        copy.slip.multipleBetOptions[type].amount = parseFloat(amount);
        const calculator = racing ? calculateRacing : calculate;
        calculator(copy.slip);

        var multiBets = 0;
        var systemEnabled = false;
        var folding = false;
        var coupons = 0;

        Object.keys(copy.slip.multipleBetOptions).map(systemType => {
            const system = copy.slip.multipleBetOptions[systemType];
            if (system.enabled && system.amount) {
                multiBets++;
                coupons += system.bets;
                if (
                    systemType == 'trixie' ||
                    systemType == 'patent' ||
                    systemType == 'yankee' ||
                    systemType == 'lucky15' ||
                    systemType == 'superYankee' ||
                    systemType == 'lucky31' ||
                    systemType == 'lucky63' ||
                    systemType == 'heinz' ||
                    systemType == 'superHeinz'
                ) {
                    systemEnabled = true;
                }

                if (systemType.indexOf('fold') >= 0) {
                    folding = true;
                }

                if (systemType == 'doubles') {
                    folding = true;
                    if (copy.slip.totalSelections > 2) {
                        folding = false;
                        systemEnabled = true;
                    }
                }
                if (systemType == 'triples') {
                    folding = true;
                    if (copy.slip.totalSelections > 3) {
                        folding = false;
                        systemEnabled = true;
                    }
                }
            }
        });

        copy.slip.type = 0;
        copy.slip.folding = folding;
        copy.slip.multiBets = multiBets > 1;
        copy.slip.system = systemEnabled;
        copy.slip.coupons = coupons;

        if (copy.slip.folding) copy.slip.type = 1;
        if (copy.slip.system || copy.slip.multiBets) copy.slip.type = 2;


        if (onComplete) onComplete(copy);
        return copy;
    };


    const clear = (lastSlip) => {

        copy.lastSlip = lastSlip;
        copy.slip = emptyBetSlip();
        return copy;
    };

    const restore = (lastSlip) => {
        copy.slip = lastSlip;
        copy.lastSlip = null;
        return copy;
    };

    return {
        toggleSelection: toggleSelection,
        toggleRacingSelection: toggleRacingSelection,
        toggleEachway: toggleEachway,
        toggleSystemEachway: toggleSystemEachway,
        bet: bet,
        clear: clear,
        restore: restore
    };
};