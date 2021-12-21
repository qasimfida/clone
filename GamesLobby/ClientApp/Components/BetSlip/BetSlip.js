import './_bet-slip.scss';

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { lang } from '../../Lib/Common/language';
import { useDispatch, useSelector } from 'react-redux';
import { PriceType } from '../Price/Price';
import { CollapsingHeader } from '../Controls/Lists/CollapsingHeader';
import { Icon } from '../Icon/Icon';
import { Button } from '../Controls/Button/Button';
import { currency } from '../../Lib/Common/currency';
import { Modal } from '../../Applications/Centrum';
import { DialogModal } from '../Modals/DialogModal/DialogModal';
import { ordinalNumbers } from '../../Lib/Common/numberHelpers';

const SlipTabs = {
    Slip: 'Slip',
    Bets: 'Bets'
};


const SystemNames = {
    'singles': 'Singles',
    'doubles': 'Doubles',
    'triples': 'Triples',
    'trixie': 'Trixie',
    'fold4': '4 Fold',
    'fold5': '5 Fold',
    'fold6': '6 Fold',
    'fold7': '7 Fold',
    'patent': 'Patent',
    'yankee': 'Yankee',
    'lucky15': 'Lucky 15',
    'superYankee': 'Super Yankee',
    'lucky31': 'Lucky 31',
    'lucky63': 'Lucky 63',
    'heinz': 'Heinz',
    'superHeinz': 'Super Heinz'
};


