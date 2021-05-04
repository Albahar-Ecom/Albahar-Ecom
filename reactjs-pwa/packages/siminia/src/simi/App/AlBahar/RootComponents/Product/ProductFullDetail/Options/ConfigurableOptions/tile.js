import React, { Component } from 'react';
import { bool, number, shape, string } from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './tile.css';

const getClassName = (name, isSelected, hasFocus) =>
    `${name}${isSelected ? '_selected' : ''}${hasFocus ? '_focused' : ''}`;

class Tile extends Component {
    static propTypes = {
        classes: shape({
            root: string
        }),
        hasFocus: bool,
        isSelected: bool,
        item: shape({
            label: string.isRequired
        }).isRequired,
        itemIndex: number
    };

    static defaultProps = {
        hasFocus: false,
        isSelected: false
    };

    handleOnClick = (isOutStock) => {
        if(isOutStock) return
        this.props.onClick()
    }

    render() {
        const {
            classes,
            hasFocus,
            isSelected,
            item,
            // eslint-disable-next-line
            itemIndex,
            ...restProps
        } = this.props;
        const className = classes[getClassName('root', isSelected, hasFocus)];

        let isOutStock = false
        if(item.products && item.products.length > 0) {
            const outStockProduct = item.products.filter((itemProduct) => {
                if(itemProduct.product && itemProduct.product.stock_status !== "IN_STOCK") {
                    return true
                }

                return false
            })

            if(outStockProduct.length === item.products.length) {
                isOutStock = true
            }
        }

        const { label, swatch_data } = item;
        let swatchStyle = {};
        if (swatch_data) {
            if (swatch_data.hasOwnProperty('thumbnail')) {
                swatchStyle = { background: `url(${swatch_data.thumbnail})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' };
            } else {
                swatchStyle = { background: swatch_data.value };
            }
        }

        return (
            <button 
                onClick={() => this.handleOnClick(isOutStock)} 
                className={`${className} ${isSelected ? 'selected' : ''} ${isOutStock ? 'product-out-stock' : ''} tile-option-item`} 
                style={swatchStyle}
            >
                <span>{label}</span>
            </button>
        );
    }
}

export default classify(defaultClasses)(Tile);
