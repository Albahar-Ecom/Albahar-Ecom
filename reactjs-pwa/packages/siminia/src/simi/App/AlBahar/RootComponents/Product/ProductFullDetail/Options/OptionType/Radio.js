import React from 'react';
import Abstract from "./Abstract";
import OptionLabel from '../OptionLabel'
import Identify from 'src/simi/Helper/Identify'
import {validateEmpty} from 'src/simi/Helper/Validation'
import TierPrices from '../../TierPrices'

class RadioField extends Abstract {
    constructor(props) {
        super(props);
        const defaultValue = this.setDefaultSelected(0, false).toString();
        this.state = {
            value: defaultValue
        };
    }

    validateField = (value) => {
        const {data, id} = this.props
        let error = ''
        
        if(data.required && !validateEmpty(value)) {
            error = Identify.__('This is a required field.')
        }

        $(`#error-option-${id}`).text(error)
    }   

    updateCheck = (e, val) => {
        this.validateField(val)
        this.setState({ value: val });
        this.updateSelected(this.key, val);
        this.updateForBundle(val, 'radio');
    };

    renderWithBundle = (data) => {
        const { value } = this.state;
        const { options } = data;

        if (data && data.required) {
            if (!options || !options.length)
                options[0] = {
                    id: 0,
                    name: Identify.__('None')
                }
        }
        const items = [];

        for (const i in options) {
            const item = options[i];
            if (!item || !item.product) continue;

            const isOutOfStock = item.product.stock_status && item.product.stock_status === "OUT_OF_STOCK"
            const itemTypeId = item.product.type_id
            if(!isOutOfStock && (itemTypeId === 'simple' || itemTypeId === 'virtual')) {
                const label = <OptionLabel title={item.product.name} item={item} type_id={this.type_id} />
                const element = (
                    <div className="radio-option-wrapper">
                        <div
                            role="presentation"
                            className={`radio-option radio-option-${this.key} radio-option-${item.id}`}
                            key={i} onClick={(e) => this.updateCheck(e, item.id)} >
                            <div className={`radio-option-input `}>
                                <input
                                    type="radio"
                                    name={`radio-${item.product.name}`}
                                    value={item.option_type_id}
                                    checked={Number(value) === Number(item.id)}
                                    onChange={(e) => this.updateCheck(e, item.id)}
                                />
                            </div>
                            {label}
                        </div>
                        {item.product.price_tiers && <TierPrices price_tiers={item.product.price_tiers} priceObj={item.product.price_range} />}
                    </div>
                );
                items.push(element);
            }
        }
        return items;
    };

    renderWithCustom = (data) => {
        const { value } = this.state
        const values = data.radio_value;

        if (data && !data.required) {
            if (values[0] && values[0].option_type_id !== 0)
                values.unshift({
                    option_type_id: 0,
                    title: Identify.__('None')
                })
        }

        const items = values.map((item) => {
            return (
                <div
                    role="presentation"
                    className={`radio-option radio-option-${this.key} radio-option-${item.option_type_id}`}
                    key={item.option_type_id} onClick={(e) => this.updateCheck(e, item.option_type_id)} >
                    <div className={`radio-option-input `}>
                        <input
                            type="radio"
                            name={`radio-${data.option_id}`}
                            value={item.option_type_id}
                            checked={Number(value) === item.option_type_id}
                            onChange={(e) => this.updateCheck(e, item.option_type_id)}
                        />
                    </div>
                    <OptionLabel title={item.title} item={item} />
                </div>
            )
        })
        return items;
    };

    render = () => {
        const { data } = this.props;
        const {error} = this.state; 
        let items = null;
        if (this.type_id === 'bundle') {
            items = this.renderWithBundle(data);
        }
        else {
            items = this.renderWithCustom(data);
        }
        return (
            <React.Fragment>
                {items}
            </React.Fragment>
        );
    }
}
RadioField.defaultProps = {
    type: 1
};
export default RadioField;
