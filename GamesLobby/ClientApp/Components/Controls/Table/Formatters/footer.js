import React from 'react';
import { currency } from '../../../../Lib/Common/currency';


export const RenderFooterWithCurrencyData = (data) => {
    return Object.keys(data).map(currencyCode => {
        var amount = data[currencyCode];
        return <div key={currencyCode}>{currency(amount,currencyCode)}</div>;
    });
};