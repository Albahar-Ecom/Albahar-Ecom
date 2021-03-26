import React, { useState } from 'react';
import { connect } from 'src/drivers';
import Identify from "src/simi/Helper/Identify";
import TitleHelper from 'src/simi/Helper/TitleHelper';
import { prepareProduct } from 'src/simi/Helper/Product';
import { useAddWishlist } from 'src/simi/talons/Wishlist/useAddWishlist';
import OneColumn from 'src/simi/App/FashionTheme/BaseComponents/CompareProducts/OneColumn';

require('./compareproduct.scss');

const CompareProduct = props => {
    const { history, isSignedIn, cartId } = props;

    const {
        data: wishlistData,
        addWishlist
    } = useAddWishlist();

    const compareProducts = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'compare_product');

    const [products, setProducts] = useState(compareProducts);

    const storeConfig = Identify.getStoreConfig();
    let showSizeRow = false
    if (storeConfig && storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config &&
        storeConfig.simiStoreConfig.config.catalog && storeConfig.simiStoreConfig.config.catalog.frontend &&
        storeConfig.simiStoreConfig.config.catalog.frontend.show_size_in_compare &&
        storeConfig.simiStoreConfig.config.catalog.frontend.show_size_in_compare === "1") {
        showSizeRow = true
    }

    const updateCompare = () => {
        setProducts(Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'compare_product'));
    }

    const addToWishlist = (item) => {
        addWishlist(item.id);
    }

    const renderProductCompare = () => {
        const html = products.map((product, index) => {
            const newProduct = prepareProduct(product);
            return <OneColumn
                product={product}
                key={index}
                history={history}
                isSignedIn={isSignedIn}
                wishlist={wishlistData}
                addToWishlist={(data) => addToWishlist(data)}
                updateCompare={updateCompare}
                showSizeRow={showSizeRow}
                cartId={cartId}
            />
        })

        return (
            <div className="compare-product-table">
                <div className="column title">
                    <div className="compare-row"></div>
                    {showSizeRow && <div className="compare-row size">{Identify.__('Size')}</div>}
                    <div className="compare-row avalability">{Identify.__('Availability')}</div>
                    <div className="compare-row sku">{Identify.__('Sku')}</div>
                    <div className="compare-row description">{Identify.__('Description')}</div>
                </div>
                {html}
            </div>
        )
    }

    let compareHtml = <div className="no-products">{Identify.__('You have no items to compare!')}</div>

    if (products && products.length && products.length > 0) {
        compareHtml = (
            <div className="my-compare-product-wrapper">
                {renderProductCompare()}
            </div>
        )
    }

    return (
        <div className="my-compare-product">
            {TitleHelper.renderMetaHeader({
                title: Identify.__('My Compare Product')
            })}
            <div className="customer-page-title">
                {Identify.__("My Compare Product")}
            </div>
            {compareHtml}
        </div>
    )
}

const mapStateToProps = ({ cart }) => {
    const { cartId } = cart
    return {
        cartId
    };
};


export default connect(mapStateToProps, null)(CompareProduct);
