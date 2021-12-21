const formats = {
    USD: { symbol: '$', format: '0,0[.]00' },
    CAD: { symbol: 'C$', format: '0,0[.]00' },
    GBP: { symbol: '£', format: '0,0[.]00' },
    EUR: { symbol: '€', format: '0,0[.]00' },
    CHF: { symbol: 'Fr.', format: '0,0[.]00' },
    SEK: { symbol: 'kr', format: '0,0[.]00' },
    JPY: { symbol: '¥', format: '0,0[.]00' },
    CNY: { symbol: '¥', format: '0,0[.]00' },
    INR: { symbol: '₹', format: '0,0[.]00' },
    RUB: { symbol: '₽', format: '0,0[.]00' },
    AUD: { symbol: 'A$', format: '0,0[.]00' },
    IQD: { symbol: 'IQD', format: '0,0[.]00' },
    HKD: { symbol: 'HK$', format: '0,0[.]00' },
    SGD: { symbol: 'S$', format: '0,0[.]00' },
    TWD: { symbol: 'NT$', format: '0,0[.]00' },
    BRL: { symbol: 'R$', format: '0,0[.]00' },
    KRW: { symbol: '₩', format: '0,0[.]00' },
    ZAR: { symbol: 'R', format: '0,0[.]00' },
    MYR: { symbol: 'RM', format: '0,0[.]00' },
    IDR: { symbol: 'Rp', format: '0,0[.]00' },
    NZD: { symbol: 'NZ$', format: '0,0[.]00' },
    MXN: { symbol: 'MX$', format: '0,0[.]00' },
    PHP: { symbol: '₱', format: '0,0[.]00' },
    DKK: { symbol: 'kr.', format: '0,0[.]00' },
    PLN: { symbol: 'zł', format: '0,0[.]00' },
    AED: { symbol: 'DH', format: '0,0[.]00' },
    ARS: { symbol: '$', format: '0,0[.]00' },
    CLP: { symbol: 'CLP', format: '0,0[.]00' },
    CZK: { symbol: 'Kč', format: '0,0[.]00' },
    HUF: { symbol: 'Ft', format: '0,0[.]00' },
    ILS: { symbol: '₪', format: '0,0[.]00' },
    KWD: { symbol: 'KD', format: '0,0[.]00' },
    LKR: { symbol: 'Rs', format: '0,0[.]00' },
    NOK: { symbol: 'kr', format: '0,0[.]00' },
    PKR: { symbol: '₨', format: '0,0[.]00' },
    SAR: { symbol: 'SR', format: '0,0[.]00' },
    THB: { symbol: '฿', format: '0,0[.]00' },
    TRY: { symbol: '₺', format: '0.0[,]00' },
    UAH: { symbol: '₴', format: '0.0[,]00' },

    BTC: { symbol: '₿', format: '0.00000000', crypto: true },
    LTC: { symbol: 'LTC', format: '0.00000000', crypto: true },
    ETH: { symbol: 'Ξ', format: '0,00000000', crypto: true },
    TTC: { symbol: '₺', format: '0.0[,]00', crypto: true },
    XAU: { symbol: 'XAU', format: '0,00000000', crypto: true },
    XAG: { symbol: 'XAG', format: '0,00000000', crypto: true },
    XDR: { symbol: 'XDR', format: '0,00000000', crypto: true },
    GOLD: { symbol: 'G', format: '0,0[.]00' },
};


export const currency = (amount, currency, places = 2) => {
    try {
        if (amount === undefined || amount === null) amount = 0;
        if (!currency) return amount.toFixed(places);
        if (!formats[currency]) return amount.toFixed(places) + ' ' + currency;
        var format = formats[currency].format;
        var symbol = formats[currency].symbol;
        amount = parseFloat(amount);

        if (isNaN(amount) || amount == undefined) return '';
        return `${window.numeral(amount.toFixed(places)).format(format)} ${symbol}`;
    } catch (err) {
        if (amount) return amount.toString();
        return '';
    }
};
