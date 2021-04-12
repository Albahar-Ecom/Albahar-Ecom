import Identify from "src/simi/Helper/Identify";

export const getFooterConfig = () => {
    const {simiStoreConfig} = Identify.getStoreConfig() || {}

    if(simiStoreConfig && simiStoreConfig.config && simiStoreConfig.config.footer_config) {
        return simiStoreConfig.config.footer_config
    } 

    return null
}

export const getPwaContact = () => {
    const {simiStoreConfig} = Identify.getStoreConfig() || {}

    if(simiStoreConfig && simiStoreConfig.config && simiStoreConfig.config.pwacontactus) {
        return simiStoreConfig.config.pwacontactus
    } 

    return null
}