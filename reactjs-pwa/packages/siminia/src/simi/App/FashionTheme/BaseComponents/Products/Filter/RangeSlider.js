import React, { useState } from 'react';
import InputRange from 'react-input-range';
import Identify from 'src/simi/Helper/Identify'
import { formatPrice } from 'src/simi/Helper/Pricing';
require('./rangeslider.scss');

const RangeSlider = (props) => {

    const { priceFrom, priceTo, leftPrice, rightPrice, clickedFilter } = props;

    let slideObj = { min: leftPrice, max: rightPrice };
    const [slide, setSlide] = useState(slideObj);

    const handleChangeSlide = (val) => {
        setSlide(val);
    }

    const handleCompleted = (value) => {
        const objVal = Object.values(value);
        const strVal = objVal.join('-');
        if (clickedFilter) {
            clickedFilter('price', strVal);
        }
    }

    return (
        <div className={`filter-price-range ${Identify.isRtl() ? 'price-range-rtl' : ''}`}>
            <InputRange
                draggableTrack
                formatLabel={value => formatPrice(value)}
                maxValue={priceTo}
                minValue={priceFrom}
                onChange={value => handleChangeSlide(value)}
                onChangeComplete={value => handleCompleted(value)}
                value={slide} />
        </div>
    );
}

export default RangeSlider;
