import React from 'react'
import Identify from "src/simi/Helper/Identify";
import { simiUseQuery } from 'src/simi/Network/Query'
import getCategory from 'src/simi/App/AlBahar/queries/catalog/getHomeProductList.graphql'
import Loading from "src/simi/BaseComponents/Loading";
import { GridItem } from "src/simi/App/AlBahar/BaseComponents/GridItem";
import { applySimiProductListItemExtraField, prepareProduct } from 'src/simi/Helper/Product'
import {getStore} from '../Helper/Data'
import { useUserContext } from '@magento/peregrine/lib/context/user';

const ProductItem = props => {
    const { dataProduct, history } = props;
    const store = getStore();
    const [{ isSignedIn }] = useUserContext();
    const variables = {
        id: Number(dataProduct.category_id),
        pageSize: Number(8),
        currentPage: Number(1),
        stringId: String(dataProduct.category_id),
        cacheKeyStoreId: String(store.id || 1)
    }
    if(isSignedIn) {
        variables.loginToken = Identify.randomString()
    }
    const { data } = simiUseQuery(getCategory, {
        variables,
        fetchPolicy: "no-cache"
    });

    const handleAction = (location) => {
        history.push(location);
    }

    if (!data) return <Loading />

    const renderProductItem = (item, lastInRow) => {

        const itemData = {
            ...prepareProduct(item),
            small_image:
                typeof item.small_image === 'object' && item.small_image.hasOwnProperty('url') ? item.small_image.url : item.small_image
        }
        return (
            <div
                key={`horizontal-item-${item.id}`}
                className={`horizontal-item ${lastInRow ? 'last' : 'middle'}`}
                style={{
                    display: 'inline-block',
                }}
            >
                <GridItem
                    item={itemData}
                    handleLink={handleAction}
                />
            </div>
        );
    }

    const renderProductGrid = (items) => {
        const products = items.map((item, index) => {
            return renderProductItem(item, (index % 4 === 3))
        });

        return (
            <div className="horizontal-flex" style={{
                width: '100%',
                flexWrap: 'wrap',
                display: 'flex',
                direction: Identify.isRtl() ? 'rtl' : 'ltr'
            }}>
                {products}
            </div>
        )
    }

    if (data.simiproducts.hasOwnProperty('items') && data.simiproducts.total_count > 0) {
        const productItem = applySimiProductListItemExtraField(data.simiproducts);
        return (
            <div className="product-list">
                <div className="product-horizotal">
                    {renderProductGrid(productItem.items)}
                </div>
            </div>
        )

    }

    return 'Product was found';
}

export default ProductItem;