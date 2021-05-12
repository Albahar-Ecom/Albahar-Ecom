import React from 'react';
import InputRange from 'react-input-range';
import Identify from 'src/simi/Helper/Identify'
import { formatPrice } from 'src/simi/Helper/Pricing';
require('./rangeslider.scss');

class RangeSlider extends React.Component {
    constructor(props) {
        super(props);

        this.minPrice = Math.floor(this.props.priceFrom);
        this.maxPrice = Math.ceil(this.props.priceTo);
        this.state = {
            slide: {
                min: Math.floor(this.props.leftPrice),
                max: Math.ceil(this.props.rightPrice),
            },
        };
    }

    handleChangeSlide = (val) => {
        this.setState({ slide: val })
    }

    handleCompleted = (value) => {
        const { clickedFilter } = this.props
        const objVal = Object.values(value);
        const strVal = objVal.join('-');
        clickedFilter('price', strVal)
    }


    render() {
        const { slide } = this.state;
        console.log(slide)

        return (
            <div className={`filter-price-range ${Identify.isRtl() ? 'price-range-rtl' : ''}`}>
                <InputRange
                    draggableTrack
                    formatLabel={value => formatPrice(value)}
                    maxValue={this.maxPrice}
                    minValue={this.minPrice}
                    onChange={value => this.handleChangeSlide(value)}
                    onChangeComplete={value => this.handleCompleted(value)}
                    value={slide} />
            </div>
        );
    }
}

export default RangeSlider;