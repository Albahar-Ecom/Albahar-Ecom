import React, {useState, useCallback, useMemo, useEffect} from 'react';
import defaultClasses from './item.css';
import { configColor } from 'src/simi/Config';
import PropTypes from 'prop-types';
import ReactHTMLParse from 'react-html-parser';
import { mergeClasses } from 'src/classify';
import Price from 'src/simi/App/AlBahar/BaseComponents/Price';
import { prepareProduct } from 'src/simi/Helper/Product';
import LazyLoad from 'src/simi/BaseComponents/LazyLoad';
import Image from 'src/simi/BaseComponents/Image';
import { StaticRate } from 'src/simi/BaseComponents/Rate';
import Identify from 'src/simi/Helper/Identify';
import { productUrlSuffix, saveDataToUrl, logoUrl } from 'src/simi/Helper/Url';
import Quantity from './qty'
import { useHistory } from '@magento/venia-drivers';
import {useGridItem} from 'src/simi/App/AlBahar/talons/Category/useGridItem'
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { HOPrice } from 'src/simi/Helper/Pricing'
import {
    ADD_SIMPLE_MUTATION,
} from 'src/simi/App/AlBahar/RootComponents/Product/ProductFullDetail/productFullDetail.gql';
import {analyticClickGTM, analyticAddCartGTM} from '../../Helper/Analytics'

import { connect } from 'src/drivers';
import { toggleMessages, setSimiNProgressLoading } from 'src/simi/Redux/actions/simiactions';
import connectorGetProductDetailBySku from 'src/simi/App/AlBahar/queries/catalog/getProductDetailBySku.graphql';
import { simiUseQuery as useQuery } from 'src/simi/Network/Query';
import { useUserContext } from '@magento/peregrine/lib/context/user';

require('./item.scss')

