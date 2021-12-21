const initialState = {
    profile: null
};

// REDUCER
export const UserReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'BALANCE_UPDATE':
            var balanceData = action.payload.split(':');
            var currency = balanceData[0];
            var balance = balanceData[1];
            var bonus = balanceData[2];

            if (currency != state.profile?.currency) return;

            if (bonus == 'True') {
                state.profile.bonusBalance = balance;
            } else {
                state.profile.balance = balance;
            }
            return { ...state };
        case 'USER_LOGIN':
            state.profile = action.payload;
            return { ...state };
        default:
            return state;
    }
};