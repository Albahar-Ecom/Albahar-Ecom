import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactHTMLParse from 'react-html-parser'
import Price from 'src/simi/App/FashionTheme/BaseComponents/Price';
import { HOPrice } from 'src/simi/Helper/Pricing'
import { prepareProduct } from 'src/simi/Helper/Product'
import { analyticClickGTM, analyticAddCartGTM } from 'src/simi/Helper/Analytics'
import LazyLoad from 'src/simi/BaseComponents/LazyLoad';
import { StaticRate } from 'src/simi/BaseComponents/Rate'
import Identify from 'src/simi/Helper/Identify'
import { productUrlSuffix, saveDataToUrl } from 'src/simi/Helper/Url';
import QuickView from 'src/simi/App/FashionTheme/BaseComponents/QuickView';
import { showToastMessage } from 'src/simi/Helper/Message';
import { showFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { connect, Link } from 'src/drivers';
import defaultClasses from './item.css'
import { mergeClasses } from 'src/classify';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import Skeleton from 'react-loading-skeleton';
import Image from 'src/simi/BaseComponents/Image';
import Basket from "src/simi/App/FashionTheme/BaseComponents/Icon/Basket";

import { useAddWishlist } from 'src/simi/talons/Wishlist/useAddWishlist';
import { useGridItem } from 'src/simi/talons/Category/useGridItem';
import { ADD_SIMPLE_MUTATION } from 'src/simi/App/core/RootComponents/Product/ProductFullDetail/productFullDetail.gql';

require('./item.scss')

const Griditem = (props) => {
    const { toggleMessages, handleLink, updateCompare, cartId } = props;
    const item = prepareProduct(props.item);

    const itemClasses = mergeClasses(defaultClasses);
    const { name, url_key, id, price, type_id, small_image, stock_status, rating_summary, review_count, price_tiers } = item;
    const product_url = `/${url_key}${productUrlSuffix()}`;
    saveDataToUrl(product_url, item);
    const location = {
        pathname: product_url,
        state: {
            product_id: id,
            item_data: item
        }
    };

    let inWishList = false;

    const {
        addWishlist
    } = useAddWishlist({ toggleMessages });

    const talonProps = useGridItem({
        cartId,
        updateCompare,
        handleLink,
        location,
        mutations: {
            addSimpleToCartMutation: ADD_SIMPLE_MUTATION
        }
    });

    const { quickView, handleQuickView, isPhone,
        handleAddCompare, handleAddCart, loading,
        derivedErrorMessage } = talonProps;

    if (loading) {
        showFogLoading();
    }

    if (derivedErrorMessage) {
        showToastMessage(derivedErrorMessage);
    }

    const addToWishlist = () => {
        addWishlist(String(item.id), '{"qty":"1"}');
    }

    const renderLabelDiscount = () => {
        let html = null;
        if (item.price && item.price.hasOwnProperty('has_special_price') && item.price.has_special_price && item.price.hasOwnProperty('discount_percent') && item.price.discount_percent) {

            const { discount_percent } = item.price;
            let saleForm = null;
            let saleTo = null;
            const currentTime = new Date();

            if (item.hasOwnProperty('special_from_date') && item.special_from_date) {
                saleForm = new Date(item.special_from_date);
            }
            if (item.hasOwnProperty('special_to_date') && item.special_to_date) {
                saleTo = new Date(item.special_to_date);
            }
            if (saleForm || saleTo || (!saleForm && !saleTo)) {
                if ((saleForm && saleTo && currentTime >= saleForm && currentTime <= saleTo) || (!saleTo && currentTime >= saleForm) || (!saleForm && currentTime <= saleTo) || (!saleForm && !saleTo)) {
                    const labelDiscount = Number(discount_percent);
                    html = <div className={`discount-label${stock_status === 'OUT_OF_STOCK' ? ' discount-label-incl-oft' : ''}${isPhone ? ' phone' : ''}`} >
                        <div className="discount-value">
                            {-labelDiscount + '%'}
                        </div>
                    </div>
                }
            }
        }
        return html;
    }

    const renderLabelOutOfStock = () => {
        let html = null;
        if (stock_status === 'OUT_OF_STOCK') {
            return (
                <div className={`${isPhone ? 'phone' : ''} outstock-label`} >
                    <div className="stock-status">{Identify.__('Out of Stock')}</div>
                </div>
            )
        }
        return html;
    }

    const renderCompareActionMobile = () => {
        return (
            <div className="action-compare-mobile" role="presentation" onClick={() => handleAddCompare(item)} >
                <span className='add-to-compare-mobile icon-sync' />
            </div>
        )
    }

    const renderUserAction = (item) => {
        return (
            <div className={`user-action user-action-${id}`}>
                {stock_status && stock_status === 'IN_STOCK' &&
                    <div className={`cartAction action cart-${id}`} role="presentation" onClick={() => handleAddCart(item)}>
                        <span className="add-to-cart-btn">
                            <Basket style={{ display: 'block', margin: 0 }} />
                        </span>
                    </div>}
                <div className={`quickViewAction action quickview-${id}`} role="presentation" onClick={() => handleQuickView(true)}>
                    <span className="quick-view-btn icon-eye" />
                </div>
                <div className={`compareAction action compare-${id}`} role="presentation" onClick={() => handleAddCompare(item)}>
                    <span className="add-to-compare-btn icon-sync" />
                </div>
            </div>
        )
    }

    const renderWishlistAction = (item) => {
        if (props.wlitems && props.wlitems.length) {
            for (let i = 0; i < props.wlitems.length; i++) {
                if (parseInt(props.wlitems[i].product_id) === item.id) {
                    inWishList = true
                    break
                }
            }
        }

        return (
            <div className="action-wishlist"
                role="presentation"
                onClick={addToWishlist}
            >
                <span className={`add-to-wishlist icon-heart ${inWishList ? 'added-item' : 'normal-item'}`}></span>
            </div>
        )
    }

    const image = (
        <div role="presentation" className="siminia-product-image">
            <div className='simi-image-container'>
                <Link to={location}>
                    <Image src={small_image} alt={name} key={Identify.randomString(3)} />
                </Link>
            </div>
            {renderLabelDiscount()}
            {renderLabelOutOfStock()}
            {isPhone && renderCompareActionMobile()}
            {renderWishlistAction(item)}
            {renderUserAction(item)}
        </div>
    );

    let tierPriceLabel = useMemo(() => {
        if (price_tiers && price_tiers.length) {
            let foundLowestPrice;
            price_tiers.map(price_tier => {
                if (price_tier.final_price && price_tier.final_price.value)
                    if (!foundLowestPrice || foundLowestPrice > price_tier.final_price.value)
                        foundLowestPrice = price_tier.final_price.value;
            })
            if (foundLowestPrice)
                return (
                    <div role="presentation" className={`tier-prices-layout ${Identify.isRtl() ? "tier-prices-layout-rtl" : ''}`} id={`tier-price-${id}`}  >
                        {Identify.__('As low as')} <HOPrice value={foundLowestPrice} />
                    </div>
                )
        }
    }, [price_tiers]);

    return (
        <div role="presentation" className="siminia-product-grid-item" onClick={() => analyticClickGTM(name, item.id, item.price)}>
            {quickView && <QuickView openModal={quickView} closeModal={() => handleQuickView(false)} product={item} />}
            <div style={{ position: 'relative' }} className="grid-item-image">
                {props.lazyImage ? (<LazyLoad placeholder={<div style={{ maxWidth: 60, maxHeight: 60 }} ><Skeleton /></div>}> {image} </LazyLoad>) : image}
            </div>
            <div className="siminia-product-des">
                <div className="product-des-info">
                    <div className="product-name">
                        <div role="presentation" className="product-name small" onClick={() => handleLink(location)}>{ReactHTMLParse(name)}</div>
                    </div>
                    <div className={itemClasses["item-review-rate"]}>
                        <StaticRate rate={rating_summary} size={15} classes={itemClasses} backgroundColor={'#B91C1C'} />
                        <div className={itemClasses["item-review-count"]}>({review_count})</div>
                    </div>
                    <div className="price-each-product">
                        <div role="presentation" className={`prices-layout ${Identify.isRtl() ? "prices-layout-rtl" : ''}`} id={`price-${id}`}
                            onClick={() => handleLink(location)}>
                            <Price prices={price} type={type_id} />
                        </div>
                        {tierPriceLabel}
                    </div>
                </div>
            </div>
        </div>
    );
}

Griditem.contextTypes = {
    item: PropTypes.object,
    handleLink: PropTypes.func,
    classes: PropTypes.object,
    lazyImage: PropTypes.bool
}

const mapStateToProps = ({ cart }) => {
    const { cartId } = cart
    return {
        cartId
    };
};

const mapDispatchToProps = {
    toggleMessages
};

export default connect(mapStateToProps, mapDispatchToProps)(Griditem);
