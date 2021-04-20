import React, {useMemo} from 'react';
import Identify from 'src/simi/Helper/Identify';
import { shape, string } from 'prop-types';
import { formatPriceLabel } from 'src/simi/Helper/Pricing';

const TierPrices = props => {
    const { price_tiers, priceObj } = props;
    
    const price = useMemo(() => {
        if(
            priceObj && 
            priceObj.minimalPrice && 
            priceObj.minimalPrice.amount && 
            priceObj.minimalPrice.amount.value
        ) {
            return priceObj.minimalPrice.amount.value
        }

        if(
            priceObj
            && priceObj.minimum_price 
            && priceObj.minimum_price.final_price
            && priceObj.minimum_price.final_price.value
        ) {
            return priceObj.minimum_price.final_price.value
        }

        return null
    }, [priceObj])

    if (!price_tiers || !price_tiers instanceof Array || !price_tiers.length) return null;

    const tier_label = price_tiers.map((tier, idx) => {
        const { discount, final_price, quantity } = tier;

        if(!price || final_price.value >= price) return;
  
        const newDiscount = Math.round((100 - (final_price.value/price)*100))

        const finalLabel = Identify.__('By %s for %k each and').replace('%s', quantity).replace('%k', formatPriceLabel(final_price.value, final_price.currency));
        const finalSave = <b>{Identify.__('save %c%').replace('%c', newDiscount || discount.percent_off)}</b>
        return <li key={idx}>
            {finalLabel + ' '}
            {finalSave}
        </li>
    });

    return (<ul className='tier-prices-bundle'>{tier_label}</ul>);
}

TierPrices.propTypes = {
    classes: shape({ root: string })
};
TierPrices.defaultProps = {};
export default TierPrices;
