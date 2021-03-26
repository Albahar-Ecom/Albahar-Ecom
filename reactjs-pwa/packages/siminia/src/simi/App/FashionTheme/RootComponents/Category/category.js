import React from 'react';
import { number } from 'prop-types';
import Identify from 'src/simi/Helper/Identify';
import { withRouter } from 'src/drivers';
import TitleHelper from 'src/simi/Helper/TitleHelper';
import BreadCrumb from "src/simi/App/FashionTheme/BaseComponents/BreadCrumb";
import Products from 'src/simi/App/FashionTheme/BaseComponents/Products';
import { cateUrlSuffix } from 'src/simi/Helper/Url';
import Skeleton from 'react-loading-skeleton';
import NoProductsFound from './NoProductsFound';
import ChildCats from './childCats';
import GET_CATEGORY from 'src/simi/queries/catalog/getCategory';
import { useCategoryContent/* , useCategoryContentPagination */ } from 'src/simi/talons/Category/useCategoryContent';

const Category = props => {
    const { id, history } = props;

    const loadStyle = 1; // 1: button load-more (useCategoryContent), 2: pagination (useCategoryContentPagination)
    const DESKTOP_ITEMS_PER_PAGE = 12;
    const PHONE_ITEMS_PER_PAGE = 12;

    const talonProps = useCategoryContent({
        categoryId: id,
        productsPageDesktop: DESKTOP_ITEMS_PER_PAGE,
        productsPagePhone: PHONE_ITEMS_PER_PAGE,
        queries: {
            getCategory: GET_CATEGORY
        }
    });

    const { products, error, loading
        , pageSize, sortByData, appliedFilter, cateEmpty, cmsData,
         pageControl } = talonProps;

    if (error) return <div>{Identify.__('Data Fetch Error')}</div>;

    if (!products || !products.category)
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

    const { category } = products;

    //breadcrumb
    const categoryTitle = (category && category.name) ? Identify.__(category.name) : '';
    let breadcrumb = [{ name: Identify.__("Home"), link: '/' }];
    if (props.breadcrumb) {
        breadcrumb = props.breadcrumb;
    } else {
        if (category && category.breadcrumbs instanceof Array) {
            let path = '';
            category.breadcrumbs.forEach(item => {
                path += ('/' + item.category_url_key);
                breadcrumb.push({ name: Identify.__(item.category_name), link: path + cateUrlSuffix() });
            })
        }
        breadcrumb.push({ name: Identify.__(category.name) })
    };

    return (
        <div className="container simi-fadein">
            <BreadCrumb breadcrumb={breadcrumb} history={history} />
            {TitleHelper.renderMetaHeader({
                title: category.meta_title ? Identify.__(category.meta_title) : Identify.__(category.name),
                desc: category.meta_description ? Identify.__(category.meta_description) : null
            })}
            {pageControl.totalPages !== 0 || (cmsData && cmsData.hasOwnProperty('display_mode') && cmsData.display_mode === 'PAGE') ? <Products
                type={'category'}
                title={categoryTitle}
                underHeader={<ChildCats category={category} cateEmpty={cateEmpty} />}
                history={history}
                pageSize={pageSize}
                data={products}
                sortByData={sortByData}
                filterData={appliedFilter}
                loading={loading}
                cmsData={cmsData}
                loadStyle={loadStyle}
                pageControl={pageControl}
            /> : <NoProductsFound categoryId={id} />}
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

export default (withRouter)(Category);
