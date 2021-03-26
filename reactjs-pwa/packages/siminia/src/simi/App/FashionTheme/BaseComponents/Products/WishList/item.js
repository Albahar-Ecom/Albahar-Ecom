import React from 'react';
import Image from 'src/simi/BaseComponents/Image';
import { Link, connect } from 'src/drivers';
import Identify from 'src/simi/Helper/Identify';
import { toggleMessages } from 'src/simi/Redux/actions/simiactions';
import { formatPrice } from 'src/simi/Helper/Pricing';
import { productUrlSuffix } from 'src/simi/Helper/Url';
import ReactHTMLParse from 'react-html-parser';

require('./wishlist.scss');

const WishListItem = (props) => {
    const { item, history } = props;
    const { product } = item || {};
    const product_url = `/${product.url_key}${productUrlSuffix()}`
    const location = {
        pathname: product_url
    };
    let stockAvai = false;
    if (product && product.stock_status && product.stock_status === 'IN_STOCK') {
        stockAvai = true;
    }

    const addToCart = () => {
        if (product.type_id === 'simple' && (!product.hasOwnProperty('options') || (product.hasOwnProperty('options') && product.options === null))) {
            props.addToCart(item.id);
        } else {
            history.push(location);
        }
    }

    const deleteItem = () => {
        props.removeItem(item.id);
    }

    return (
        <div className="wl-item">
            <div className="wl-image">
                <Link to={location} >
                    <Image key={Identify.randomString('5')} className="img-responsive" src={product.small_image.url} alt={product.name} />
                </Link>
            </div>
            <div className="wl-item-des">
                <div className="wl-item-name" role="presentation" onClick={() => props.history.push(location)}>
                    {ReactHTMLParse(Identify.__(product.name))}
                </div>
                <div className="wl-item-price">
                    {(product.type_id === "simple" || product.type_id === "configurable" || product.type_id === "downloadable") ?
                        <div className="simple">
                            {product.is_show_price && product.app_prices && product.app_prices.price ?
                                <div className="price">
                                    {formatPrice(parseFloat(product.app_prices.price))}
                                </div> : ''}
                            {product.is_show_price && product.app_prices && product.app_prices.has_special_price > 0 ?
                                <div className="regular-price">
                                    {formatPrice(parseFloat(product.app_prices.regular_price))}
                                </div> : ''}
                        </div> : ''}
                    {product.type_id === "grouped" &&
                        <div className="grouped">
                            {product.is_show_price && product.app_prices && product.app_prices.price ?
                                <div className="price">
                                    {Identify.__('Start at: ')}{formatPrice(parseFloat(product.app_prices.price))}
                                </div> : ''}
                        </div>
                    }
                    {product.type_id === "bundle" &&
                        <div className="bundle">
                            {product.is_show_price && product.app_prices && product.app_prices.from_price ?
                                <div className="from-price">
                                    {product.app_prices.product_from_label && Identify.__(product.app_prices.product_from_label)}: {formatPrice(parseFloat(product.app_prices.from_price))}
                                </div> : ''}
                            {product.is_show_price && product.app_prices && product.app_prices.to_price ?
                                <div className="to-price">
                                    {product.app_prices.product_to_label && Identify.__(product.app_prices.product_to_label)}: {formatPrice(parseFloat(product.app_prices.to_price))}
                                </div> : ''}
                        </div>
                    }
                </div>
                <div className={`${!stockAvai ? 'outstock' : ''} wl-add-to-cart`} role="presentation" onClick={addToCart}>
                    <div className="text">{Identify.__(!stockAvai ? 'Out of Stock' : 'Add to cart ')}</div>
                </div>
            </div>
            <div className="btn-close" role="presentation" onClick={deleteItem}>
                <i className="icon-cross2"></i>
            </div>
        </div>
    )
}

const mapDispatchToProps = {
    toggleMessages
};

export default connect(
    null,
    mapDispatchToProps
)(WishListItem);
