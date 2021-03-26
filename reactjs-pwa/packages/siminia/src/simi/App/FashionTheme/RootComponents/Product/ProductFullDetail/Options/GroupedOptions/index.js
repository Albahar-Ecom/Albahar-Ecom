import React from 'react';
import Identify from 'src/simi/Helper/Identify';
import { formatPrice as helperFormatPrice } from 'src/simi/Helper/Pricing';
import OptionBase from '../OptionBase';
import { Qty } from 'src/simi/BaseComponents/Input';

require('./groupedoptions.scss')

class GroupOptions extends OptionBase {
    renderOptions = () => {
        const attributes = this.data;
        const objOptions = [];

        for (const i in attributes) {
            const attribute = attributes[i];
            const element = this.renderContentAttribute(attribute);
            objOptions.push(element);
        }
        const header = (
            <div className="row product-options-group-header">
                <div className={`col-sm-8 col-xs-8 ${Identify.isRtl() ? 'pull-right' : ''}`} style={{ textAlign: Identify.isRtl() ? 'right' : 'left', fontWeight: 600, fontSize: 16, lineHeight: '22px', color: '#000' }}>
                    {Identify.__('Product')}
                </div>
                <div className={`col-sm-4 col-xs-4 ${Identify.isRtl() ? 'pull-right' : ''}`} style={{ textAlign: "center", fontWeight: 600, fontSize: 16, lineHeight: '22px', color: '#000' }}>
                    {Identify.__('Quantity')}
                </div>
            </div>
        );
        return (
            <div key={Identify.randomString(5)}>
                <form id="groupOption">
                    {(objOptions && objOptions.length > 0) ? header : ''}
                    {objOptions}
                </form>
            </div>);
    };

    renderContentAttribute = (attribute) => {
        const { product } = attribute;
        const id = product.id
        const qty = attribute.qty;
        const { price_range } = product;

        return (
            <div id={`attribute-${id}`} key={Identify.randomString(5)} className={`row product-options-group-item`}>
                <div className={`col-sm-8 col-xs-8 ${Identify.isRtl() ? 'pull-right' : ''}`}>
                    <div className="option-title" style={{ fontWeight: 500 }}>{attribute.product.name}</div>
                    <div className="price-simple">{helperFormatPrice(price_range.minimum_price.final_price.value, price_range.minimum_price.final_price.currency)}</div>
                </div>
                <div className={`col-sm-4 col-xs-4 text-center ${Identify.isRtl() ? 'pull-right' : ''}`}>
                    {
                        <Qty
                            dataId={id}
                            key={id}
                            value={qty}
                            className={`option-number option-qty option-qty-${id}`}
                            inputStyle={{ margin: '0 auto', borderRadius: 0, border: 'solid #727272 1px', maxWidth: 82, height: 40, fontSize: 20, lineHeight: '20px', fontWeight: 300 }}
                            onChange={() => this.updatePrices()}
                        />
                    }
                </div>
            </div>);
    }

    setParamQty = (keyQty = null) => {
        const json = {};
        const qty = $('input.option-qty');
        qty.each(function () {
            const val = $(this).val();
            const id = $(this).attr('data-id');
            json[id] = val;
        });
        this.params[keyQty] = json;
    };

    getParams = () => {
        this.setParamQty('super_group');
        return this.params;
    }

    render() {
        return (
            <div className="grouped-options">
                {this.renderOptions()}
            </div>
        )
    }
}
export default GroupOptions;
