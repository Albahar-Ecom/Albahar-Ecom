import Identify from './Identify'

export const getAllowedCountries = () => {
    const storeConfig = Identify.getStoreConfig();
    if (storeConfig && storeConfig.countries && storeConfig.countries.length) {    
        return storeConfig.countries
    }
    return []
}