export const replaceSpace = (name) => {
    if (!name) return name;
    name = name.replace(/ /g, '-');
    name = name.toLowerCase();
    return name;
};
