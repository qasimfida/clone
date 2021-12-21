import './_runners.scss';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { lang } from '../../Lib/Common/language';
import { Table } from '../Controls/Table/Table';
import { RoachSilk } from '../Roaches/RoachSilk';

import { Icon } from '../Icon/Icon';
import { ordinalNumbers } from '../../Lib/Common/numberHelpers';
import { Button } from '../Controls/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Price } from '../Price/Price';

const MarketType = {
    Single: 'Single',
    Forecast: 'Forecast',
    Tricast: 'Tricast'
};


const renderprices = (row, field, context) => {
    switch (context.selectionType) {
        // forecast
        case MarketType.Forecast:
            var forecast = [1, 2, 'ANY'];
            return <div className='forecast'>
                {
                    forecast.map(x => {
                        var selected = false;
                        var selection = context.forecastBets().find(r => r.id == row.id);
                        if (selection && selection.selection == x) selected = true;
                        return <div className={selected ? 'selected' : ''} key={x} onClick={() => context.select(row, x)}><Icon icon='check' /></div>;
                    })
                }
            </div>;
        case MarketType.Tricast:
            var tricast = [1, 2, 3, 'ANY'];

            return <div className='forecast'>
                {
                    tricast.map(x => {
                        var selected = false;
                        var selection = context.tricastBets().find(r => r.id == row.id);
                        if (selection && selection.selection == x) selected = true;
                        return <div className={selected ? 'selected' : ''} key={x} onClick={() => context.select(row, x)}><Icon icon='check' /></div>;
                    })
                }
            </div>;
        default:
            return <Price price={row.price} id={row.id} {...context.props} event={context.event} runner={{ id: row.id, name: row.competitor, position: row.position }} />;
    }
};


const runnersModel = {
    fields: [
        {
            name: 'position',
            title: 'position',
            // eslint-disable-next-line react/display-name
            renderRow: (row) => {
                return <div className='circular'><span>{row.position}</span></div>;
            }
        },
        {
            name: 'competitor',
            title: '',
            // eslint-disable-next-line react/display-name
            renderRow: (row) => {
                return <div className='flex gap-5'><RoachSilk skin={row.skin} /><span className='light'>{row.competitor}</span></div>;
            }
        },
        {
            name: 'prices',
            title: '',
            // eslint-disable-next-line react/display-name
            renderHead: (context) => {
                switch (context.selectionType) {
                    // forecast
                    case MarketType.Forecast:
                        return <div className='forecast'>
                            <div>1st</div>
                            <div>2nd</div>
                            <div>ANY</div>
                        </div>;
                    case MarketType.Tricast:
                        return <div className='forecast'>
                            <div>1st</div>
                            <div>2nd</div>
                            <div>3nd</div>
                            <div>ANY</div>
                        </div>;
                    default:
                        return;
                }
            },
            // eslint-disable-next-line react/display-name
            renderRow: renderprices
        }
    ]
};

const tempData = [
    {
        id: 1,
        position: 1,
        skin: 7,
        country: 1,
        competitor: 'Hanna 35',
        price: 3.5
    },
    {
        id: 2,
        position: 2,
        skin: 3,
        country: 1,
        competitor: 'John',
        price: 1.7
    },
    {
        id: 3,
        position: 3,
        skin: 2,
        country: 1,
        competitor: 'Dragon',
        price: 2.1
    },
    {
        id: 4,
        position: 4,
        skin: 4,
        country: 1,
        competitor: 'Tutti',
        price: 4.3
    },
    {
        id: 5,
        position: 5,
        skin: 1,
        country: 1,
        competitor: 'VladTheCool',
        price: 11.5
    },
    {
        id: 6,
        position: 6,
        skin: 5,
        country: 1,
        competitor: 'GaraFatma',
        price: 2.9
    }

];

