import React from 'react';
import { useBrandCategory } from '../../talons/useBrandCategory'
import { FormattedMessage } from 'react-intl';
import { Link } from '@magento/venia-drivers';

const BdetailsCategories = props => {
    const { classes } = props
    const {
        categoryData
    } = useBrandCategory()
    if (!categoryData || !categoryData.mpbrandCategories || !categoryData.mpbrandCategories.length)
        return ''
    const { mpbrandCategories } = categoryData
    return (
        <div className={`container ${classes.brandCategories || ''}`}>
            <div className={classes.brandCategoriesTitle}>
                <FormattedMessage
                    id={'brand.brandCategoryTitle'}
                    defaultMessage={'Brand Category'}
                />
            </div>
            <div>
                {mpbrandCategories.map(mpbrandCategory => {
                    return (
                        <Link className={classes.brandCategoryItem} to={`/brand/category/${mpbrandCategory.url_key}.html`} key={mpbrandCategory.cat_id}>
                            {mpbrandCategory.name} {(mpbrandCategory.mpbrand && mpbrandCategory.mpbrand.length) ? `(${mpbrandCategory.mpbrand.length})` : ''}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default BdetailsCategories