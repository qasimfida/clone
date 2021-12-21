export const lang = (key, p) => {
    const value = key;
    return p && p.length ? replaceAll(value, p) : value;
};

const replaceAll = (value, p) => {
    var result = value;
    p.map((x, index) => {
        result = result.replace(new RegExp('%' + (index + 1), 'g'), x);
    });
    return result;
};