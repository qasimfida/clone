const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toCamelCase = (obj) => {
    var result = {};
    Object.keys(obj).map(property => {
        result[capitalize(property)] = obj[property];
    });
    return result;
};