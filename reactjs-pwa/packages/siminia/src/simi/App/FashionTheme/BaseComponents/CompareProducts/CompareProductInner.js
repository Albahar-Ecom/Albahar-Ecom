import React from 'react';
import Identify from "src/simi/Helper/Identify";
import TitleHelper from 'src/simi/Helper/TitleHelper';
import { connect } from 'src/drivers';
import OneColumn from './OneColumn';
import { useAddWishlist } from 'src/simi/talons/Wishlist/useAddWishlist';

const CompareProductInner = props => {
    const { history, isSignedIn, cartId } = props;

    const {
        data: wishlistData,
        addWishlist
    } = useAddWishlist();
    const storeConfig = Identify.getStoreConfig();
    let showSizeRow = false
    if (storeConfig && storeConfig.simiStoreConfig && storeConfig.simiStoreConfig.config &&
        storeConfig.simiStoreConfig.config.catalog && storeConfig.simiStoreConfig.config.catalog.frontend &&
        storeConfig.simiStoreConfig.config.catalog.frontend.show_size_in_compare &&
        storeConfig.simiStoreConfig.config.catalog.frontend.show_size_in_compare === "1") {
        showSizeRow = true
    }

    const addToWishlist = (item) => {
        addWishlist(item.id);
    }

    const renderProductCompare = (products, showSizeRow) => {
        const html = products.map((product, index) => {
            return <OneColumn
                product={product}
                key={index}
                history={history}
                isSignedIn={isSignedIn}
                wishlist={wishlistData}
                addToWishlist={(data) => addToWishlist(data)}
                updateCompare={props.updateCompare}
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

    let compareHtml = <div className="no-products">{Identify.__('No Products Found!')}</div>

    if (props.compareData && props.compareData.length && props.compareData.length > 0) {
        compareHtml = renderProductCompare(props.compareData, showSizeRow)
    }

    return (
        <div className="compare-product-content">
            {TitleHelper.renderMetaHeader({
                title: Identify.__('My Compare Product')
            })}
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



export default connect(
    mapStateToProps,
    null
)(CompareProductInner);

