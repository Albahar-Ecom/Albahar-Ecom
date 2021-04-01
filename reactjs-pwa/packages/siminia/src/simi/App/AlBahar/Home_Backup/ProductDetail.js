import React from 'react'
import Identify from "src/simi/Helper/Identify";
import { simiUseQuery } from 'src/simi/Network/Query'
import getCategory from 'src/simi/queries/catalog/getCategory.graphql'
import Loading from "src/simi/BaseComponents/Loading";
import { GridItem } from "src/simi/App/AlBahar/BaseComponents/GridItem";
import { applySimiProductListItemExtraField } from 'src/simi/Helper/Product'
import SlickCarousel from 'src/simi/App/AlBahar/BaseComponents/SlickCarousel';

const ProductItem = props => {
    const { dataProduct, history, isPhone } = props;
    console.log('run', isPhone)
    const { data } = simiUseQuery(getCategory, {
        variables: {
            id: Number(dataProduct.category_id),
            pageSize: Number(8),
            currentPage: Number(1),
            stringId: String(dataProduct.category_id)
        },
        fetchPolicy: "no-cache"
    });

    const handleAction = (location) => {
        history.push(location);
    }

    if (!data) return <Loading />

    const renderProductItem = (item, index) => {
        const itemData = {
            ...item,
            small_image:
                typeof item.small_image === 'object' && item.small_image.hasOwnProperty('url') ? item.small_image.url : item.small_image
        }
        return (
            <div
                key={index}
                className={`horizontal-item`}
                // style={{
                //     display: 'inline-block',
                // }}
            >
                <GridItem
                    item={itemData}
                    handleLink={handleAction}
                />
            </div>
        );
    }

    const renderProductCarousel = (items) => {
        return (
            <SlickCarousel
                items={items}
                renderItem={renderProductItem}
                autoplay={false}
                infinite={true}
            />
        )
    }

    const renderProductGrid = (items) => {
        return items.map((item, index) => {
            return renderProductItem(item, index)
        })
    }

    if (data.simiproducts.hasOwnProperty('items') && data.simiproducts.total_count > 0) {
        const productItem = applySimiProductListItemExtraField(data.simiproducts);
        return (
            <div className="product-list">
                <div className="product-horizotal">
                    {isPhone 
                        ? renderProductGrid(productItem.items) 
                        : renderProductCarousel(productItem.items)
                    }
                </div>
            </div>
        )

    }

    return 'Product was found';
}

export default ProductItem;