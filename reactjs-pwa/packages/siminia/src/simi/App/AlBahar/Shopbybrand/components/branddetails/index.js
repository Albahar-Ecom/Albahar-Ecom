import React from "react";
import { FormattedMessage } from 'react-intl';
import { useParams } from "react-router-dom";
import { useBrandDetails } from '../../talons/useBrandDetails';
import defaultClasses from './branddetails.css';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Link } from '@magento/venia-drivers';
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';
import Categories from './bdetailscategories';
import Products from './products/index';

const BrandDetails = () => {
    const classes = defaultClasses
    const { brandUrl = "" } = useParams();
    const { brandData, brandLoading, derivedErrorMessage } = useBrandDetails({ url_key: brandUrl.replace('.html', '') });
    if (brandLoading)
        return fullPageLoadingIndicator;
    if (derivedErrorMessage)
        return <div className={classes.brandError}>{derivedErrorMessage}</div>;
    if (!brandData || !brandData.mpbrand || !brandData.mpbrand.items || !brandData.mpbrand.items[0])
        return (
            <div className={classes.brandError}>
                <FormattedMessage
                    id={'brand.NoBrandFound'}
                    defaultMessage={'No Brand Found'}
                />
            </div>
        );

    const brandInformation = brandData.mpbrand.items[0]
    const {meta_title, meta_description, meta_keywords} = brandInformation;

    return (
        <div className={classes.rootDetails}>
            {meta_title && <Title>{meta_title}</Title>}
            {meta_description && <Meta name="description" content={meta_description} />}
            {meta_keywords && <Meta name="keywords" content={meta_keywords} />}
            <div className={classes.breadCrumb}>
                <Link className={classes.breadCrumbLink} to="/">{`Home`}</Link>
                <span className={classes.breadCrumbSeparator}>{`/`}</span>
                <Link className={classes.breadCrumbLink} to="/brand.html">{`Brands`}</Link>
                <span className={classes.breadCrumbSeparator}>{`/`}</span>
                <span className={classes.breadCrumbText}>{`Brands`}</span>
            </div>
            {brandInformation.page_title && <div className="container">
                <h1>{brandInformation.page_title}</h1>
            </div>}
            <Categories classes={classes} />
            <Products option_id={brandInformation.option_id} classes={classes} />
        </div>
    );
}

export default BrandDetails;