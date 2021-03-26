import React from 'react';
import StarWhite from 'src/simi/App/FashionTheme/BaseComponents/Icon/StarWhite';
import { configColor } from 'src/simi/Config';;
import PropTypes from 'prop-types';

const SwipeableRate = props => {
    const { rate, size, rate_option, rate_code, change, classes } = props;

    const handleChangeRate = (elementId, id) => {
        if (elementId) {
            const ColorStar = configColor.button_background;
            const star = $('#' + elementId + '_' + id);
            $(star[0]).nextAll().children().css('fill', '#e0e0e0');
            $(star[0]).prevAll().children().css('fill', ColorStar);
            $(star[0]).children().css('fill', ColorStar);
            $(star[0]).prevAll().removeClass('select-star');
            $(star[0]).nextAll().removeClass('select-star');
            $(star[0]).addClass('select-star');
        }
    };

    const renderRate = () => {
        const rateRound = Math.round(rate, 10);
        const rate_point = change ? 'rate-point' : '';
        const select = change ? 'select-star' : '';
        const star = [];
        let point = 0;
        let rate_key = 0;
        let id = '';
        if (change) {
            id = rate_code.replace(/\s/g, '_')
        }
        for (let i = 0; i < 5; i++) {
            if (rate_option) {
                point = rate_option[i].value;
                rate_key = rate_option[i].key;
            }
            if (i + 1 <= rateRound) {
                star.push(
                    <span role="presentation" key={i} id={id + '_' + i} className={rate_point + " rate-star " + select}
                        onClick={() => handleChangeRate(id, i)} data-key={rate_key} data-point={point}>
                        <StarWhite style={{ height: size + 'px', width: size + 'px', fill: configColor.button_background }} />
                    </span>
                );
            } else {
                star.push(
                    <span role="presentation" key={i} id={id + '_' + i} className={rate_point + " rate-star "}
                        onClick={() => handleChangeRate(id, i)} data-key={rate_key} data-point={point}>
                        <StarWhite style={{ fill: '#e0e0e0', height: size + 'px', width: size + 'px' }} />
                    </span>
                );
            }
        }

        return star;
    };

    return <div className={classes["rate-review"]}>{renderRate()}</div>
}

SwipeableRate.defaultProps = {
    rate: 0,
    size: 15,
    rate_option: null,
    rate_code: null,
    change: false,
    classes: {},
};
SwipeableRate.propTypes = {
    rate: PropTypes.number,
    size: PropTypes.number,
    rate_option: PropTypes.array,
    rate_code: PropTypes.string,
    change: PropTypes.bool,
    classes: PropTypes.object,
};
export default SwipeableRate;
