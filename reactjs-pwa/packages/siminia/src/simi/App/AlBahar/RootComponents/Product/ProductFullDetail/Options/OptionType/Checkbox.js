import React from 'react';
import Abstract from "./Abstract";
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import OptionLabel from '../OptionLabel'
import TierPrices from '../../TierPrices'

class CheckboxField extends Abstract {
    constructor(props) {
        super(props);
        const checked = this.setDefaultSelected(this.props.value);
        this.state = {
            checked
        }
    }

    validateField = (value) => {
        const {item, id} = this.props
        let error = ''
        if(item.required && (value.length && value.length === 0)) {
            error = Identify.__('This is a required field.')
        }

        $(`#error-option-${id}`).text(error)
    }   

    updateCheck = () => {
        this.setState((oldState) => {
            const checked = !oldState.checked;
            const key = this.props.id;
            let multiChecked = this.props.parent.selected[key];
            multiChecked = multiChecked instanceof Array ? multiChecked : [];
            if(checked){
                multiChecked.push(this.props.value);

            }else{
                const index = multiChecked.indexOf(this.props.value);
                multiChecked.splice(index,1);
            }
            this.validateField(multiChecked);
            this.updateSelected(key,multiChecked);
            return {checked };
        });
    };

    render = () => {
        this.className += ' checkbox-option';
        const { item, title } = this.props;

        const {product} = item || {}

        const {stock_status, price_tiers, price_range, type_id} = product || {}

        const isOutOfStock = stock_status && stock_status === "OUT_OF_STOCK"

        if(!isOutOfStock && (type_id === 'simple' || type_id === 'virtual')) {
            return (
                <div className="option-value-item-checkbox-wrapper">
                    <div className="option-value-item-checkbox" id={`check-box-option-${this.props.value}`} style={{width : '100%'}}>
                        <FormControlLabel
                            style={{
                                color:'#333'
                            }}
                            control={<Checkbox
                                checked={this.state.checked}
                                onChange={() => this.updateCheck()}
                                style={{
                                    fontFamily : 'Montserrat, sans-serif',
                                    color: "#0082FF"
                                }}
                                
                                // classes={{
                                //     root: classes.root,
                                //     checked: classes.checked,
                                // }}
                            />}
                            label={<OptionLabel title={title} item={item} type_id={this.type_id}/>}
                        />
                    </div>
                    {price_tiers && <TierPrices price_tiers={price_tiers} priceObj={price_range} />}
                </div>  
            );
        }
        
        return null;
    }
}
export default CheckboxField;
