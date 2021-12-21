import { addDays, addHours } from 'date-fns';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


export const formatDateWithMonth = (date, displayDay) => {
    var monthName = months[date.getMonth()]; // 'July' (or current month)

    return `${displayDay ? `${getDay(date)}, ` : ''}${date.getUTCDate()} ${monthName},${date.getUTCFullYear()}`;
};

export const getDay = (date) => {
    return days[date.getDay()];
};

export const today = () => {
    var now = new Date();
    var offset = (now.getTimezoneOffset() / 60) * -1;
    return addHours(new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()), offset);
};

export const yesterday = () => {
    var now = new Date();
    var offset = (now.getTimezoneOffset() / 60) * -1;
    return addHours(addDays(new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()), -1), offset);
};

export const tonight = () => {
    var now = new Date();
    var offset = (now.getTimezoneOffset() / 60) * -1;
    return addHours(new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59), offset);
};


export const getDate = (date) => {
    return date.toLocaleDateString('en-GB');
};

export const getTime = (date) => {
    if (!date) return;
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};


// super bad date convert
export const convertTZ = (date, tzString) => {
    var res = date.toLocaleString('en-US', { timeZone: tzString, hour12: false });
    if (res.indexOf(' 24:') >= 0) {
        res = res.replace(' 24:', '00:');
    }
    return res;
};
