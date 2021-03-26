import React, { useState } from "react";
import Identify from "src/simi/Helper/Identify";
import ReactHTMLParse from 'react-html-parser';
import { Link } from 'src/drivers';
import { hideFogLoading, showFogLoading } from 'src/simi/BaseComponents/Loading/GlobalLoading'
import Image from 'src/simi/BaseComponents/Image'
import { productUrlSuffix } from 'src/simi/Helper/Url';
import QuickView from 'src/simi/App/FashionTheme/BaseComponents/QuickView';
import connectorGetProductDetailByUrl from 'src/simi/queries/catalog/getProductDetail.graphql';
import { showToastMessage } from 'src/simi/Helper/Message';
import { useLazyQuery } from '@apollo/client';
import Price from 'src/simi/App/FashionTheme/BaseComponents/Price';
import { prepareProduct } from 'src/simi/Helper/Product'
import Basket from "src/simi/App/FashionTheme/BaseComponents/Icon/Basket";

const Item = props => {
    const { item, history, toggleMessages } = props;
    const [modal, setModal] = useState(false);
    const product = prepareProduct(item.product);

    const location = {
        pathname: '/' + product.url_key + productUrlSuffix(),
        state: {
            product_sku: product.sku,
            product_id: product.id,
            item_data: item
        },
    }
    const variables = { onServer: false, urlKey: product.url_key }

    const [getCompareData, { data, loading, error }] = useLazyQuery(connectorGetProductDetailByUrl, {
        variables,
        onCompleted: (data) => {
            hideFogLoading()
            if (data) {
                const storeageData = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'compare_product');
                let compareProducts = [];
                if (storeageData) compareProducts = storeageData;
                if (data && data.productDetail && data.productDetail.items && data.productDetail.items.length) {

                    const productData = data.productDetail.items[0];
                    compareProducts.push(productData);
                    Identify.storeDataToStoreage(Identify.LOCAL_STOREAGE, 'compare_product', compareProducts);
                    showToastMessage(Identify.__('Product has added to your compare list'))
                } else {
                    showToastMessage(Identify.__('Operation has been problem. Please try again later'))
                }
            }
        },
        onError: (error) => {
            hideFogLoading();
            showToastMessage(error)
        }
    });

    const addToCart = (id) => {
        if (product.type_id === 'simple' && (!product.hasOwnProperty('options') || (product.hasOwnProperty('options') && product.options === null))) {
            props.addWishlistToCart(id);
        } else {
            history.push(location);
        }
    }

    const onTrashItem = (id) => {
        if (id) {
            if (confirm(Identify.__('Are you sure you want to delete this product?')) == true) {
                props.removeItem(id);
            }
        }
    }

    const handleQuickView = () => {
        setModal(true);
    }

    const handleCloseModel = () => {
        setModal(false)
    }

    const addToCompare = () => {
        let compareProductAdded = false
        if (!compareProductAdded) {
            const storeageData = Identify.getDataFromStoreage(Identify.LOCAL_STOREAGE, 'compare_product');
            if (storeageData) {
                const result = storeageData.find(product => product && product.id == item.product.id)
                if (result) {
                    compareProductAdded = true
                }
            }
        }

        if (compareProductAdded) {
            showToastMessage(Identify.__('Product has already added'.toUpperCase()))
        } else {
            showFogLoading()
            getCompareData();
        }
    }

    const image = product.small_image && product.small_image.url && (
        <div className="wishlist-image">
            <Link to={location}>
                <div className="wishlist-image-wrapper">
                    <Image src={product.small_image.url} alt={product.name} style={{ maxWidth: 240, maxHeight: 300 }} />
                </div>
            </Link>
            <div className="my-wishlist-action">
                <div className="add-to-cart" onClick={() => addToCart(item.id, location)}>
                    <Basket style={{ display: 'block', margin: 0 }} />
                </div>
                <div className="quickview" onClick={() => handleQuickView()}>
                    <i className="icon icon-eye"></i>
                </div>
                <div className="compare" onClick={() => addToCompare()}>
                    <i className="icon icon-sync" ></i>
                </div>
                <div className="delete" onClick={() => onTrashItem(item.id)}>
                    <i className="icon icon-trash" ></i>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`product-item product-grid-item`}>
            {image}
            <div className="product-des">
                <Link to={location} className="product-name">{ReactHTMLParse(product.name)}</Link>
                <Price prices={product.price} type={product.type_id} />
            </div>
            {modal && <QuickView openModal={modal} product={product} closeModal={handleCloseModel} />}
        </div>
    );

}

export default Item;
