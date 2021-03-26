import React from 'react';
import { number, string, shape } from 'prop-types';

import Image from '@magento/venia-ui/lib/components/Image';
import { mergeClasses } from 'src/classify';
import noProductsFound from './noProductsFound.png';
import defaultClasses from './noProductsFound.css';

// TODO: get categoryUrlSuffix from graphql storeOptions when it is ready

const NoProductsFound = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Image
                alt="Sorry! We couldn't find any products."
                classes={{ image: classes.image, root: classes.imageContainer }}
                src={noProductsFound}
            />
            <h2 className={classes.title}>
                Sorry! We couldn't find any products.
            </h2>
        </div>
    );
};

export default NoProductsFound;

NoProductsFound.propTypes = {
    categoryId: number,
    classes: shape({
        root: string,
        title: string,
        list: string,
        categories: string,
        listItem: string,
        image: string,
        imageContainer: string
    })
};
