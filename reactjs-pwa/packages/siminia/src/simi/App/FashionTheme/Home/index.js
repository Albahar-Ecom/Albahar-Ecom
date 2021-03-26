import React from 'react'
import Banner from '../Home/Banner';
import LoadingSpiner from 'src/simi/BaseComponents/Loading'
import { withRouter } from 'react-router-dom';
import Category from './Category';
import Icons from './Icons';
import LazyLoad from 'src/simi/BaseComponents/LazyLoad';
import { useWindowSize } from '@magento/peregrine';
import { useHome } from 'src/simi/talons/Home/useHome'
import GET_HOME_DATA from 'src/simi/queries/homeData'
import { LazyComponent } from 'src/simi/BaseComponents/LazyComponent/';

require('./home.scss');

const Products = (props) => {
    return <LazyComponent component={() => import('./Products')} {...props} />
}


const Home = props => {
    const { history } = props;
    const talonProps = useHome({ queries: { getHomeQuery: GET_HOME_DATA } })
    const { data: homeData, error, loading } = talonProps
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;
    if (!homeData || error || loading)
        return ''
    const data = {
        homebanners: homeData.simiBanner,
        homecategories: homeData.simiCategories,
        homeproductlists: homeData.simiProductlist
    }

    const getData = (name) => {
        if (data && data[name]) {
            return data
        }

        return null
    }

    const renderContent = (name) => {
        let component = null;
        let componentData = null
        switch (name) {
            case 'banner':
                componentData = getData('homebanners');
                component = <Banner data={componentData} history={history} isPhone={isPhone} />
                break;
            case 'category':
                componentData = getData('homecategories');
                component = <Category data={componentData} history={history} isPhone={isPhone} />
                break;
            case 'products':
                componentData = getData('homeproductlists');
                component = <Products data={componentData} history={history} isPhone={isPhone} />
                break;
            default:
                break
        }
        return component;
    }

    return (
        <div className="homepage-wrapper simi-fadein">
            {getData('homebanners') ? renderContent('banner') : ''}
            <div className="container">
                {getData('homecategories') ? renderContent('category') : ''}
                {getData('homeproductlists') ?
                    <React.Fragment>

                        {<Icons />}
                        <LazyLoad placeholder={<LoadingSpiner />}>
                            {renderContent('products')}
                        </LazyLoad>
                    </React.Fragment>
                    : ''
                }
            </div>
        </div >
    );
}

export default withRouter(Home);
