import React from 'react'
import { simiUseQuery } from 'src/simi/Network/Query'
import getCategory from 'src/simi/queries/catalog/getCategory.graphql'
import { GridItem } from "src/simi/App/FashionTheme/BaseComponents/GridItem";
import Loading from "src/simi/BaseComponents/Loading";
import Carousel from 'src/simi/App/FashionTheme/BaseComponents/Carousels';
import { applySimiProductListItemExtraField } from 'src/simi/Helper/Product'

const Product = props => {
    const { title, cateId, desc, history, isPhone } = props;
    const showItem = isPhone ? 1 : 4;

    const { data, error, loading } = simiUseQuery(getCategory, {
        variables: {
            id: Number(cateId),
            pageSize: Number(8),
            currentPage: Number(1),
            stringId: String(cateId),
            simiProductSort: {
                attribute: 'entity_id',
                direction: 'DESC'
            }
        },
        fetchPolicy: "no-cache"
    });

    const handleLink = (location) => {
        history.push(location);
    }

    const mapGalleryItem = (item) => {
        const { small_image } = item;
        return {
            ...item,
            small_image:
                typeof small_image === 'object' ? small_image.url : small_image
        };
    }

    const renderProductItem = (item, index) => {
        return (
            <GridItem
                key={index}
                item={mapGalleryItem(item)}
                handleLink={handleLink.bind(this)}
                changeImage={true}
            />
        )
    }

    if (loading) return <Loading />

    if (error) {
        console.log(error)
        return null;
    }

    if (data && data.simiproducts && data.simiproducts.total_count > 0) {
        const simiproducts = applySimiProductListItemExtraField(data.simiproducts);
        return (
            <div className="home-product">
                <div className="home-title">
                    <h3>{title}</h3>
                </div>
                {desc && <div className="home-desc">{desc}</div>}
                <div className="product-content">
                    <Carousel data={simiproducts.items} renderItems={renderProductItem} className="home-product" showNumber={showItem} />
                </div>
            </div>
        )
    }

    return null
}

export default Product
