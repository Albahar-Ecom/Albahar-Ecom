import React from 'react'
import Identify from 'src/simi/Helper/Identify';
import Loading from 'src/simi/BaseComponents/Loading';
import { GridItem } from 'src/simi/App/FashionTheme/BaseComponents/GridItem';
import CarouselBase from 'src/simi/App/FashionTheme/BaseComponents/Carousels';
import GET_PRODUCTS_BY_SKUS from 'src/simi/queries/catalog/getProductsBySkus.graphql';
import { useLinkedProducts } from 'src/simi/talons/LinkedProducts/useLinkedProducts';

require('./linkedProduct.scss');

const LinkedProducts = props => {
    const { history, showCarousel, link_type, product_links } = props;

    const maxItem = 8;

    const skuValues = product_links && product_links.length && product_links.map(value => value.linked_product_sku);

    const talonProps = useLinkedProducts({
        skuValues,
        maxItem,
        query: {
            getProductBySku: GET_PRODUCTS_BY_SKUS
        }
    });

    const { isPhone, loading, initialData } = talonProps;

    if (loading) {
        return <Loading />;
    }

    const handleLink = (link) => {
        history.push(link)
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

    if (!initialData) {
        return null;
    }

    const { simiproducts } = initialData;
    const { items } = simiproducts;

    if (items && items.length) {
        let linkedProducts = null;
        if (!showCarousel) {
            linkedProducts = items.map((item, index) => {
                return <div key={index} className="linked-product-item">
                    {renderProductItem(item, index)}
                </div>
            })
        } else {
            const showItem = isPhone ? 2 : 4;
            linkedProducts = <CarouselBase key={Identify.randomString(3)} data={items} renderItems={renderProductItem} className="linked-product-carousel" showNumber={showItem} />;
        }

        return (
            <div className="linked-product-ctn">
                {link_type && <h2 className="title">
                    <span>{link_type === 'related' ? Identify.__('Related Products') : (link_type === 'crosssell' ? Identify.__('You may also be interested in') : '')}</span>
                </h2>}
                <div className={`linked-products ${showCarousel ? 'linked-products-carousel' : ''}`}>
                    {linkedProducts}
                </div>
            </div>
        )
    }

    return null;

}
export default LinkedProducts
