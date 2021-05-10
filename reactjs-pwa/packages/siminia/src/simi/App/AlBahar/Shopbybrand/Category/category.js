import React from 'react';
import { number } from 'prop-types';
import Identify from 'src/simi/Helper/Identify';
import { withRouter, connect } from 'src/drivers';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import BreadCrumb from 'src/simi/BaseComponents/BreadCrumb';
import Products from 'src/simi/App/AlBahar/BaseComponents/Products';
import { cateUrlSuffix, resourceUrl } from 'src/simi/Helper/Url';
import Skeleton from 'react-loading-skeleton';
import GET_CATEGORY from 'src/simi/queries/catalog/getCateProductsNoFilter';
import {
    useCategoryContentSimiPagination /* useCategoryContent */
} from '../../talons/Category/useBrandCategory';
// import CategoryHeader from './categoryHeader';
import NoProductsFound from './NoProductsFound';
import { setSimiNProgressLoading } from 'src/simi/Redux/actions/simiactions';
import {useBrandDetails} from '../talons/useBrandDetails'
import { useParams } from "react-router-dom";

const Category = props => {
    const { history, setSimiNProgressLoading } = props;

    const {simiStoreConfig} = Identify.getStoreConfig() || {}

    let categoryRootId = null
    if(simiStoreConfig && simiStoreConfig.root_category_id) {
        categoryRootId =  simiStoreConfig.root_category_id
    } 

    const { brandUrl = "" } = useParams();
    const { brandData, brandLoading, derivedErrorMessage } = useBrandDetails({ url_key: brandUrl.replace('.html', '') });

    let optionId = null;
    if(history && history.location && history.location.state &&  history.location.state.option_id) {
        optionId = history.location.state.option_id
    } 

    const loadStyle = 2; // 1: button load-more (useCategoryContent), 2: pagination (useCategoryContentSimiPagination)

    const talonProps = useCategoryContentSimiPagination({
        categoryId: categoryRootId,
        brandLoading,
        brandData,
        queries: {
            getCategory: GET_CATEGORY
        },
        parameter1: 'page',
        parameter2: 'product_list_limit',
        initialTotalPages: 1,
        defaultInitialPageSize: 12,
        defaultInitialPage: 1
    });

    const {
        products,
        error,
        loading,
        pageSize,
        sortByData,
        appliedFilter,
        cateEmpty,
        cmsData,
        pageControl,
        brandInfo
    } = talonProps;

    if (error) return <div>{Identify.__('Data Fetch Error')}</div>;

    if (!products || !brandInfo) {
        return (
            <div className="container simi-fadein">
                <article className="products-root">
                    <div className="title skeleton">
                        <Skeleton width="100%" height={30} />
                    </div>
                    <div className="items-count skeleton">
                        <Skeleton width="100%" height={22} />
                    </div>
                    <div className="product-list-container-siminia">
                        <div
                            key="siminia-left-navigation-filter"
                            className="left-navigation skeleton"
                        >
                            <Skeleton height={1218} />
                        </div>
                        <div className="listing-product">
                            <div className="top-sort-by-skeleton">
                                <Skeleton height={30} />
                            </div>
                            <section className="gallery">
                                <div className="gallery-root">
                                    <div className="gallery-items">
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-show"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-show"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-show"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-show"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-hide"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-hide"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-hide"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-hide"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                        <div
                                            role="presentation"
                                            className="siminia-product-grid-item skele-mobile-hide"
                                        >
                                            <Skeleton height={380} />
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <div className="product-grid-pagination">
                                <Skeleton height={30} />
                            </div>
                        </div>
                    </div>
                </article>
            </div>
        );
    }

    // const { category } = products;
    console.log(brandInfo)
    //breadcrumb
    const categoryTitle =
        brandInfo && brandInfo.value ? Identify.__(brandInfo.value) : '';
    let breadcrumb = [{ name: Identify.__('Home'), link: '/' }, { name: Identify.__('Brand'), link: '/brand.html' }, { name: categoryTitle }];
    // if (props.breadcrumb) {
    //     breadcrumb = props.breadcrumb;
    // } else {
    //     // if (category && category.breadcrumbs instanceof Array) {
    //     //     let path = '';
    //     //     category.breadcrumbs.forEach(item => {
    //     //         path += '/' + item.category_url_key;
    //     //         breadcrumb.push({
    //     //             name: Identify.__(item.category_name),
    //     //             link: path + cateUrlSuffix()
    //     //         });
    //     //     });
    //     // }
    //     breadcrumb.push({ name: categoryTitle });
    // }
    const isApplyingFilter = window.location.search ? true : false;

    setSimiNProgressLoading(false);

    return (
        <div className="container">
            <BreadCrumb breadcrumb={breadcrumb} history={history} />
            {TitleHelper.renderMetaHeader({
                title: brandInfo.meta_title
                    ? brandInfo.meta_title
                    : categoryTitle,
                desc: brandInfo.meta_description
                    ? brandInfo.meta_description
                    : null
            })}
            {/* {category && category.name && category.image && (
                <CategoryHeader
                    name={category.name}
                    image_url={resourceUrl(category.image, {
                        type: 'image-category'
                    })}
                />
            )} */}
            {pageControl.totalPages === 0 && !isApplyingFilter ? (<NoProductsFound />) :<Products
                type={'brand'}
                title={categoryTitle}
                history={history}
                pageSize={pageSize}
                data={products}
                sortByData={sortByData}
                filterData={appliedFilter}
                loading={loading}
                cmsData={cmsData}
                loadStyle={loadStyle}
                pageControl={pageControl}
            />}
        </div>
    );
};

Category.propTypes = {
    id: number,
    pageSize: number
};

Category.defaultProps = {
    id: 3,
    pageSize: 12
};

const mapDispatchToProps = {
    setSimiNProgressLoading
};

export default connect(null, mapDispatchToProps)(withRouter(Category));
