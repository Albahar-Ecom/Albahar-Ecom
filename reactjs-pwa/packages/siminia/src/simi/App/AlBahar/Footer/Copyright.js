import React from 'react';
import Identify from "src/simi/Helper/Identify";
import KnetImage from '../Image/knet.png'
import MasterCardImage from '../Image/visa_master.png'

const Copyright = props => {
    const { classes } = props;
    const copyright = `${new Date().getFullYear()} ${Identify.__('Simicart')}`;
    const storeConfig = Identify.getStoreConfig();
    let footer_link = null;
    let footer_title1 = null;
    let footer_title2 = null;
    if (storeConfig && storeConfig.simiStoreConfig &&
        storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.catalog &&
        storeConfig.simiStoreConfig.config.catalog.frontend &&
        storeConfig.simiStoreConfig.config.catalog.frontend.footer_link) {
        footer_link = storeConfig.simiStoreConfig.config.catalog.frontend.footer_link
    }
    if (storeConfig && storeConfig.simiStoreConfig &&
        storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.catalog &&
        storeConfig.simiStoreConfig.config.catalog.frontend &&
        storeConfig.simiStoreConfig.config.catalog.frontend.footer_link) {
        footer_title1 = storeConfig.simiStoreConfig.config.catalog.frontend.footer_title1
    }
    if (storeConfig && storeConfig.simiStoreConfig &&
        storeConfig.simiStoreConfig.config && storeConfig.simiStoreConfig.config.catalog &&
        storeConfig.simiStoreConfig.config.catalog.frontend &&
        storeConfig.simiStoreConfig.config.catalog.frontend.footer_link) {
        footer_title2 = storeConfig.simiStoreConfig.config.catalog.frontend.footer_title2
    }

    return (
        <div className={classes["app-copyright"]}>
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className={classes["mastercard_image_container"]}> 
                            <img src={MasterCardImage} alt=""/>
                            <img src={KnetImage} alt="" style={{marginLeft: 13}}/>
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div className={classes["copy-right"]}> 
                            &copy; {copyright}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Copyright;