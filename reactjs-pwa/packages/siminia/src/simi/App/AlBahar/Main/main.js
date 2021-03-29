import React, { Component } from 'react';
import { bool } from 'prop-types';
import Header from 'src/simi/App/AlBahar/Header';
import Footer from '../Footer';
import Identify from 'src/simi/Helper/Identify'
import {saveCategoriesToDict} from 'src/simi/Helper/Url'
import Connection from 'src/simi/Network/SimiConnection'
import LoadingComponent  from 'src/simi/BaseComponents/Loading'
import * as Constants from 'src/simi/Config/Constants';
import simiStoreConfigDataQuery from 'src/simi/queries/getStoreConfigData.graphql'
import { Simiquery } from 'src/simi/Network/Query'
import classes from './main.css';
import ChevronCircleUp from 'src/simi/App/AlBahar/BaseComponents/Icon/ChevronCircleUp'

const $ = window.$

class Main extends Component {
    componentDidMount() {
        const dbConfig = Identify.getAppDashboardConfigs()
        if (!dbConfig) {
            Connection.connectSimiCartServer('GET', true, this);
        }
        const scrollTop = $(document).scrollTop(); 
        if(scrollTop >= 200) {
            $('#scroll-to-top').show()
        } else {
            $('#scroll-to-top').hide()
        }

        window.addEventListener('scroll', this.handleScroll);
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = (event) => {
        const scrollTop = $(document).scrollTop(); 
        if(scrollTop >= 200) {
            $('#scroll-to-top').fadeIn()
        } else {
            $('#scroll-to-top').fadeOut()
        }
    }

    static propTypes = {
        isMasked: bool
    };

    get classes() {
        const { classes } = this.props;

        return ['page', 'root'].reduce(
            (acc, val) => ({ ...acc, [val]: classes[`${val}`] }),
            {}
        );
    }

    scrollToTop = () => {
        $("html, body").animate({ scrollTop: 0 });
    }

    mainContent(storeConfig = null) {
        if (storeConfig && this.props.setStoreConfig)
            this.props.setStoreConfig(storeConfig)
        return (
            <React.Fragment>
                <Header storeConfig={storeConfig}/>
                {storeConfig ?  <div id="data-breadcrumb" className={classes.breadcrumb}/> : ''}
                {storeConfig ? <div className={classes.page} id="siminia-main-page">{this.props.children}</div> :  <LoadingComponent />}
                {storeConfig ? <Footer /> : ''}
            </React.Fragment>
        )
    }
    render() {
        return (
            <main className={classes.root}>
                <div className="app-loading" style={{display:'none'}} id="app-loading">
                    <LoadingComponent/>
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
                <div id="scroll-to-top" className={classes.scroll_to_top} onClick={this.scrollToTop}>
                    <ChevronCircleUp style={{width: 36, height: 42}}/>
                </div>
            </main>
        );
    }
}

export default Main;
