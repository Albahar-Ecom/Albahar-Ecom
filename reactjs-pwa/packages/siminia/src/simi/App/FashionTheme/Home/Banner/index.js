import React from 'react'
import Carousel from 'src/simi/App/FashionTheme/BaseComponents/Carousels';
import Image from 'src/simi/BaseComponents/Image';
import { cateUrlSuffix, productUrlSuffix, logoUrl } from 'src/simi/Helper/Url';
import LazyLoad from 'src/simi/BaseComponents/LazyLoad';
import Skeleton from 'react-loading-skeleton';

require('./banner.scss');

const Banner = props => {
    const { history, isPhone, data } = props;
    const logo_url = logoUrl()

    if (!data || !data.homebanners)
        return (
            <div className={`banner-homepage container-fluid`}>
                <div className="row"><Skeleton height={300} /></div>
            </div>
        )

    const renderBannerItem = (item, index) => {
        let action = () => { }
        let img = item.banner_name;
        if (isPhone && item.banner_name_tablet) {
            img = item.banner_name_tablet;
        }
        if (parseInt(item.type, 10) === 1) {
            //product detail
            if (item.url_key) {
                action = () => history.push(item.url_key + productUrlSuffix());
            }
        } else if (parseInt(item.type, 10) === 2) {
            //category
            if (item.url_path) {
                action = () => history.push(item.url_path + cateUrlSuffix());
            }
        } else {
            action = (e) => {
                e.preventDefault();
                window.open(item.banner_url);
            }
        }
        return (
            <div className="banner-item" onClick={action} key={index}>
                <LazyLoad placeholder={<img key={index} src={logo_url} alt={item.banner_title} />}>
                    <Image key={index} src={item.banner_name} alt={item.banner_title} />
                </LazyLoad>
            </div>
        )
    }

    let cloneDataForEditing = JSON.parse(JSON.stringify(data));
    const sortData = cloneDataForEditing.homebanners.sort((a, b) => a.sort_order - b.sort_order)

    return (
        <div className={`banner-homepage container-fluid`}>
            <div className="row">
                <Carousel data={sortData} showNumber={1} className="banner" renderItems={renderBannerItem} />
            </div>
        </div>
    );
}

export default Banner;
