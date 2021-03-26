import React, { useState } from 'react';
import Loading from 'src/simi/BaseComponents/Loading';
import Identify from 'src/simi/Helper/Identify';
import { analyticImpressionsGTM } from 'src/simi/Helper/Analytics';
import { connect, Link } from 'src/drivers';
import { productUrlSuffix } from 'src/simi/Helper/Url';
import { showToastSuccess } from 'src/simi/Helper/MessageSuccess';
import { smoothScrollToView } from 'src/simi/Helper/Behavior';
import Sortby from './Sortby';
import Filter from './Filter';
import LoadMore from './loadMore';
import Gallery from './Gallery';
import Modal from 'react-responsive-modal';
import CompareProduct from '../CompareProducts/index';
import CategoryCms from './CategoryCms';
import Wishlist from './WishList';
import { useWindowSize } from '@magento/peregrine';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
require('./products.scss');

const $ = window.$;

const Products = (props) => {
    const { data, filterData, isSignedIn, history,
        title, cmsData, underHeader, type, loading, loadStyle,
        sortByData, pageType, pageSize, pageControl } = props;
    const windowSize = useWindowSize();
    const isPhone = windowSize.innerWidth < 1024;

    const compareLocal = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'compare_product') || null;
    const [compare, setCompare] = useState(compareLocal);
    const [openCompareModal, setOpenCompareModal] = useState(false);
    const [openMobileModal, setOpenMobileModal] = useState(false);

    const { products } = data;
    const { total_count } = products;

    const renderFilter = () => {
        const { products } = data;
        const { minPrice, maxPrice } = products;
        if (products && products.filters)
            return (
                <div>
                    <span className="shopping-option">{Identify.__('SHOPPING OPTION')}</span>
                    <Filter data={products.filters} filterData={filterData} minPrice={minPrice} maxPrice={maxPrice} total_count={total_count ? total_count : 0} />
                </div>
            );
    }

    const removeAllCompareData = () => {
        if (compareLocal) {
            localStorage.removeItem('compare_product');
            showToastSuccess(Identify.__('Remove all item in compare list successfully !'));
            setCompare(null);
        }
    }

    const updateCompareList = () => {
        setCompare(Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'compare_product'));
    }

    const removeItem = (itemId) => {
        if (itemId && compare && compare.length) {
            const itemToRemove = compare.findIndex(item => itemId === item.id);
            if (itemToRemove !== -1) {
                compare.splice(itemToRemove, 1);
                Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, 'compare_product', compare);
                if (!compare.length) {
                    localStorage.removeItem('compare_product');
                }
                updateCompareList();
                showToastSuccess(Identify.__('Remove item successfully !'))
            }
        }
    }

    const renderCompare = () => {
        if (!compare)
            return <div className="no-item">{Identify.__('You have no products to compare')}</div>;

        const compareItems = compare.map((item, idx) => {
            const product_url = `/${item.url_key}${productUrlSuffix()}`;
            const location = { pathname: product_url };
            return (
                <div className="compare-item" key={idx}>
                    <div className="remove-item" role="presentation" onClick={() => removeItem(item.id)} >
                        <i className="icon-cross2" />
                    </div>
                    <Link to={location} onClick={() => smoothScrollToView($('#root'))}>
                        <div className="name-item">{Identify.__(item.name)}</div>
                    </Link>
                </div>
            );
        });

        return (
            <div className="compare-group">
                {compareItems}
                <div className="compare-action">
                    <div className="compare" role="presentation" onClick={() => setOpenCompareModal(true)}>
                        {Identify.__('Compare')}
                    </div>
                    <div className="clear-all" role="presentation" onClick={removeAllCompareData}>
                        {Identify.__('Clear all')}
                    </div>
                </div>
            </div>
        )
    }

    const renderLeftNavigation = () => {
        return <div className="left-navigation" >
            {renderFilter()}
            <div className="compare-top-title sidebar">
                <div className="title">{Identify.__('Compare Product')}</div>
            </div>
            {renderCompare()}
            {isSignedIn && <Wishlist history={history} />}
        </div>;
    }

    const renderItemCount = () => {
        const text = total_count > 1 ? Identify.__('%t products') : Identify.__('%t product');
        return (
            <div className="items-count">
                {text.replace('%t', total_count)}
            </div>
        )
    }

    const updateSetPage = (newPage) => {
        if (pageControl) {
            const { setPage, currentPage } = pageControl;
            if (newPage !== currentPage && ((newPage - 1) * pageSize < total_count)) setPage(newPage);
        }
    }

    const renderBottomFilterSort = () => {
        const { minPrice, maxPrice } = products;
        return (
            <React.Fragment>
                <Modal open={openMobileModal !== false} onClose={() => setOpenMobileModal(false)}
                    classNames={{ overlay: Identify.isRtl() ? "rtl-filter" : "", modal: "products-mobile-sort-filter-modal" }}>
                    <div className="filter-title">{openMobileModal === 'filter' ? Identify.__('Filter') : Identify.__('Sort')}</div>
                    {openMobileModal === 'filter' ? <div className="modal-mobile-filter-view">
                        <Filter data={products.filters} filterData={filterData} filterData={filterData} minPrice={minPrice} maxPrice={maxPrice} total_count={total_count ? total_count : 0} />
                    </div> : <div className="modal-mobile-sort-view" >
                            <div className="top-sort-by">
                                <Sortby parent={this} data={data} sortByData={sortByData} sortFields={data.products.sort_fields || null} />
                            </div>
                        </div>}
                </Modal>
                <div className="mobile-bottom-filter">
                    <div className="mobile-bottom-filter-subitem" role="presentation" onClick={() => setOpenMobileModal('filter')}>
                        <span className="mobile-bottom-btn icon-funnel" />
                        <div className="mobile-bottom-btn-title">{Identify.__('Filter')}</div>
                    </div>
                    <div className="mobile-bottom-filter-subitem" role="presentation" onClick={() => setOpenMobileModal('sortby')}>
                        <div className="mobile-bottom-btn-title">{Identify.__('Sort')}</div>
                        <span className="mobile-bottom-btn icon-sort-amount-asc" />
                    </div>
                </div>
            </React.Fragment>
        )
    }

    const renderList = () => {
        const items = data ? data.products.items : null;
        if (!data)
            return <Loading />;
        analyticImpressionsGTM(items, title, pageType || 'Category');

        return (
            <React.Fragment>
                {!isPhone ?
                    <div className="top-sort-by">
                        <Sortby sortByData={sortByData} sortFields={products.sort_fields || null} />
                        {renderItemCount()}
                    </div> : <div className="mobile-item-count">{renderItemCount()}</div>
                }
                <section className="gallery">
                    <CompareProduct
                        history={history}
                        isSignedIn={isSignedIn}
                        openModal={openCompareModal}
                        closeModal={() => setOpenCompareModal(false)}
                        compareData={compare}
                        updateCompare={updateCompareList}
                    />
                    <Gallery
                        items={items}
                        history={history}
                        updateCompare={updateCompareList}
                    />
                </section>
                <div className="product-grid-pagination">
                    {loadStyle === 2 ? <Pagination pageControl={pageControl} /> :
                        <LoadMore
                            updateSetPage={(e) => updateSetPage(e)}
                            itemCount={total_count}
                            items={products.items}
                            currentPage={pageControl.currentPage}
                            loading={loading}
                        />}
                </div>
            </React.Fragment>
        )
    }

    // check display category page settings
    let categoryPageShow = 1
    if (cmsData && cmsData.display_mode) {
        const displayMode = cmsData.display_mode
        if (displayMode === 'PAGE') {
            categoryPageShow = 2;
        } else if (displayMode === 'PRODUCTS_AND_PAGE') {
            categoryPageShow = 3
        } else {
            categoryPageShow = 1
        }
    }

    return (
        <article className="products-gallery-root">
            {type === "category" && <div className="top-cate-name">{title}</div>}
            {underHeader}
            {(categoryPageShow === 2 || categoryPageShow === 3) && <CategoryCms cmsData={cmsData} history={history} />}
            {(categoryPageShow === 1 || categoryPageShow === 3) && <div className="product-list-container-siminia">
                {!isPhone && renderLeftNavigation()}
                {isPhone && renderBottomFilterSort()}
                <div className="listing-product">
                    <div className={`result-title ${type === "category" ? 'cate' : ''}`}>{title}</div>
                    {renderList()}
                </div>
            </div>}
        </article>
    );
}

const mapStateToProps = ({ user }) => {
    const { isSignedIn } = user
    return {
        isSignedIn
    };
}

export default connect(mapStateToProps, null)(Products);
