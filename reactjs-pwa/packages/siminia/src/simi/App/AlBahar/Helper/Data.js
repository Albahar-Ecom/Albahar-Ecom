import Identify from "src/simi/Helper/Identify";

export const getFooterConfig = () => {
    const {simiStoreConfig} = Identify.getStoreConfig() || {}

    if(simiStoreConfig && simiStoreConfig.config && simiStoreConfig.config.footer_config) {
        return simiStoreConfig.config.footer_config
    } 

    return null
}

export const getStore = () => {
    const {storeConfig} = Identify.getStoreConfig() || {}

    if(storeConfig) {
        return storeConfig
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

export const getSalesConfig = () => {
    const {simiStoreConfig} = Identify.getStoreConfig() || {}

    if(simiStoreConfig && simiStoreConfig.config && simiStoreConfig.config.sales) {
        return simiStoreConfig.config.sales
    } 

    return null
}

export const getBrandConfig = () => {
    const {brandConfig} = Identify.getStoreConfig() || {}
    if(brandConfig) {
        return brandConfig
    }

    return null
} 

export const getElectronicConfig = () => {
    const {simiStoreConfig} = Identify.getStoreConfig() || {}
    if(simiStoreConfig && simiStoreConfig.config && simiStoreConfig.config.electronic_config) {

        return simiStoreConfig.config.electronic_config
    }

    return null
} 

export const translateWithLocale = (text, locale = null) => {
    const appConfig = Identify.getAppDashboardConfigs();
    let config = null;
    if (appConfig !== null) {
        config = appConfig['app-configs'][0] || null;
    }

    const storeConfig = Identify.getStoreConfig();
    try {
        let languageCode = storeConfig.storeConfig.locale;
        if(locale) {
            languageCode = locale
        }
        if (config.language.hasOwnProperty(languageCode)) {
            const { language } = config;
            const languageWithCode = language[languageCode];
            if (languageWithCode.hasOwnProperty(text)) {
                return languageWithCode[text];
            } else if (languageWithCode.hasOwnProperty(text.toLowerCase())) {
                return languageWithCode[text.toLowerCase()];
            }
        }
    } catch (err) {

    }

    return text
}