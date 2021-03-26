import React from 'react'
import Identify from "src/simi/Helper/Identify";
import Carousel from 'src/simi/App/FashionTheme/BaseComponents/Carousels';
import { cateUrlSuffix, logoUrl } from 'src/simi/Helper/Url';
import Image from 'src/simi/BaseComponents/Image';
import { Link } from 'src/drivers';
import LazyLoad from 'src/simi/BaseComponents/LazyLoad';
import Skeleton from 'react-loading-skeleton';

require('./category.scss');

const Category = props => {
    const { data, isPhone } = props;
    const showItem = isPhone ? 1 : 3
    const logo_url = logoUrl()

    const renderCateItem = (item, index) => {
        let img = item.simicategory_filename;
        if (item.simicategory_filename_tablet && isPhone) {
            img = item.simicategory_filename_tablet
        }
        return (
            <div className="home-cate-item" key={index}>
                <Link to={`/${item.url_path}${cateUrlSuffix()}`}>
                    <div className="cate-image">
                        <LazyLoad placeholder={<img src={logo_url} alt={item.simicategory_name} key={index} />}>
                            {<Image src={item.simicategory_filename_tablet} alt={item.simicategory_name} key={index} />}
                        </LazyLoad>
                    </div>
                </Link>
                <Link to={`/${item.url_path}${cateUrlSuffix()}`}>
                    <div className="cate-name">{item.cat_name}</div>
                </Link>
                {item.hasOwnProperty('product_size') && <div className="cate-product-size">{`${item.product_size} ${item.product_size > 1 ? 'products' : 'product'}`}</div>}
            </div>
        )
    }

    if (!data || !data.homecategories || !data.homecategories.length || data.homecategories.length === 0)
        return (
            <div className="home-category">
                <div className="home-title">
                    <Skeleton />
                </div>
                <div className="home-desc"><Skeleton /></div>
                <div className="home-category-content"><Skeleton /></div>
            </div>
        )

    let cloneDataForEditing = JSON.parse(JSON.stringify(data));
    const sortData = cloneDataForEditing.homecategories.sort((a, b) => a.sort_order - b.sort_order)

    return (
        <div className="home-category">
            <div className="home-title">
                <h3>{Identify.__('Shop By Category')}</h3>
            </div>
            <div className="home-desc">{Identify.__('Lorem Ipsum is simply dummy text')}</div>
            <div className="home-category-content">
                <Carousel data={sortData} showNumber={showItem} className="category" renderItems={renderCateItem} />
            </div>
        </div>
    )
}

export default Category
