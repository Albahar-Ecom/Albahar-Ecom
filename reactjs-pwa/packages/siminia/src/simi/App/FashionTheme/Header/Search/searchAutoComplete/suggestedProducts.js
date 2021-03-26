import React from 'react';
import { arrayOf, func, number, oneOfType, shape, string } from 'prop-types';

import SuggestedProduct from './suggestedProduct';
import { prepareProduct } from 'src/simi/Helper/Product'

const SuggestedProducts = props => {
    const { limit, onNavigate, products } = props;
    const items = products.slice(0, limit).map(product => (
        <li key={product.id} className="item">
            <SuggestedProduct
                {...prepareProduct(product)}
                onNavigate={onNavigate}
            />
        </li>
    ));

    return <ul className="suggested-products-list">{items}</ul>;
};

export default SuggestedProducts;

SuggestedProducts.defaultProps = {
    limit: 3
};

SuggestedProducts.propTypes = {
    limit: number.isRequired,
    onNavigate: func,
    products: arrayOf(
        shape({
            id: oneOfType([number, string]).isRequired
        })
    ).isRequired
};
