import React from 'react';
import Image from 'src/simi/BaseComponents/Image';
import ReactHTMLParse from 'react-html-parser';
import { configColor } from 'src/simi/Config';
import { StaticRate } from 'src/simi/BaseComponents/Rate';
import QuickView from 'src/simi/App/FashionTheme/BaseComponents/QuickView';
import Price from 'src/simi/App/FashionTheme/BaseComponents/Price';
import { prepareProduct } from 'src/simi/Helper/Product';
import Identify from "src/simi/Helper/Identify";
import { useCompare } from 'src/simi/talons/Compare/useCompare';
import { ADD_SIMPLE_MUTATION } from 'src/simi/App/core/RootComponents/Product/ProductFullDetail/productFullDetail.gql';
import { showFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading';
import { productUrlSuffix } from 'src/simi/Helper/Url'
import Basket from "src/simi/App/FashionTheme/BaseComponents/Icon/Basket";

const OneColumn = (props) => {
    const { updateCompare, wishlist, product, cartId, history } = props;

    const { url_key } = product
    const product_url = `/${url_key}${productUrlSuffix()}`

    const talonProps = useCompare({
        cartId,
        history,
        product_url,
        updateCompare, mutations: {
            addSimpleToCartMutation: ADD_SIMPLE_MUTATION
        }
    });

    const { quickView, loading, derivedErrorMessage,
        handleAddCart, handleQuickView, handleDeleteCompare } = talonProps;

    const checkWishlist = (product) => {
        if (wishlist && Array.isArray(wishlist) && wishlist.length && wishlist.length > 0) {
            return wishlist.find(item => parseInt(item.product_id) === product.id);
        }

        return false
    }


    const isWishList = checkWishlist(product);

    const { id, name, sku, description, price, type_id,
        stock_status, configurable_options } = prepareProduct(product);
    let { small_image, rating_summary, review_count } = prepareProduct(product);
    if (small_image instanceof Object && Object.keys(small_image).length && small_image.hasOwnProperty('url')) {
        small_image = small_image.url;
    }
    let isSale = Identify.__('IN STOCK');
    let allSize = null;
    if (stock_status && stock_status === 'OUT_OF_STOCK') {
        isSale = Identify.__('OUT OF STOCK')
    }

    if (type_id === "configurable" && configurable_options && configurable_options.length && props.showSizeRow) {
        const attrSize = configurable_options.find(({ attribute_code }) => attribute_code === 'size');
        if (attrSize) {
            const { values } = attrSize;
            if (values && values.length) {
                allSize = values.map((item, odx) => {
                    const comma = odx + 1 === values.length ? '' : ', ';
                    return item.label + '' + comma;
                });
            }
        }
    }

    if (loading) {
        showFogLoading();
    }

    if (derivedErrorMessage) {
        showToastMessage(derivedErrorMessage);
    }

    return (
        <div className="column" key={Identify.randomString(3)}>
            <div className="compare-row detail">
                <div className="product-image">
                    <div role="presentation" className="action-wishlist" onClick={() => props.addToWishlist(product)}>
                        <i className={`icon icon-heart ${isWishList && props.isSignedIn ? 'added-item' : 'normal-item'}`}></i>
                    </div>
                    <Image src={small_image} alt={name} />
                    <div className="actions">
                        <div role="presentation" className="action add-to-cart" onClick={() => handleAddCart(product)}>
                            <Basket style={{ display: 'block', margin: 0 }} />
                        </div>
                        <div role="presentation" className="action quick-view" onClick={() => handleQuickView(true)}>
                            <i className="icon icon-eye"></i>
                        </div>
                        <div role="presentation" className="action delete" onClick={() => handleDeleteCompare(id)}>
                            <i className="icon icon-trash"></i>
                        </div>
                    </div>
                </div>
                <div className="product-name">{name}</div>
                <div className="product-rating">
                    <StaticRate rate={rating_summary} size={15} backgroundColor={'#B91C1C'} />
                    <span className="number-rate">({review_count})</span>
                </div>
                <div className="product-price" style={{ color: configColor.price_color }}>
                    <Price prices={price} type={type_id} />
                </div>
            </div>
            {props.showSizeRow && <div className="compare-row size">{allSize}</div>}
            <div className="compare-row avalability">{isSale}</div>
            <div className="compare-row sku">{sku}</div>
            <div className="compare-row description">{description && description.html && ReactHTMLParse(Identify.__(description.html))}</div>
            <QuickView key={Identify.randomString(5)} openModal={quickView} product={product} closeModal={() => handleQuickView(false)} />
        </div>
    )
}

export default OneColumn
