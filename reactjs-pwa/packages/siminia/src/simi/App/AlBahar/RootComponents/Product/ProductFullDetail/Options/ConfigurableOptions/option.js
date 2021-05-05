import React, { Component } from 'react';
import { arrayOf, func, object, shape, string } from 'prop-types';

import classify from 'src/classify';
import TileList from './tileList';
import defaultClasses from './option.css';

const getItemKey = ({ value_index }) => value_index;

class Option extends Component {
    static propTypes = {
        attribute_id: string,
        attribute_code: string.isRequired,
        classes: shape({
            root: string,
            title: string
        }),
        label: string.isRequired,
        onSelectionChange: func,
        values: arrayOf(object).isRequired
    };

    handleSelectionChange = selection => {
        const { attribute_id, onSelectionChange } = this.props;
        if (onSelectionChange) {
            onSelectionChange(attribute_id, selection);
        }
    };

    getProduct = (values) => {
        const {variants} = this.props
        values.forEach((value) => {
            const products = variants.filter((variant) => {
                if(variant.attributes && variant.attributes.length > 0) {
                    return variant.attributes.some(attribute => {
                        return attribute.value_index === value.value_index
                    });
                }

                return false
            })
            value.products = products
        })
        
    }

    render() {
        const { handleSelectionChange, props } = this;
        const { classes, label, values, attribute_code, variants } = props;

        this.getProduct(values)
        
        return (
            <div className={`${classes.root} option-item-type option-item-type-${attribute_code}`}>
                <h3 className={classes.title}>
                    <span>{label}</span>
                </h3>
                <TileList
                    getItemKey={getItemKey}
                    items={values}
                    onSelectionChange={handleSelectionChange}
                    attribute_code={attribute_code}
                />
            </div>
        );
    }
}

export default classify(defaultClasses)(Option);
