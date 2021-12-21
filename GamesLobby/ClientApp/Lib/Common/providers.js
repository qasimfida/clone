// returns if provider.type has flags
export const ProviderHasType = (provider, type) => {
    try {
        return (type & provider.type);
    } catch (err) {
        //
    }
    return false;
};