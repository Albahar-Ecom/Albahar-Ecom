import React, { useRef, useEffect } from 'react';
import Slider from "react-slick";
import ChevronLeft from '../Icon/ChevronLeft'
import ChevronRight from '../Icon/ChevronRight'
require('./slick.theme.min.scss');
require('./slick.min.scss');
require('./slickcarousel.scss');

const NextArrow = (props) => {
    const { onClick, className } = props;
    const disabled = checkClassNameDisabled(className)
    return (
        <div
            role="presentation"
            className={`action next-action ${disabled ? 'action-disable' : ''}`}
            onClick={onClick}
        >
            <ChevronRight style={{width: 24, height: 24, fill: '#fff'}}/>
        </div>
    )
}

const checkClassNameDisabled = (className) => {
    if (className.indexOf('slick-disabled') !== -1) {
        return true
    }

    return false
}

const PrevArrow = (props) => {
    const { onClick, className } = props;
    const disabled = checkClassNameDisabled(className)
    return (
        <div
            role="presentation"
            className={`action prev-action ${disabled ? 'action-disable' : ''}`}
            onClick={onClick}
        >
            <ChevronLeft style={{width: 24, height: 24, fill: '#fff'}} />
        </div>
    )
}

const SlickCarousel = props => {
    const { renderItem, items, paginationFunc, page, totals, usePagination } = props;
    const sliderRef = useRef(null);

    const settings = {
        dots: props.dots,
        infinite: items.length < props.slidesToShow ? false : props.infinite,
        autoplay: props.autoplay,
        arrows: props.arrows,
        speed: props.speed,
        slidesToShow: props.slidesToShow,
        slidesToScroll: props.slidesToScroll,
        responsive: props.responsive,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        beforeChange: (current, next) => handleAfterChange(current, next)
    };

    const handleAfterChange = (current, next) => {
        if (usePagination && items.length - 4 === next && items.length < totals) {
            paginationFunc(page + 1)
        }
    }

    /* useEffect(() => {
        if (!document.getElementById("simiLinkSlickTheme")) {
            let linkSlickTheme = document.createElement('link');
            linkSlickTheme.setAttribute("rel", "stylesheet");
            linkSlickTheme.setAttribute("type", "text/css");
            // linkSlickTheme.onload = function () { CSSDone(); }
            linkSlickTheme.setAttribute("ID", "simiLinkSlickTheme");
            linkSlickTheme.setAttribute("href", `/static/simistatic/slick-theme.min.css`);
            document.getElementsByTagName("head")[0].appendChild(linkSlickTheme);
        }

        if (!document.getElementById("simiLinkSlick")) {
            let linkSlick = document.createElement('link');
            linkSlick.setAttribute("rel", "stylesheet");
            linkSlick.setAttribute("type", "text/css");
            // linkSlick.onload = function () { CSSDone(); }
            linkSlick.setAttribute("ID", "simiLinkSlick");
            linkSlick.setAttribute("href", `/static/simistatic/slick.min.css`);
            document.getElementsByTagName("head")[0].appendChild(linkSlick);
        }
    }) */

    const renderItems = () => {
        return items.map((item, index) => {
            return renderItem(item, index)
        })
    }

    return (
        <Slider {...settings} ref={sliderRef} >
            {renderItems()}
        </Slider>
    );
}

SlickCarousel.defaultProps = {
    dots: false,
    infinite: false,
    autoplay: false,
    arrows: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    usePagination: false,
    responsive: [
        {
            breakpoint: 1023,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            }
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            }
        },
    ],
}

export default SlickCarousel;