export const Runners = (props) => {
    const reducer = useSelector((state) => state[props.reducer]);
    const slip = reducer.slip;

    const [selectedMarket, setSelectedMarket] = useState(MarketType.Single);
    const [forecastBets, setForecastBets] = useState([]);
    const [tricastBets, setTricastBets] = useState([]);
    const dispatch = useDispatch();


    const event = {
        id: 1,
        venue: 'Old Warehouse',
        time: '13:27'
    };

    useEffect(() => { 
        if (!selectedMarket) return;
        if (selectedMarket==MarketType.Forecast) setTricastBets([]);
        if (selectedMarket==MarketType.Tricast) setForecastBets([]);
    }, [selectedMarket]);



    const addtoBetSlip = () => {
        var target = selectedMarket == MarketType.Single ? forecastBets : tricastBets;
        const combination = target.filter(x => x.selection == 'ANY').length > 0;
        var selections = [];
        target.map(x => { selections.push(x.number); });
        const id = `${event.id}_${selectedMarket}${combination ? '_c' : ''}${selections.join('_')}`;

        const payload = {
            id: id,
            event: {
                date: event.date,
                distanceText: event.distanceText,
                eventKey: event.eventKey,
                raceType: event.raceType,
                countryCode: event.countryCode,
                venue: event.venue,
                name: event.venue,
                time: event.time,
                day: event.day,
                eventDateTimeUtc: event.eventDateTimeUtc
            },
            selections: target,
            startingPrice: false,
            single: false,
            forecast: selectedMarket == MarketType.Forecast,
            tricast: selectedMarket == MarketType.Tricast,
            combination: combination,
            selected: true,
            amount: 0
        };

        dispatch({ type: props.toggleSelection, payload: payload });
        setForecastBets([]);
        setTricastBets([]);
    };


    const renderAddToBetSlip = () => {
        const type = selectedMarket == MarketType.Forecast ? 'Forecast' : 'Tricast';
        var target = selectedMarket == MarketType.Forecast ? forecastBets : tricastBets;
        const combination = target.filter(x => x.selection == 'ANY').length > 0;
        var selections = [];
        target.map(x => { selections.push(x.number); });
        const id = `${event.id}_${selectedMarket}${combination ? '_c' : ''}${selections.join('_')}`;


        var alreadyAdded = false;
        if (slip.selections.hasOwnProperty(id)) alreadyAdded = true;


        return <div className='padding surface med flex gap-10'>
            <div className='flex vertical padding gap-5'>
                <span>{lang('%1 selections', [type])}</span>
                {
                    !combination &&
                    <ul className='flex gap-5'>
                        {
                            target.map((x, index) => {
                                return <li key={index}><label>{ordinalNumbers[index + 1]}</label><span>{x.number}</span></li>;
                            })
                        }
                    </ul>
                }
                {
                    combination && forecastBets.length >= 2 &&
                    <ul className='flex gap-5'>
                        <li><label>{ordinalNumbers[1]}:</label><span>{selections.join(',')}</span></li>
                        <li><label>{ordinalNumbers[2]}:</label><span>{selections.join(',')}</span></li>
                    </ul>
                }
                {
                    combination && tricastBets.length >= 3 &&
                    <ul className='flex gap-5'>
                        <li><label>{ordinalNumbers[1]}:</label><span>{selections.join(',')}</span></li>
                        <li><label>{ordinalNumbers[2]}:</label><span>{selections.join(',')}</span></li>
                        <li><label>{ordinalNumbers[3]}:</label><span>{selections.join(',')}</span></li>
                    </ul>
                }
            </div>
            {!alreadyAdded && <Button title='Add to betslip' className='confirm' onClick={() => addtoBetSlip()} />}
            {alreadyAdded && <Button title='Already added' className='disabled' />}
            <Button title='Clear' onClick={() => {
                setForecastBets([]);
                setTricastBets([]);
            }} />
        </div>;
    };

    const context = {
        key: 0,
        event: event,
        props: props,
        selectionType: selectedMarket,
        forecastBets: () => forecastBets,
        tricastBets: () => tricastBets,
        select: (runner, selection) => {
            try {
                var target = selectedMarket == MarketType.Forecast ? Object.assign([], forecastBets) : Object.assign([], tricastBets);
                var found = target.find(x => x.id == runner.id);
                if (found) {
                    target = target.filter(x => x.id !== runner.id);
                }

                // runner deselected but added with new selection
                if (!found || found.selection !== selection) {
                    // remove previously selected same selection if its not ANY
                    if (selection !== 'ANY') {
                        target = target.filter(x => x.selection != selection);
                        target = target.filter(x => x.selection != 'ANY');
                    }

                    if (!target.find(x => x.selection == 'ANY') && selection == 'ANY') {
                        target = target.filter(x => x.selection !== 'ANY');
                    }

                    if (selection == 'ANY') {
                        target = target.filter(x => x.selection == 'ANY');
                    }


                    if (selectedMarket == MarketType.Forecast && target.filter(x => x.selection == 'ANY').length == 0) {
                        if (target.length == 2) {
                            target = [];
                        }
                    }

                    if (selectedMarket == MarketType.Tricast && target.filter(x => x.selection == 'ANY').length == 0) {
                        if (target.length == 3) {
                            target = [];
                        }
                    }

                    target.push({
                        id: runner.id,
                        number: runner.number,
                        name: runner.name,
                        selection: selection
                    });
                }

                if (selectedMarket == MarketType.Forecast) {
                    setForecastBets(target);
                } else {
                    setTricastBets(target);
                }
            } catch (err) {
                console.log(err);
            }
        }
    };

    return <div className='card runners'>
        <header>
            <nav>
                <a className={selectedMarket == MarketType.Single ? 'active' : ''} onClick={() => setSelectedMarket(MarketType.Single)}><span>{lang('To Win')}</span></a>
                <a className={selectedMarket == MarketType.Forecast ? 'active' : ''} onClick={() => setSelectedMarket(MarketType.Forecast)}><span>{lang('Forecast')}</span></a>
                <a className={selectedMarket == MarketType.Tricast ? 'active' : ''} onClick={() => setSelectedMarket(MarketType.Tricast)}><span>{lang('Tricast')}</span></a>
            </nav>
        </header>
        <div className='body'>
            <Table model={runnersModel} data={tempData} context={context} />
            {(selectedMarket == forecastBets.length >= 2 || tricastBets >= 3) && renderAddToBetSlip()}
        </div>
    </div>;
};


Runners.propTypes = {
    reducer: PropTypes.string,
    toggleSelection: PropTypes.string
};