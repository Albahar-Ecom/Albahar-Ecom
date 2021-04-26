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