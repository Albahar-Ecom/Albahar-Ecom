import React from 'react';
import { Carousel } from "react-responsive-carousel";
import { func, string } from 'prop-types';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Identify from "src/simi/Helper/Identify";

const CarouselBase = props => {
    const { showNumber, className, data, autoPlay, showArrows, showThumbs,
        showIndicators, showStatus, infiniteLoop, lazyLoad, renderItems } = props;

    const renderCarousel = () => {
        const slideSettings = {
            autoPlay,
            showArrows,
            showThumbs,
            showIndicators,
            showStatus,
            infiniteLoop,
            lazyLoad
        };

        const totalItem = data.length;
        const totalSlide = Math.ceil(totalItem / showNumber);
        const slides = [];

        if (renderItems) {
            for (let i = 0; i < totalSlide; i++) {
                const start = showNumber * i;
                const end = showNumber * (i + 1);
                const items = data.slice(start, end).map((item, key) => {
                    return renderItems(item, key)
                });
                const slide = <div className="carousel-lists" key={i}>
                    {items}
                </div>;
                Identify.isRtl() ? slides.unshift(slide) : slides.push(slide);
            }
        }
        return (
            <Carousel {...slideSettings} selectedItem={Identify.isRtl() ? totalSlide - 1 : 0} className={className}>
                {slides}
            </Carousel>
        )
    }

    return (
        <div className={`${className}-container`}>
            {data && renderCarousel(data)}
        </div>
    )
}

CarouselBase.defaultProps = {
    infiniteLoop: true,
    autoPlay: true,
    showArrows: true,
    showThumbs: false,
    showIndicators: false,
    showStatus: false,
    lazyLoad: true,
    className: 'slide',
    showNumber: 1,
    data: []
}

CarouselBase.propTypes = {
    renderItems: func.isRequired
};

export default CarouselBase;
