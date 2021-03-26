import React from 'react';
import { func, number, shape, string, bool, object } from 'prop-types';
import Price from 'src/simi/BaseComponents/Price'
import { Link } from 'src/drivers';
import { resourceUrl, logoUrl, productUrlSuffix } from 'src/simi/Helper/Url'
import ReactHTMLParse from 'react-html-parser';
import LazyLoad from 'src/simi/BaseComponents/LazyLoad';
import Image from 'src/simi/BaseComponents/Image'

const SuggestedProduct = props => {
    const handleClick = () => {
        const { onNavigate } = props;
        if (typeof onNavigate === 'function') {
            onNavigate();
        }
    }
    const logo_url = logoUrl()
    const {url_key, small_image, name, price, type_id } = props;
    const uri = resourceUrl(`/${url_key}${productUrlSuffix()}`);
    const place_holder_img = <img alt={name} src={logo_url} style={{maxWidth: 60, maxHeight: 60}}/>

    return (
        <Link className="suggested-product-root" to={uri} onClick={handleClick}>
            <span className="image">
                <LazyLoad
                    placeholder={place_holder_img}>
                    <Image
                        alt={name}
                        src={small_image? resourceUrl(small_image.url, {
                            type: 'image-product',
                            width: 60
                        }) : logoUrl()}
                        style={{maxWidth: 60, maxHeight: 60}}
                    />
                </LazyLoad>
            </span>
            <span className="right-label">
                <span className="name">{ReactHTMLParse(name)}</span>
                <span className="price">
                    <Price prices={price} type={type_id} />
                </span>
            </span>
        </Link>
    );
}

SuggestedProduct.propTypes = {
    url_key: string.isRequired,
    small_image: shape(
        {
            url: string.isRequired
        }
    ),
    name: string.isRequired,
    onNavigate: func,
    price: shape({
        has_special_price: bool,
        maximalPrice: shape({
            amount: shape({
                currency: string,
                value: number
            })
        }),
        minimalPrice: shape({
            amount: shape({
                currency: string,
                value: number
            })
        }),
        regularPrice: shape({
            amount: shape({
                currency: string,
                value: number
            })
        })
    }).isRequired
};

export default SuggestedProduct;
