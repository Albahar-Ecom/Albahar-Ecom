import React from 'react';
import Identify from 'src/simi/Helper/Identify'
import { Redirect } from '@magento/venia-drivers';
import TitleHelper from 'src/simi/Helper/TitleHelper';

import classify from 'src/classify';
import defaultClasses from './search.css';
import PRODUCT_SEARCH from 'src/simi/queries/catalog/productSearch';
import Products from 'src/simi/App/FashionTheme/BaseComponents/Products';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import BreadCrumb from "src/simi/App/FashionTheme/BaseComponents/BreadCrumb";
import Skeleton from 'react-loading-skeleton';
import NoProductsFound from '../Category/NoProductsFound/noProductsFound';
import { useSearchContent, /* useSearchContentPagination */ } from 'src/simi/talons/Search/useSearchContent';

const Search = props => {
    const { classes, location, history } = props;

    const loadStyle = 1; // 1: button load-more (useSearchContent), 2: pagination (useCategoryContentPagination)
    const DESKTOP_ITEMS_PER_PAGE = 10;
    const PHONE_ITEMS_PER_PAGE = 9;

    const talonProps = useSearchContent({
        location,
        productsPageDesktop: DESKTOP_ITEMS_PER_PAGE,
        productsPagePhone: PHONE_ITEMS_PER_PAGE,
        queries: {
            getProductSearch: PRODUCT_SEARCH
        }
    });

    const { products, error, loading
        , pageSize, sortByData, appliedFilter, cateEmpty,
        pageControl, inputText } = talonProps;

    if (!inputText) {
        <Redirect to="/" />;
    }

    if (error) return <div>{Identify.__('Data Fetch Error')}</div>;

    if (!products || !products.simiproducts)
        return (
            <div className="container simi-fadein">
                <article className="products-gallery-root">
                    <Skeleton width="100%" height={50} />
                    <div className="product-list-container-siminia">
                        <div key="siminia-left-navigation-filter"
                            className="left-navigation" ><Skeleton height={600} /></div>
                        <div className="listing-product">
                            <div className={`result-title`}><Skeleton count={3} /></div>
                            <section className="gallery">
                                <div className="gallery-root">
                                    <div className="gallery-items">
                                        <div role="presentation" className="siminia-product-grid-item"><Skeleton height={250} /></div>
                                        <div role="presentation" className="siminia-product-grid-item"><Skeleton height={250} /></div>
                                        <div role="presentation" className="siminia-product-grid-item"><Skeleton height={250} /></div>
                                        <div role="presentation" className="siminia-product-grid-item"><Skeleton height={250} /></div>
                                        <div role="presentation" className="siminia-product-grid-item"><Skeleton height={250} /></div>
                                        <div role="presentation" className="siminia-product-grid-item"><Skeleton height={250} /></div>
                                    </div>
                                </div>
                            </section>
                            <div className="product-grid-pagination">
                                <Skeleton />
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        );

    const breadcrumb = [{ name: Identify.__("Home"), link: '/' }, { name: Identify.__("Search") }, { name: Identify.__("Search results for: '" + inputText + "'"), link: '/search.html?query=' + inputText }];
    const title = Identify.__(`Search results for: '%s'`).replace('%s', inputText);

    return <div className={`${classes.root} container simi-fadein`}>
        {TitleHelper.renderMetaHeader({ title })}
        <BreadCrumb breadcrumb={breadcrumb} history={history} />
        {pageControl.totalPages > 0 ? <Products
            type={'category'}
            title={title}
            underHeader={''}
            history={history}
            pageSize={pageSize}
            data={products}
            sortByData={sortByData}
            filterData={appliedFilter}
            loading={loading}
            loadStyle={loadStyle}
            pageControl={pageControl}
        /> : <NoProductsFound /> }
    </div>
}

export default compose(withRouter, classify(defaultClasses))(Search);
