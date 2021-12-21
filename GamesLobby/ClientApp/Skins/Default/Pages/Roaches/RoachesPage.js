import './_roaches-page.scss';
import React from 'react';
import { Page } from '../../../../Components/Page/Page';
import { BetSlip } from '../../../../Components/BetSlip/BetSlip';
import { Runners } from '../../../../Components/Runners/Runners';
import { RoachActions } from '../../../../State/Reducers/Competitions/Roaches/RoachesReducer';
import { Reducers } from '../../../../State/Reducers/AppReducer';
// import { LiveBroadcast } from '../../../../Components/LiveBroadcast/LiveBroadcast';

export const RoachesPage = () => {
    return <Page className='roaches' compact>
        <div className='content'>
            <section>
                <div className='flex vertical video surface'>
                    {/* <LiveBroadcast reducer={Reducers.Roaches} /> */}
                </div>
            </section>
            <Runners
                reducer={Reducers.Roaches}
                toggleSelection={RoachActions.TOGGLE_ROACH_SELECTION}
                updateBetAmount={RoachActions.UPDATE_ROACH_BET_AMOUNT}
            />
        </div>
        <BetSlip reducer={Reducers.Roaches}
            clearBets={RoachActions.CLEAR_ROACH_BETS}
            toggleSelection={RoachActions.TOGGLE_ROACH_SELECTION}
            updateBetAmount={RoachActions.UPDATE_ROACH_BET_AMOUNT}
        />
    </Page>;
};

export default RoachesPage;