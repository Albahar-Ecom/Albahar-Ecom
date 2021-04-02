import React, {useCallback, useMemo} from 'react';
import defaultClasses from './item.css';
import { configColor } from 'src/simi/Config';
import PropTypes from 'prop-types';
import ReactHTMLParse from 'react-html-parser';
import { mergeClasses } from 'src/classify';
import Price from 'src/simi/App/AlBahar/BaseComponents/Price';
import { prepareProduct } from 'src/simi/Helper/Product';
import { Link } from 'src/drivers';
import LazyLoad from 'src/simi/BaseComponents/LazyLoad';
import { logoUrl } from 'src/simi/Helper/Url';
import Image from 'src/simi/BaseComponents/Image';
import { StaticRate } from 'src/simi/BaseComponents/Rate';
import Identify from 'src/simi/Helper/Identify';
import { productUrlSuffix, saveDataToUrl } from 'src/simi/Helper/Url';
import Quantity from './qty'
import { useHistory } from '@magento/venia-drivers';
import {useGridItem} from 'src/simi/App/AlBahar/talons/Category/useGridItem'
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { HOPrice } from 'src/simi/Helper/Pricing'
import {
    ADD_SIMPLE_MUTATION,
} from 'src/simi/App/AlBahar/RootComponents/Product/ProductFullDetail/productFullDetail.gql';

import { connect } from 'src/drivers';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';

require('./item.scss')

const Griditem = props => {
    const { lazyImage, toggleMessages } = props;
    const history = useHistory();
    const [{ cartId }] = useCartContext();
    let quantity = 1;

    const item = prepareProduct(props.item);
    const logo_url = logoUrl();
    const { classes } = props
    if (!item) return '';
    const itemClasses = mergeClasses(defaultClasses, classes);
    const { name, url_key, stock_status, id, price, type_id, small_image, rating_summary, review_count, price_tiers } = item;
    const product_url = `/${url_key}${productUrlSuffix()}`;

    saveDataToUrl(product_url, item);

    const location = {
        pathname: product_url,
        state: {
            product_id: id,
            item_data: item
        }
    };

    const handleLink = useCallback((location) => {
        history.push(location)
    })


    const {
        handleAddCart, 
        isPhone
    } = useGridItem({
        cartId,
        handleLink,
        location,
        toggleMessages,
        mutations: {
            addSimpleToCartMutation: ADD_SIMPLE_MUTATION
        }
    })

    const image = (
        <div className={itemClasses["siminia-product-image"]} style={{
            borderColor: configColor.image_border_color,
            backgroundColor: 'white'
        }} >
            <div style={{ position: 'absolute', top: 0, bottom: 0, width: '100%', padding: 1 }}>
                <Link to={location}>
                    <Image src={small_image} alt={name} />
                </Link>
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
            {lazyImage ? <LazyLoad placeholder={<img alt={name} src={logo_url} style={{ maxWidth: 60, maxHeight: 60 }} />}>{image}</LazyLoad> : image}
            <div className={itemClasses["siminia-product-des"]}>
                {review_count ? <div className={itemClasses["item-review-rate"]}>
                    <StaticRate rate={rating_summary} classes={itemClasses} />
                    <span className={itemClasses["item-review-count"]}>({review_count} {(review_count) ? Identify.__('Reviews') : Identify.__('Review')})</span>
                </div> : ''}
                <div role="presentation" className={`${itemClasses["product-name"]} ${itemClasses["small"]}`} onClick={() => props.handleLink(location)}>{ReactHTMLParse(name)}</div>
                <div role="presentation" className={`${itemClasses["prices-layout"]} ${Identify.isRtl() ? itemClasses["prices-layout-rtl"] : ''}`} id={`price-${id}`} onClick={() => props.handleLink(location)}>
                    {priceLabel}
                </div>
                <div className={`${itemClasses['add-to-cart-action']}`}>
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
    toggleMessages
};

export default connect(
    null,
    mapDispatchToProps
)(Griditem);

