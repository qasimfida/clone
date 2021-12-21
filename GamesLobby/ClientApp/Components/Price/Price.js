import './_price.scss';

import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

export const PriceType = {
    Single: 'Single'
};

export const Price = (props) => {
    const reducer = useSelector((state) => state[props.reducer]);
    const slip = reducer.slip;

    const dispatch = useDispatch();
    const toggleSelection = () => {
        dispatch({
            type: props.toggleSelection,
            payload: {
                id: props.id,
                single: true,
                selected: true,
                selection: {
                    id: props.id,
                },
                price: props.price,
                runner: props.runner,
                event: props.event
            }
        });
    };

    const selected = slip.selections.hasOwnProperty(props.id);

    return <div className={`price${selected ? ' selected' : ''}`} onClick={() => toggleSelection()}>
        <span>{props.price.toFixed(2)}</span>
    </div>;
};

Price.propTypes = {
    reducer: PropTypes.string,
    event: PropTypes.object,
    runner: PropTypes.object,
    toggleSelection: PropTypes.string,
    id: PropTypes.number,
    price: PropTypes.number
};