export const BetSlip = (props) => {
    const [tab, setActiveTab] = useState(SlipTabs.Slip);
    const user = useSelector((state) => state.user);
    const player = user?.profile;

    const reducer = useSelector((state) => state[props.reducer]);
    const slip = reducer.slip;
    const [focusInput, setFocusInput] = useState(null);
    const dispatch = useDispatch();
    var setSystemTimeOut = null;

    useEffect(() => {
        if (focusInput) {
            var input = document.getElementById(focusInput);
            if (input) {
                input.focus();
            }
        }
    });


    const submit = () => {

        try {
            var bets = [];
            Object.values(slip.selections).filter(x => x.selected).map(selection => {
                var runners = [];
                var type = 0;
                if (selection.forecast) type = 1;
                if (selection.tricast) type = 2;

                selection.selections.map(runner => {
                    var runnerData = {
                        id: runner.id,
                        price: runner.price,
                        priceDecimal: runner.priceDecimal,
                        place: runner.selection
                    };

                    if (selection.startingPrice) {
                        delete runnerData.price;
                        delete runnerData.priceDecimal;
                    }

                    if (runner.selection) runnerData.number = runner.selection;
                    if (type == 0) runnerData.eachWay = selection.ew ?? false;
                    runners.push(runnerData);
                });

                bets.push({
                    eventKey: selection.event.eventKey,
                    eventType: selection.event.raceType,
                    runners: runners,
                    startingPrice: selection.startingPrice,
                    type: type,
                    amount: selection.forecast || selection.tricast || type == 0 ? selection.amount : 0,
                    totalAmount: selection.forecast || selection.tricast || type == 0 ? selection.totalAmount : 0
                });
            });

            var payload = {
                bets: bets,
                multipleBetOptions: slip.multipleBetOptions,
                acceptOddChanges: acceptOddChanges,
                bonusWallet: useBonusBalance == true
            };

            API.post(TicketEndpoints.SubmitRacing, payload, 'Please wait submiting your bets...', 'unable to submit bets').then((result) => {
                dispatch({ type: props.clearBets, payload: Object.assign(slip) });
            }).catch((result) => {
                var error = '';
                if (result.error.data) {
                    try {
                        const errorData = JSON.parse(result.error.data);
                        error = errorData.Message;
                    } catch (err) {
                        //
                    }
                }
                Modal.open(<ErrorModal title={'Unable to submit bets'} description={error} />);
            });
        } catch (err) {
            console.log(err);
        }
    };

    const confirmSubmit = () => {
        if (player) {
            var balanceError = 0;
            var amountNeeded = 0;
            balanceError = true;
            amountNeeded = slip.stake - player.balance;

            if (balanceError) {
                Modal.open(<DialogModal title='Insufficient funds.' options={{
                    buttons: {
                        confirm: {
                            title: 'Deposit',
                            callback: () => {
                                appHistory.push('/deposit');
                            }
                        },
                        close: {
                            title: 'Close'
                        }
                    }
                }}>
                    <p className='padding'>{lang('You need %1 to submit your bets', [currency(amountNeeded, player.currency)])} </p>
                </DialogModal>);

                return;
            }
        }

        var type = 'single';
        if (slip.type == 1) type = 'folding';
        if (slip.type == 2) type = 'system';


        Modal.open(<DialogModal title='Please confirm before submiting your bets.' options={{
            buttons: {
                confirm: {
                    title: 'Submit',
                    callback: submit
                }
            }
        }}>
            <span>{lang('Total amount of %1 will be placed on %2 %3 coupons.', [currency(slip.stake.toFixed(2), player?.currency), slip.coupons, type])}</span>
        </DialogModal >);
    };


    const betSystem = (type, amount) => {
        setFocusInput(`${type}____mbetinput`);
        clearTimeout(setSystemTimeOut);
        setSystemTimeOut = setTimeout(() => {
            if (!amount) setFocusInput(null);
            dispatch({ type: props.updateBetAmount, payload: { type: type, amount: amount } });
        }, 200);
    };

    const betSingle = (type, amount) => {
        clearTimeout(setSystemTimeOut);
        setSystemTimeOut = setTimeout(() => {
            if (!amount) setFocusInput(null);
            try {
                document.getElementById(`${type}____mbetinput`).value = amount;
                document.getElementById(`${type}____mbetinput_single`).value = amount;
            } catch (err) {
                //
            }
            dispatch({ type: props.updateBetAmount, payload: { type: type, amount: amount } });
        }, 200);
    };

    const createInput = (id, handler, multiBet = true, clearEnabled = true) => {
        if (!handler) handler = multiBet ? betSystem : betSingle;
        handler = handler.bind(this);
        const inputId = multiBet ? `${id}____mbetinput` : `${id}____mbetinput_single`;
        return <React.Fragment>
            <input type='number' id={inputId}
                defaultValue={slip.multipleBetOptions[id].amount}
                onFocus={(e) => {
                    var value = parseFloat(e.target.value);
                    if (isNaN(value) || !value) {
                        e.target.value = '';
                    }
                }}
                onBlur={(e) => {
                    var value = parseFloat(e.target.value);
                    setFocusInput(null);

                    if (isNaN(value) || !value) {
                        e.target.value = 0;
                        return;
                    }
                }}
                onChange={(e) => {
                    handler(id, e.target.value);
                }} />
            {
                clearEnabled && <div className='each-way align-right flex vertical margin-right' onClick={() => dispatch({ type: props.toggleEW, payload: id })}>
                    <span className='small'>E/W</span>
                    <Icon icon={slip.multipleBetOptions[id].ew ? 'check-square' : 'square'} size='xs' type='far' className='clickable' />
                </div>
            }
            {
                clearEnabled && <Icon icon='times' size='xs' className='clickable' onClick={() => {
                    handler(id, 0);
                    document.getElementById(`${id}____mbetinput`).value = 0;
                    try {
                        document.getElementById(`${id}____mbetinput_single`).value = 0;
                    } catch (err) {
                        //
                    }
                }} />
            }
        </React.Fragment>;
    };



    const possibleWin = () => {
        var possibleWin = slip.possibleWin;
        const stake = slip.stake;
        var bonusTotal = 0;
        var bonusAmount = 0;
        var percentage = 0;
        if (slip.bonus) {
            percentage = parseFloat(slip.bonus.percentage);
            const max = slip.bonus.max ?? Number.MAX_VALUE;
            bonusAmount = ((percentage * (possibleWin - stake) / 100));
            bonusTotal = bonusAmount < max ? bonusAmount : max;
        }
        return <React.Fragment>
            {
                bonusTotal > 0 &&
                <div className='possible-win bonus'>
                    <Icon icon='star' className='xs' /><label className='primary'>{lang('Bonus %%1', [percentage])}</label>
                    <span className='primary'>{currency(bonusAmount, player?.currency)}</span>
                </div>
            }
            {
                possibleWin > 0 && <div className='possible-win flex gap-5'>
                    <label className='primary'>{lang('Possible Win')}</label>
                    <span className='primary align-right'>{currency(possibleWin, player?.currency)}</span>
                </div>
            }
        </React.Fragment>
    };


    const renderStakeOptions = () => {
        if (slip.totalSelections == 0) return;
        if (slip.totalSelections > 7) return;
        var multipleBetOptionsEnabled = slip.multipleBetOptionsEnabled;
        var type = 'singles';
        switch (slip.totalSelections) {
            case 1:
                type = 'singles';
                break;
            case 2:
                type = 'doubles';
                break;
            case 3:
                type = 'triples';
                break;
            default:
                type = `fold${slip.totalSelections}`;
                break;
        }
        multipleBetOptionsEnabled = false;
        if (slip.reccurentEvents) type = 'singles';
        return <React.Fragment>
            <div className={`card multibet-options collapsed ${multipleBetOptionsEnabled == false ? 'disabled' : ''} hidden`}>
                <CollapsingHeader title='Multi Bet Options' />
                <div className='body'>
                    {
                        multipleBetOptionsEnabled && Object.keys(slip.multipleBetOptions).map(id => {
                            var system = slip.multipleBetOptions[id];
                            if (system.enabled) {
                                return <div className='flex' key={id}>
                                    <label className='margin-right system-type primary'>{lang(SystemNames[id])}</label><span>{`${system.bets} tickets`}</span>
                                    {createInput(id)}
                                </div>;
                            }
                        })
                    }
                </div>
            </div>
            {
                <div className='multibet-options combinations' key={type}>
                    <div className='body padding'>
                        <div className='flex'>
                            <label className='margin-right system-type primary'>{lang(SystemNames[type])}</label>
                            {createInput(type, null, false, false)}
                        </div>
                    </div>
                </div>
            }

        </React.Fragment>;
    };

    const renderSummary = () => {
        if (reducer.lastSlip && slip.totalSelections == 0) {
            return <div className='padding flex vertical gap-10 fit-width'>
                <div className='flex border radius surface padding'><Icon icon='info-circle' className='success' /><span className='success'>{lang('Bet slip submited.')}</span></div>
                {reducer.lastSlip.code && <p className='padding text-center'>{lang('Your ticket code %1.', [reducer.lastSlip.code])}</p>}
                <Button className='center confirm' title='Restore last bets' onClick={() => dispatch({ type: props.restoreSlip, payload: Object.assign(reducer.lastSlip) })} />
            </div>;
        }
        if (slip.totalSelections == 0) return <p className='padding'>{lang('Bet slip is empty.')}</p>;
        var hasLockedSelections = Object.values(slip.selections).filter(x => x.locked && x.selected).length > 0;
        var submitButtonClass = (hasLockedSelections || !slip.stake) ? 'disabled' : '';

        return <div className='summary'>
            <div className='stake flex gap-5'>
                <label>{lang('Total Stake:')}</label>
                <span className='align-right'>$ {currency(slip.stake, player?.currency)}</span>
            </div>
            {possibleWin()}
            <div className='flex vertical margin-top gap-10'>
                <div className='flex stretch margin-top gap-10'>
                    <Button title='Cancel' onClick={() => dispatch({ type: props.clearBets, payload: null })} />
                    <Button title='Submit' className={submitButtonClass} onClick={() => confirmSubmit()} />
                </div>
            </div>
        </div>;
    };



    const renderSlip = () => {
        return <React.Fragment>
            <ul>
                {
                    Object.values(slip.selections).map((bet, index) => {
                        console.log(bet);
                        return <li key={index}>
                            <div className='flex gap-5'>
                                <span className='bet-slip-span'>{bet.event.time} - {bet.event.venue}</span>
                            </div>
                            {
                                bet.event && <div>
                                    <div className='bet-forecast-div'>forecast</div>
                                    <div className='bet-sequence-div'>#3 #6 @ 25.69</div>
                                    <div className='bet-counter'>
                                        <span className='bet-counter-icon bet-counter-minus'>-</span>
                                        <input type="text" value={`$ ${1000}`} />
                                        <span className='bet-counter-icon bet-counter-plus'>+</span>
                                    </div>
                                </div>
                            }
                            {/* {
                                bet.single && <div className='flex gap-10'>
                                    <div className='flex gap-5'>
                                        <span>{bet.runner.position}</span>
                                        <span>{lang('%1 to win', [bet.runner.name])}</span>
                                    </div>
                                    <div className='align-right price'><span>{bet.price}</span></div>
                                </div>
                            } */}
                            {/* {
                                !bet.single && !bet.combination &&
                                <React.Fragment>
                                    <div>{bet.forecast ? 'Forecast' : 'Tricast'}</div>
                                    <ul className='selection'>
                                        <li className='flex vertical fit-width combination'>{bet.selections.map((x, index) => <div key={index} className='flex gap-5'><label>{ordinalNumbers[index + 1]}</label><span>{x.name}</span></div>)}</li>
                                    </ul>
                                </React.Fragment>
                            }
                            {
                                bet.combination && <React.Fragment>
                                    <ul className='selection'>
                                        <li className='flex vertical fit-width'>
                                            <div className='flex gap-5 combination'><label>{ordinalNumbers[1]}</label><span>{selections.join(',')}</span></div>
                                            <div className='flex gap-5 combination'><label>{ordinalNumbers[2]}</label><span>{selections.join(',')}</span></div>
                                            {bet.tricast && <div className='flex gap-5 combination'><label>{ordinalNumbers[3]}</label><span>{selections.join(',')}</span></div>}
                                        </li>
                                    </ul>
                                </React.Fragment>
                            } */}
                            {
                                bet && <div>
                                    <div className='bet-return-div'>
                                        <span className='bet-return-title'>to return: </span>
                                        $ 256,90</div>
                                </div>
                            }
                        </li>;
                    })
                }
            </ul>
            {/* {renderStakeOptions()} */}
            {renderSummary()}
        </React.Fragment>;
    };

    const renderContent = () => {
        switch (tab) {
            case SlipTabs.Slip:
                return renderSlip();
            case SlipTabs.Bets:
                return <div></div>;
        }
    };

    return <div className='card slip'>
        <header>
            <nav>
                <a className={tab == SlipTabs.Slip ? 'active' : ''} onClick={() => setActiveTab(SlipTabs.Slip)}><span>{lang('Bet Slip')}</span>{slip.totalSelections > 0 && <span className='counter'><i>{slip.totalSelections}</i></span>}</a>
                <a className={tab == SlipTabs.Bets ? 'active' : ''} onClick={() => setActiveTab(SlipTabs.Bets)}><span>{lang('Open Bets')}</span></a>
            </nav>
        </header>
        <div className='body'>
            {renderContent()}
        </div>
    </div>;
};

BetSlip.propTypes = {
    reducer: PropTypes.string,
    clearBets: PropTypes.string,
    updateBetAmount: PropTypes.string,
    toggleEW: PropTypes.string,
    restoreSlip: PropTypes.string
};