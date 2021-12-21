const version = '3.0';

const defaultLocalStorage = {
    version: version,
    sports: {
        favourites: {

        }
    },
    defaultMarketSelections: {
        prematch: {},
        live: {}
    }
};

export const setLocalStorage = (key, value) => {
    var store = '';
    try {
        store = localStorage.getItem('___app');
        if (!store || store.version != version) {
            store = defaultLocalStorage;
        } else {
            store = JSON.parse(store);
        }
        store[key] = value;
        store = JSON.stringify(store);
        localStorage.setItem('___app', store);
        return;
    } catch (err) {
        //
        console.log(err);
    }
};


export const getLocalStorage = (key) => {
    var store = '';
    try {
        store = localStorage.getItem('___app');
        if (!store) {
            store = defaultLocalStorage;
        } else {
            store = JSON.parse(store);
            if (store.version != version) {
                store = defaultLocalStorage;
            }
        }

        return key ? store[key] : store;
    } catch {
        //
    }
};

