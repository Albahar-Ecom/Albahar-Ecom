import React, { Component } from 'react';
import { bool } from 'prop-types';

import Footer from 'src/simi/App/FashionTheme/Footer';
import Header from 'src/simi/App/FashionTheme/Header'
import Identify from 'src/simi/Helper/Identify'
import { saveCategoriesToDict } from 'src/simi/Helper/Url'
import Connection from 'src/simi/Network/SimiConnection'
import LoadingComponent from 'src/simi/BaseComponents/Loading'
import * as Constants from 'src/simi/Config/Constants';
import simiStoreConfigDataQuery from 'src/simi/queries/getStoreConfigData.graphql'
import { Simiquery } from 'src/simi/Network/Query'

class Main extends Component {
    componentDidMount() {
        const dbConfig = Identify.getAppDashboardConfigs()
        if (!dbConfig) {
            Connection.connectSimiCartServer('GET', true, this);
        }
    }

    static propTypes = {
        isMasked: bool
    };

    mainContent(storeConfig = null) {
        if (storeConfig && this.props.setStoreConfig)
            this.props.setStoreConfig(storeConfig)
        return (
            <React.Fragment>
                <Header storeConfig={storeConfig} />
                <div id="data-breadcrumb" />
                {storeConfig ? <div className="siminia-main-page" id="siminia-main-page">{this.props.children}</div> : <LoadingComponent />}
                {storeConfig ? <Footer /> : ''}
            </React.Fragment>
        )
    }
    render() {
        return (
            <main className="main-root">
                <div className="app-loading" style={{ display: 'none' }} id="app-loading">
                    <LoadingComponent />
                </div>
                { Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, Constants.STORE_CONFIG) ?
                    this.mainContent(Identify.getDataFromStoreage(Identify.SESSION_STOREAGE, Constants.STORE_CONFIG)) :
                    <Simiquery query={simiStoreConfigDataQuery}>
                        {({ data }) => {
                            if (data && data.storeConfig) {
                                Identify.saveStoreConfig(data)
                                saveCategoriesToDict(data.simiRootCate)
                                return this.mainContent(data)
                            }
                            return this.mainContent()
                        }}
                    </Simiquery>
                }
            </main>
        );
    }
}

export default Main;