const Griditem = props => {
    const { lazyImage, toggleMessages, setSimiNProgressLoading } = props;
    const history = useHistory();
    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();
    const [clickedLocation, setClickedLocation] = useState(null);

    let quantity = 1;

    const clickedProductSku = clickedLocation && clickedLocation.sku ? clickedLocation.sku : null;
    const item = prepareProduct(props.item);
    const logo_url = logoUrl();
    const { classes } = props
    if (!item) return '';
    const itemClasses = mergeClasses(defaultClasses, classes);
    const { name, url_key, stock_status, id, price, type_id, small_image, rating_summary, review_count, price_tiers, sku } = item;
    const product_url = `/${url_key}${productUrlSuffix()}`;

    saveDataToUrl(product_url, item);

    const location = {
        pathname: product_url,
        state: {
            product_id: id,
            item_data: item
        },
        sku
    };

    const handleLink = useCallback((location) => {
        if (props.handleLink) {
            props.handleLink(location)
        } else {
            history.push(location)
        }
    })


    const {
        handleAddCart: handleAddCartTalon, 
        isPhone
    } = useGridItem({
        cartId,
        handleLink,
        analyticAddCartGTM,
        location,
        toggleMessages,
        mutations: {
            addSimpleToCartMutation: ADD_SIMPLE_MUTATION
        }
    })
 
    const handleAddCart = (itemAdd, quantity) => {
        if(stock_status === "OUT_OF_STOCK") return
        if (item.type_id === 'simple' && (!item.hasOwnProperty('options') || (item.hasOwnProperty('options') && item.options === null))) {
            handleAddCartTalon(itemAdd, quantity)
        } else {
            location.state.quantity = quantity
            setSimiNProgressLoading(true);
            setClickedLocation(location);
        }
    }

    const variables = {
        sku: clickedProductSku,
        onServer: false
    }

    if(isSignedIn) {
        variables.loginToken = Identify.randomString()
    }

    const { data: preFetchProductResult, error: preFetchProductError } = useQuery(connectorGetProductDetailBySku,
        {
            variables,
            skip: !clickedProductSku,
            fetchPolicy: "no-cache"
        }
    );

    useEffect(() => {
        if (preFetchProductResult && preFetchProductResult.productDetail
            && preFetchProductResult.productDetail.items && preFetchProductResult.productDetail.items[0]
            && item && item.url_key && clickedLocation) {
            try {
                const productDataReturned = preFetchProductResult.productDetail.items[0];
                if (productDataReturned && productDataReturned.hasOwnProperty('simiExtraField')) {
                    if (productDataReturned.simiExtraField) {
                        try {
                            productDataReturned.simiExtraField = productDataReturned.simiExtraField ? JSON.parse(productDataReturned.simiExtraField) : null
                        } catch (e) {}
                    }
                }

                // console.log(productDataReturned)

                saveDataToUrl(clickedLocation.pathname, productDataReturned, false);
            } catch (err) {
                console.error(err)
            }

            analyticClickGTM(item)
            setSimiNProgressLoading(false)
            handleLink(clickedLocation)
        } else if (preFetchProductResult || preFetchProductError) {
            setSimiNProgressLoading(false)
            if (clickedLocation)
                handleLink(clickedLocation)
        }
    }, [setSimiNProgressLoading, handleLink, item, preFetchProductResult, preFetchProductError, clickedLocation])

    const image = (
        <div className={itemClasses["siminia-product-image"]} style={{
            borderColor: configColor.image_border_color,
            backgroundColor: 'white'
        }} >
            <div style={{ position: 'absolute', top: 0, bottom: 0, width: '100%', padding: 1 }}>
                <a href={location.pathname}
                    onClick={e => {
                        e.preventDefault();
                        location.state.quantity = quantity
                        setSimiNProgressLoading(true);
                        setClickedLocation(location);
                    }}>
                    <Image src={small_image} alt={name} key={Identify.randomString(3)} />
                </a>
            </div>
        </div>
    )

    const handleSetQty = useCallback((qty) => {
        quantity = qty 
    })

    let priceLabel = useMemo(() => {
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

        return ( 
            <Price prices={price} type={type_id} classes={itemClasses} />
        )
    }, [price_tiers]);

    const isOutOfStock = stock_status === "OUT_OF_STOCK"

    return (
        <div className={`${itemClasses["product-item"]} ${itemClasses["siminia-product-grid-item"]} siminia-product-grid-item`}>
            <div className={itemClasses['siminia-product-des-top']}>
                {lazyImage ? <LazyLoad placeholder={<img alt={name} src={logo_url} style={{ maxWidth: 60, maxHeight: 60 }} />}>{image}</LazyLoad> : image}
                <div className={itemClasses["siminia-product-des"]}>
                    {review_count ? <div className={itemClasses["item-review-rate"]}>
                        <StaticRate rate={rating_summary} classes={itemClasses} />
                        <span className={itemClasses["item-review-count"]}>({review_count} {(review_count) ? Identify.__('Reviews') : Identify.__('Review')})</span>
                    </div> : ''}
                    <div 
                        role="presentation" 
                        className={`${itemClasses["product-name"]} 
                        ${itemClasses["small"]}`} 
                        onClick={
                            () => {
                                location.state.quantity = quantity
                                setSimiNProgressLoading(true);
                                setClickedLocation(location);
                            }
                        }
                    >
                            {ReactHTMLParse(name)}
                    </div>
                </div>
            </div>
            <div className={itemClasses['siminia-product-des-below']}>
                <div role="presentation" className={`${itemClasses["prices-layout"]} ${Identify.isRtl() ? itemClasses["prices-layout-rtl"] : ''}`} id={`price-${id}`} >
                    {priceLabel}
                </div>
                <div className={`${itemClasses['add-to-cart-action']} ${Identify.isRtl() ? itemClasses['add-to-cart-action-rtl'] : ''}`}>
                    <div className={itemClasses['quantity']}>
                        <Quantity handleSetQty={handleSetQty} isOutOfStock={isOutOfStock} isPhone={isPhone}/>
                    </div>
                    <div className={`${itemClasses['add-to-cart-btn']} ${isOutOfStock ? itemClasses['out-of-stock'] : ''}`} onClick={() => handleAddCart(item, quantity)}>
                        {Identify.__('Add to cart')}
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
    lazyImage: PropTypes.bool,
}


const mapDispatchToProps = {
    toggleMessages,
    setSimiNProgressLoading
};

export default connect(
    null,
    mapDispatchToProps
)(Griditem);